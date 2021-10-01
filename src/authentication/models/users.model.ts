import * as mongoose from 'mongoose';

import { IUsers } from '../interface/user.interface';

const userSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model<IUsers>('users', userSchema);
