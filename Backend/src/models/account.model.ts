import mongoose, { Schema, model, Document, Model } from 'mongoose';
import LedgerModel from './ledger.model.js';

interface IAccount {
    user: mongoose.Schema.Types.ObjectId;
    status: string;
    currency: string;
}

interface IAccountMethods {
    getBalance(session?: mongoose.ClientSession): Promise<any>;
}

type AccountDocument = IAccount & Document & IAccountMethods;

const accountSchema = new Schema<AccountDocument, Model<AccountDocument>, IAccountMethods>({
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



accountSchema.methods.getBalance = async function (session?: mongoose.ClientSession) {
    const aggregateOptions = session ? { session } : undefined;
    const balanceData = await LedgerModel.aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            {
                                $eq: ["$type", "DEBITED"]
                            },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            {
                                $eq: ["$type", "CREDITED"]
                            },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ["$totalCredit", "$totalDebit"]
                }
            }
        }
    ], aggregateOptions);

    if (balanceData.length === 0) return 0;

    return balanceData[0].balance;
}

const AccountModel = model<AccountDocument, Model<AccountDocument>>('Account', accountSchema);

export default AccountModel;