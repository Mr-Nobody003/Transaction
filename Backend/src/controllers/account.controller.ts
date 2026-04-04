import { Request, Response, NextFunction } from 'express';
import AccountModel from "../models/account.model.js";

/**
 * @description Account Creation Controller
 * @route POST /api/v1/accounts
 * @access Public
 */
async function createAccountController(req: Request, res: Response) {
    const user = req.user;
    const account = await AccountModel.create(
        {
            user: user._id
        });

    res.status(201).json({
        account
    });

}

export { createAccountController };