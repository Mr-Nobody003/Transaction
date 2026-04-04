import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface ITransaction {
    from_Account: mongoose.Schema.Types.ObjectId;
    to_Account: mongoose.Schema.Types.ObjectId;
    status: string;
    amount: Number;
    idempotencyKey: string;
}

type TransactionDocument = ITransaction & Document;

const transactionSchema = new Schema<TransactionDocument, Model<TransactionDocument>>({
    from_Account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction FROM account must be associated"],
        index: true
    },
    to_Account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction FROM account must be associated"],
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be one of these only - PENDING , COMPLETED , FAILED , REVERSED "
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "An Amount is required for transaction"],
        min: [0, "Amount can not be negative or zero"],
    },
    idempotencyKey: {
        type: String,
    }
}, {
    timestamps: true
});

const TransactionModel = model<TransactionDocument, Model<TransactionDocument>>('Transaction', transactionSchema);

export default TransactionModel;