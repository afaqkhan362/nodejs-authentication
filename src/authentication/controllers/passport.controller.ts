import { Passport } from "passport";
import { Strategy } from 'passport-local';
import { AuthenticationService } from "../services/authentication.service";
import { IAccount } from "../interface/accounts.interface";

export const passport = new Passport();
const authenticationService: AuthenticationService = new AuthenticationService();
passport.serializeUser((user, done) => {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new Strategy(
  { usernameField: 'email' },
  async (username, password, done): Promise<void> => {
    try {
      const user: IAccount = await authenticationService.authenticate(username, password);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  },
));

