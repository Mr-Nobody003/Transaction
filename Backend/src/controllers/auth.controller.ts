import { Request, Response, NextFunction } from 'express';
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/gmail.service.js";
import TokenBlacklistModel from '../models/token.blacklist.model.js';

/**
 * @description User Registration Controller
 * @route POST /api/v1/auth/register
 * @access Public
 */
async function userRegisterController(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne(
        {
            email: email
        }
    );

    if (existingUser) {
        return res.status(422).json(
            {
                message: "Email already exists",
                status: "Failed to create user"
            }
        );
    }

    const user = await UserModel.create({
        name,
        email,
        password
    });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.status(201).json(
        {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            message: "User created successfully",
            status: "Success"
        }
    );

    // Send registration email
    await sendRegistrationEmail(user.email, user.name);

}


/**
 * @description User Login Controller
 * @route POST /api/v1/auth/login
 * @access Public
 */
async function userLoginController(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(
            {
                message: "Email and password are required",
                status: "Failed to login"
            }
        );
    }

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json(
            {
                message: "Invalid email or password",
                status: "Failed to login"
            }
        );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json(
            {
                message: "Invalid email or password",
                status: "Failed to login"
            }
        );
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is missing on Vercel");
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.status(200).json(
        {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            message: "User Logged successfully",
            status: "Success"
        }
    );
}


/**
 * @description User Logout Controller
 * @route POST /api/v1/auth/logout
 * @access Public
 */
async function userLogoutController(req: Request, res: Response) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json(
            {
                message: "Token is required for logout",
                status: "Failed to logout"
            }
        );
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    await TokenBlacklistModel.create({ token: token });

    res.status(200).json(
        {
            message: "User logged out successfully",
            status: "Success"
        }
    );
}

export {
    userRegisterController,
    userLoginController,
    userLogoutController
};