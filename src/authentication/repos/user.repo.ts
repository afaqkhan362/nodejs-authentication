import { userModel } from '../models/users.model';
import { IUsers } from '../interface/user.interface';

export class UserRepo {
  addUser = async (userProfile) => {
    const user: IUsers = await new userModel(userProfile).save();
    return user;
  };

  getUserDetails = async (userId: string) => {
    const user = await userModel
      .findOne({
        userId,
      })
      .lean();

    return user;
  };
}
