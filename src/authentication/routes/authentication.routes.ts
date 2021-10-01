import * as express from 'express';
import { AuthenticationController } from '../controllers/authentication.controller';
import { asyncHandler } from '../../utils/asyncMiddleware';
import { passport } from '../controllers/passport.controller';

const router = express.Router();
const authenticationController: AuthenticationController =
  new AuthenticationController();

router.post(
  `/sign-up`,
  asyncHandler(authenticationController.signup),
);

router.post(
  '/sign-in',
  passport.authenticate('local', { session: false }),
  asyncHandler(authenticationController.signIn),
);

router.delete('/logout/:userId/:refreshToken', asyncHandler(authenticationController.logout));

export default router;
