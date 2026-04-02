import userModel  from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * @description User Registration Controller
 * @route POST /api/v1/auth/register
 * @access Public
 */
async function userRegisterController(req: any, res: any) {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne(
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

    const user = await userModel.create({
        name,
        email,
        password
    });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" }
    );

    res.cookie("token", token);
    res.status(201).json(
        {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token,
            message: "User created successfully",
            status: "Success"
        }
    );

}


/**
 * @description User Login Controller
 * @route POST /api/v1/auth/login
 * @access Public
 */
async function userLoginController(req: any, res: any){
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(
            {
                message: "Email and password are required",
                status: "Failed to login"
            }
        );
    }

    const user= await userModel.findOne({ email }).select("+password") ;

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

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" }
    );
    res.cookie("token", token);
    res.status(200).json(
        {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token,
            message: "User Logged successfully",
            status: "Success"
        }
    );

}



export { userRegisterController, userLoginController };