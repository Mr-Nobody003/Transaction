import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface ITokenBlacklist {
    token: string;
    blacklistedAt: Date;
}

type TokenBlacklistDocument = ITokenBlacklist & Document;

const tokenblacklistSchema = new Schema<TokenBlacklistDocument, Model<TokenBlacklistDocument>>({
    token: {
        type: String,
        required: [true, "Token must be associated with Blacklist"],
        index: true,
        unique: [true,"Token must be unique in Blacklist"]
    },
},{
    timestamps: true
});

tokenblacklistSchema.index({createdAt: 1}, {expireAfterSeconds: 60*60*24*3}); // Expire tokens after 3 days

const TokenBlacklistModel = model<TokenBlacklistDocument>("Blacklist", tokenblacklistSchema);
export default TokenBlacklistModel;