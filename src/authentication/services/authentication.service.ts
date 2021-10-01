import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as randToken from "rand-token";
import { ApiError } from "../../utils/ApiError";

import { IAccount } from "../interface/accounts.interface";
import { AuthenticationRepo } from "../repos/authentication.repo";
import { UserRepo } from '../repos/user.repo';
import {
  ACCOUNT_CREATION_FAILED,
  USER_CREATION_FAILED,
  ACCOUNT_ALREADY_EXISTS,
  USER_DOES_NOT_EXIST,
  INCORRECT_PASSWORD,
} from "../utils/ErrorMessages";

export class AuthenticationService {
  private readonly authenticationRepo: AuthenticationRepo =
    new AuthenticationRepo();
  private readonly userRepo: UserRepo = new UserRepo();

  createAccount = async (signUpDto, refreshToken: string) => {
    const existingAccount = await this.authenticationRepo.getAccountByEmail(
      signUpDto.email
    );
    if (existingAccount) {
      throw new ApiError(
        400,
        ACCOUNT_ALREADY_EXISTS.getErrorMessage({ email: signUpDto.email }),
        ACCOUNT_ALREADY_EXISTS.errorCode
      );
    }

    const hash = await bcrypt.hash(signUpDto.password, bcrypt.genSaltSync());
    signUpDto.password = hash;
    const accountData: IAccount = {
      email: signUpDto.email,
      password: signUpDto.password,
      refreshToken: [
        {
          token: refreshToken,
          userAgent: "Array.com",
        },
      ],
    };
    const account = await this.authenticationRepo.createAccount(accountData);

    if (!account) {
      throw new ApiError(
        500,
        ACCOUNT_CREATION_FAILED.getErrorMessage({ email: account.email }),
        ACCOUNT_CREATION_FAILED.errorCode
      );
    }

    return account;
  };

  addUser = async (userProfile) => {
    const user = await this.userRepo.addUser(userProfile);
    if (!user) {
      throw new ApiError(
        500,
        USER_CREATION_FAILED.getErrorMessage(userProfile.userId),
        USER_CREATION_FAILED.errorCode,
      );
    }

    return user;
  };

  getRefreshToken = (): string => {
    const refreshToken: string = randToken.generate(128);
    return refreshToken;
  };

  getAccessToken = (account: IAccount, user, refreshToken: string): string => {
    const jwtData = {
      ...user,
      email: account.email,
    };

    const privateKey = process.env.JWT_SIGNING_KEY_PATH;

    const jwtToken = jwt.sign(jwtData, privateKey, {
      issuer: process.env.AUTH_ISSUER,
      expiresIn: process.env.JWT_TOKEN_EXPIRY || "60 days",
    });

    return jwtToken;
  };

  authenticate = async (email: string, password: string) => {
    const account = await this.authenticationRepo.getAccountByEmail(email);

    if (!account) {
      throw new ApiError(
        400,
        USER_DOES_NOT_EXIST.getErrorMessage(),
        USER_DOES_NOT_EXIST.errorCode
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, account.password);

    if (!isPasswordCorrect) {
      throw new ApiError(
        400,
        INCORRECT_PASSWORD.getErrorMessage(),
        INCORRECT_PASSWORD.errorCode
      );
    }

    return account;
  };

  signIn = async (email: string) => {
    const account = await this.authenticationRepo.getAccountByEmail(email);

    const refreshToken = this.getRefreshToken();

    await this.authenticationRepo.addRefreshToken(account.email, refreshToken);

    const user = await this.userRepo.getUserDetails(account._id.toString());

    const accessToken = await this.getAccessToken(account, user, refreshToken);

    return {
      refreshToken,
      accessToken,
      userData: {
        ...user,
        email: account.email,
      },
    };
  };

  signOut = async (userId: string, refreshToken: string): Promise<void> => {
    const user: IAccount = await this.authenticationRepo.getAccountByUserId(
      userId
    );

    user.refreshToken = user.refreshToken.filter((refreshTokens) => {
      return refreshTokens.token !== refreshToken;
    });

    await this.authenticationRepo.update(userId, user);
  };
}
