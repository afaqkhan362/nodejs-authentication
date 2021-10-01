import * as mongoose from 'mongoose';

interface RefreshToken {
  token: String;
  userAgent: String;
}

export interface IAccount {
  _id?: mongoose.Schema.Types.ObjectId;
  email: String;
  password: String;
  refreshToken: RefreshToken[];
}
