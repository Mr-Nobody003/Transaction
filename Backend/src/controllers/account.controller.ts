import { Request, Response, NextFunction } from 'express';
import AccountModel from "../models/account.model.js";

/**
 * @description Account Creation Controller
 * @route POST /api/v1/accounts
 * @access PROTECTED
 */
async function createAccountController(req: Request, res: Response) {
    const user = req.user;
    const existingAccount = await AccountModel.findOne({ user: user._id });

    if (existingAccount) {
        return res.status(400).json({
            message: "Account already exists for this user",
            status: "Failed to create account"
        });
    }

    const account = await AccountModel.create(
        {
            user: user._id
        });

    res.status(201).json({
        account
    });

}

/**
 * @description Account Creation Controller
 * @route GET /api/v1/accounts
 * @access PROTECTED
 */
async function getUserAccountController(req: Request, res: Response) {
    const account = await AccountModel.find(
        {
            user: req.user._id
        });

    res.status(200).json({
        account
    });
}

/**
 * @description Account Balance Controller
 * @route GET /api/v1/accounts/balance/:accountId
 * @access PROTECTED
 */
async function getAccountBalance(req: Request, res: Response) {
    const accountId = req.params.accountId as string;
    const account = await AccountModel.findOne(
        {
            _id: accountId,
            user: req.user._id
        });

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "Failed to get account balance"
        });
    }

    const balance = await account.getBalance();

    return res.status(200).json({
        accountId: account._id,
        balance
    });
}

export {
    createAccountController,
    getUserAccountController,
    getAccountBalance
};