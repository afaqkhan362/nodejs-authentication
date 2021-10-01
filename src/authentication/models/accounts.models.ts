import { IAccount } from '../interface/accounts.interface';
import * as mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, _id: false },
);

const accountsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [refreshTokenSchema],
});

export const accountsModel = mongoose.model<IAccount>(
  'accounts',
  accountsSchema,
);
