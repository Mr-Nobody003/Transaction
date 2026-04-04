import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface IAccount {
    user: mongoose.Schema.Types.ObjectId;
    status: string;
    currency: string;
}

type AccountDocument = IAccount & Document;

const accountSchema = new Schema<AccountDocument, Model<AccountDocument>>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference to user model
        required: [true, "Account must be associated witha user"],
        index: true //to find data fast
    },

    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "CLOSED", "FROZEN"],
            message: "Status can be either ACTIVE or CLOSED or FROZEN"
        },
        default: "ACTIVE"
    },

    currency: {
        type: String,
        required: [true, "Currency is required"],
        uppercase: true,
        match: [/^[A-Z]{3}$/, "Currency must be a 3-letter ISO code"],
        default: "INR"
    }

}, {
    timestamps: true
});

//compound index
accountSchema.index({ user: 1, status: 1 }) //to index user , status 

const AccountModel = model<AccountDocument, Model<AccountDocument>>('Account', accountSchema);

export default AccountModel;