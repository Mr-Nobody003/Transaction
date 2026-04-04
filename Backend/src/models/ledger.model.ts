import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface ILedger {
    account: mongoose.Schema.Types.ObjectId;
    amount: number;
    transaction: mongoose.Schema.Types.ObjectId;
    type: string;

}


type LedgerDocument = ILedger & Document;

const ledgerSchema = new Schema<LedgerDocument, Model<LedgerDocument>>({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Account ID must be associated with Ledger"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "An Amount must be associated with Ledger"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Transaction ID must be associated with Ledger"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["CREDITED", "DEBITED"],
            message: "Type can be either CREDITED or DEBITED"
        },
        required: [true, "Type of transaction must be associated with Ledger"],
        immutable: true
    }

});


function preventLedgerModification() {
    throw new Error("Ledger entries are immutable can't be modified or deleted");
};
//block all modifications and delete
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
//ledgerSchema.pre("remove",preventLedgerModification); for older mongodb versions





const LedgerModel = model<LedgerDocument, Model<LedgerDocument>>('Ledger', ledgerSchema);

export default LedgerModel;