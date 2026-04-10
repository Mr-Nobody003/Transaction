import { Request, Response } from 'express';
import AccountModel from "../models/account.model.js";
import TransactionModel from "../models/transaction.model.js";
import mongoose from 'mongoose';
import LedgerModel from '../models/ledger.model.js';
import { sendTransactionFailureEmail, sendTransactionNotificationEmail } from '../services/gmail.service.js';

/**
 * @description Transaction Creation Controller
 * @route POST /api/v1/transactions
 * @access Public
 */
async function createTransactionController(req: Request, res: Response) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    const numericAmount = Number(amount);

    //check if body has all necessary data 
    if (!fromAccount || !toAccount || amount === undefined || amount === null || !idempotencyKey) {
        return res.status(400).json(
            {
                "message": "fromAccount, toAccount, amount, idempotencyKey are required"
            })
    }

    //check if users are valid 
    const fromAccountUser = await AccountModel.findOne({ _id: fromAccount });
    if (!fromAccountUser) {
        return res.status(400).json(
            {
                "message": "fromAccountUser does not exsists"
            });
    }

    const toAccountUser = await AccountModel.findOne({ _id: toAccount });
    if (!toAccountUser) {
        return res.status(400).json(
            {
                "message": "toAccountUser does not exsists"
            });
    }

    //check if both user account are active for transaction to proceed
    if (fromAccountUser.status !== "ACTIVE") {
        return res.status(400).json(
            {
                "message": "fromAccount user account is not active"
            });
    }
    if (toAccountUser.status !== "ACTIVE") {
        return res.status(400).json(
            {
                "message": "toAccount user account is not active"
            });
    }

    //check if same key exists
    const transaction_validation = await TransactionModel.findOne({ idempotencyKey: idempotencyKey });
    if (transaction_validation) {
        if (transaction_validation.status === "COMPLETED") {
            return res.status(200).json({
                "message": "Transaction already completed",
                "Transaction details": transaction_validation
            })
        }
        if (transaction_validation.status === "PENDING") {
            return res.status(200).json({
                "message": "Transaction is Pending"
            });
        }
        if (transaction_validation.status === "FAILED") {
            return res.status(500).json({
                "message": "Transaction processing failed , please try again"
            });
        }
        else {
            return res.status(400).json({
                "message": "Same idempotencykey found"
            });
        }
    }

    //derive balance from sender
    const fromUserBalance = await fromAccountUser.getBalance();

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
            "message": "amount must be a valid number greater than 0",
        });
    }

    if (fromUserBalance < numericAmount) {
        return res.status(400).json({
            "message": `Insufficient Balance , Current balance ${fromUserBalance} , Requested amount is ${numericAmount}`,
        });
    }


    //Create transaction session , (PENDING)
    /** 
     @description CRITICAL SECTION
    */
    const session = await mongoose.startSession();
    session.startTransaction();

    let transactionResult: any = null;
    let pendingTransactionId: string = "N/A";

    try {
        const transaction = new TransactionModel({
            from_Account: fromAccount,
            to_Account: toAccount,
            amount: numericAmount,
            idempotencyKey,
            status: "PENDING"
        });

        pendingTransactionId = transaction._id.toString();

        await transaction.save({ session });

        /**
         * - amount going out
         */
        const debitLedgerEntry = new LedgerModel({
            account: fromAccount,
            amount: numericAmount,
            transaction: transaction._id,
            type: "DEBITED"
        });

        await debitLedgerEntry.save({ session });

        /**
         * - amount going in
         */
        const creditLedgerEntry = new LedgerModel({
            account: toAccount,
            amount: numericAmount,
            transaction: transaction._id,
            type: "CREDITED"
        });

        await creditLedgerEntry.save({ session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();

        transactionResult = {
            transaction,
            ledgerEntries: {
                debit: debitLedgerEntry,
                credit: creditLedgerEntry
            }
        };

    } catch (error) {
        await session.abortTransaction();

        // Send failure email since transaction was aborted
        try {
            await sendTransactionFailureEmail(
                req.user.email,
                req.user.name,
                numericAmount,
                pendingTransactionId
            );
        } catch (emailError) {
            console.error("Failed to send transaction failure email:", emailError);
        }

        return res.status(500).json({
            message: "Transaction processing failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    } finally {
        await session.endSession();
    }

    /**
     * @description Send Email Notifcation
     */
    if (transactionResult) {
        try {
            // Send email non-blocking to prevent transaction response failure
            await sendTransactionNotificationEmail(
                (req as any).user.email,
                (req as any).user.name,
                numericAmount,
                transactionResult.transaction._id.toString()
            );
        } catch (emailError) {
            console.error("Failed to send transaction notification email:", emailError);
        }

        return res.status(201).json({
            message: "Transaction created successfully",
            transaction: transactionResult.transaction,
            ledgerEntries: transactionResult.ledgerEntries
        });
    }
}

async function createInitialUserFundsTransaction(req: Request, res: Response) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || amount === undefined || amount === null || !idempotencyKey) {
        return res.status(400).json(
            {
                "message": "toAccount, amount, idempotencyKey are required"
            })
    }

    const toAccountUser = await AccountModel.findOne({ _id: toAccount });
    const numericAmount = Number(amount);

    if (!toAccountUser) {
        return res.status(400).json(
            {
                "message": "toAccount user account does not exsists"
            });
    }


    const fromAccountUser = await AccountModel.findOne(
        {
            user: req.user._id
        });

    if (!fromAccountUser) {
        return res.status(400).json(
            {
                "message": "SYSTEM account does not exsists"
            });
    }

    //check if same key exists
    const transaction_validation = await TransactionModel.findOne({ idempotencyKey: idempotencyKey });
    if (transaction_validation) {
        if (transaction_validation.status === "COMPLETED") {
            return res.status(200).json({
                "message": "Transaction already completed",
                "Transaction details": transaction_validation
            })
        }
        if (transaction_validation.status === "PENDING") {
            return res.status(200).json({
                "message": "Transaction is Pending"
            });
        }
        if (transaction_validation.status === "FAILED") {
            return res.status(500).json({
                "message": "Transaction processing failed , please try again"
            });
        }
        else {
            return res.status(400).json({
                "message": "Same idempotencykey found"
            });
        }
    }


    const session = await mongoose.startSession();
    session.startTransaction();
    let transactionResult: any = null;
    let pendingTransactionId: string = "N/A";
    try {
        const transaction = new TransactionModel({
            from_Account: fromAccountUser._id,
            to_Account: toAccountUser._id,
            amount: numericAmount,
            idempotencyKey,
            status: "PENDING"
        });

        pendingTransactionId = transaction._id.toString();

        await transaction.save({ session });

        /**
         * - amount going out
         */
        const debitLedgerEntry = new LedgerModel({
            account: fromAccountUser._id,
            amount: numericAmount,
            transaction: transaction._id,
            type: "DEBITED"
        });

        await debitLedgerEntry.save({ session });

        /**
         * - amount going in
         */
        const creditLedgerEntry = new LedgerModel({
            account: toAccountUser._id,
            amount: numericAmount,
            transaction: transaction._id,
            type: "CREDITED"
        });

        await creditLedgerEntry.save({ session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();

        transactionResult = {
            transaction,
            ledgerEntries: {
                debit: debitLedgerEntry,
                credit: creditLedgerEntry
            }
        };

    } catch (error) {
        await session.abortTransaction();

        // Send failure email since transaction was aborted
        try {
            await sendTransactionFailureEmail(
                req.user.email,
                req.user.name,
                numericAmount,
                pendingTransactionId
            );
        } catch (emailError) {
            console.error("Failed to send transaction from SYSTEM , failure email:", emailError);
        }

        return res.status(500).json({
            message: "Transaction processing failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    } finally {
        await session.endSession();
    }


    if (transactionResult) {
        try {
            // Send email non-blocking to prevent transaction response failure
            await sendTransactionNotificationEmail(
                (req as any).user.email,
                (req as any).user.name,
                numericAmount,
                transactionResult.transaction._id.toString()
            );
        } catch (emailError) {
            console.error("Failed to send transaction notification email:", emailError);
        }

        return res.status(201).json({
            message: "Transaction created successfully from SYSTEM",
            transaction: transactionResult.transaction,
            ledgerEntries: transactionResult.ledgerEntries
        });
    }


}

export { createTransactionController, createInitialUserFundsTransaction };
