import { Request, Response, NextFunction } from 'express';
import AccountModel from "../models/account.model.js";
import TransactionModel from "../models/transaction.model.js";


/**
 * @description Transaction Creation Controller
 * @route POST /api/v1/transactions
 * @access Public
 */
async function createTransactionController(req: Request, res: Response) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    //check if body has all necessary data 
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json(
            {
                "message": "fromAccount, toAccount, amount, idempotencyKey are required"
            })
    }
    
    //check if users are valid 
    const fromAccountUser =await AccountModel.findOne({_id:fromAccount});
    if(!fromAccountUser){
        return res.status(400).json(
            {
                "message":"fromAccountUser does not exsists"
            });
    }

    const toAccountUser =await AccountModel.findOne({_id:toAccount});
    if(!toAccountUser){
        return res.status(400).json(
            {
                "message":"toAccountUser does not exsists"
            });
    }

    //check if both user account are active for transaction to proceed
    if(fromAccount.status!=="ACTIVE"){
        return res.status(400).json(
            {
                "message":"fromAcount User Accounts is not active"
            });
    }
    if(toAccount.status!=="ACTIVE"){
        return res.status(400).json(
            {
                "message":"toAcount User Accounts is not active"
            });
    }

    //check if same key exsists
    const transaction_validation =await TransactionModel.findOne({idempotencyKey:idempotencyKey});
    if(transaction_validation){
        if(transaction_validation.status==="COMPLETED"){
            return res.status(200).json({
                "message":"Transaction already completed",
                "Transaction details":transaction_validation
            })
        }
        if(transaction_validation.status==="PENDING"){
            return res.status(200).json({
                "message":"Transaction is Pending"
            });
        }
        if(transaction_validation.status==="FAILED"){
            return res.status(500).json({
                "message":"Transaction processing failed , please try again"
            });
        }
        else {
            return res.status(400).json({
                "message":"Same idempotencykey found"
            });
        }
    } 

}

export { createTransactionController };