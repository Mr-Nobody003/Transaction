import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from "bcryptjs";

interface IUser {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    systemUser: boolean;
}

interface IUserMethods {
    comparePassword(AccessingUserPassword: string): Promise<boolean>;
}

type UserDocument = IUser & Document & IUserMethods;

const userSchema = new Schema<UserDocument, Model<UserDocument>, IUserMethods>({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [300, "Name must be less than 300 characters long"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: [true, "Email already exists"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        required: true,
        immutable: true,
        select: false
    },
    createdAt: { type: Date, default: Date.now }
},
    {
        timestamps: true
    });

userSchema.pre("save", async function (this: UserDocument) {

    if (!this.isModified("password")) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
        throw new Error("Error hashing password");
    }
});

userSchema.methods.comparePassword = async function (Password: string): Promise<boolean> {
    return await bcrypt.compare(Password, this.password);
}

const UserModel = model<UserDocument, Model<UserDocument>>('User', userSchema);

export default UserModel;