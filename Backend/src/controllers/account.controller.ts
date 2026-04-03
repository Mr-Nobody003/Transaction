import AccountModel from "../models/account.model.js";

/**
 * 
 * @description After user is Authorised create account 
 */
async function createAccountController(req: any, res: any) {
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