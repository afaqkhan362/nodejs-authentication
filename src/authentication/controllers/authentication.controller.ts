import * as express from "express";

import { ApiError } from "../../utils/ApiError";
import { AuthenticationService } from "../services/authentication.service";
import {
  PASSWORD_NOT_MATCHED,
  ACCOUNT_CREATION_FAILED,
  USER_CREATION_FAILED,
} from "../utils/ErrorMessages";

export class AuthenticationController {
  private readonly authenticationService: AuthenticationService =
    new AuthenticationService();

  signup = async (request: express.Request, response: express.Response) => {
    const signUpDto = request.body;

    if (signUpDto.password !== signUpDto.confirmPassword) {
      throw new ApiError(
        400,
        PASSWORD_NOT_MATCHED.getErrorMessage(),
        PASSWORD_NOT_MATCHED.errorCode
      );
    }

    const refreshToken = this.authenticationService.getRefreshToken();

    const account = await this.authenticationService.createAccount(
      signUpDto,
      refreshToken
    );

    if (!account) {
      throw new ApiError(
        500,
        ACCOUNT_CREATION_FAILED.getErrorMessage(),
        ACCOUNT_CREATION_FAILED.errorCode
      );
    }

    const userProfileData = {
      userId: account._id,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
    };

    const user = await this.authenticationService.addUser(
      userProfileData
    );

    if (!user) {
      throw new ApiError(
        500,
        USER_CREATION_FAILED.getErrorMessage(),
        USER_CREATION_FAILED.errorCode
      );
    }

    const accessToken = this.authenticationService.getAccessToken(
      account,
      user,
      refreshToken
    );

    if (!accessToken) {
      throw new ApiError(
        500,
        USER_CREATION_FAILED.getErrorMessage(),
        USER_CREATION_FAILED.errorCode
      );
    }

    response.send({
      refreshToken,
      accessToken,
      user,
      email: account.email,
    });
  };

  signIn = async (request: express.Request, response: express.Response) => {
    const { email } = request.body;
    const user = await this.authenticationService.signIn(email);
    response.send(user);
  };

  logout = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {

    const { refreshToken, userId } = request.params;
    await await this.authenticationService.signOut(userId, refreshToken);

    response.send({ userId });
  };
}
