import { IAccount } from "../interface/accounts.interface";
import { accountsModel } from "../models/accounts.models";

export class AuthenticationRepo {
  createAccount = async (accountData: IAccount) => {
    const account = await new accountsModel(accountData).save();
    return account;
  };

  getAccountByEmail = async (email: String) => {
    const account = await accountsModel
      .findOne({
        email,
      })
      .lean();
    return account;
  };  

  addRefreshToken = async (email: String, refreshToken: String) => {
    const updatedAccount = await accountsModel
      .updateOne(
        {
          email,
        },
        {
          $push: {
            refreshToken: {
              token: refreshToken,
              userAgent: "Development",
            },
          },
        }
      )
      .lean();
    return updatedAccount;
  };

  getAccountByUserId = async (_userId: string): Promise<IAccount> => {
    const account: IAccount = await accountsModel.findOne({ _id: _userId });

    return account;
  };

  update = async (userId, user): Promise<IAccount> => {
    const updatedUser: IAccount = await accountsModel
      .updateOne({ userId }, user)
      .lean();
    return updatedUser;
  };
}
