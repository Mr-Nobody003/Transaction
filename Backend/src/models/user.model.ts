import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: [true, "Email already exists"],
        match: [/^.+@(?:\w-]+\.)+\w+$/
            , "Please fill a valid email address"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    createdAt: { type: Date, default: Date.now }
}, 
{ 
    timestamps: true 
});

userSchema.pre("save" as any, async function(next: (err?: Error) => void) {
    
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

userSchema.methods.comparePassword = async function (Password: string): Promise<boolean> {
    return await bcrypt.compare(Password, this.password);
}


export const userModel = mongoose.model("User", userSchema);