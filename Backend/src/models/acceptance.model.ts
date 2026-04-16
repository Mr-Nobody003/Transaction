import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface IAcceptance {
    Acceptor: mongoose.Schema.Types.ObjectId;
    Sender: mongoose.Schema.Types.ObjectId;
    duration: number;
    expireAt: Date;
}

type AcceptanceDocument = IAcceptance & Document;

const acceptanceSchema = new Schema<AcceptanceDocument, Model<AcceptanceDocument>>({
    Acceptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Acceptor must be associated with a user"],
        index: true //to find data fast
    },
    Sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Sender must be associated with a user"],
        index: true //to find data fast
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 day"],
        max: [30, "Duration cannot exceed 30 days"]
    },
    expireAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

acceptanceSchema.pre("save", async function (this: AcceptanceDocument) {
    this.expireAt = new Date(Date.now() + this.duration * 24 * 60 * 60 * 1000); // Set expireAt based on duration
});

acceptanceSchema.index({ Acceptor: 1, Sender: 1 }, { unique: true }); //to ensure that there is only one acceptance between a pair of accounts
acceptanceSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 }); //to automatically delete expired acceptances

const AcceptanceModel = model<AcceptanceDocument, Model<AcceptanceDocument>>('Acceptance', acceptanceSchema);
export default AcceptanceModel;