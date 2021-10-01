import * as express from 'express';

import authenticationRouter from './authentication/routes/authentication.routes';
import { Routes } from './utils/Enums';
import { apiErrorHandler } from './utils/ApiError';

const app = express();

// initialize middleware
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

app.use(Routes.authentication, authenticationRouter);

// adding api handler
app.use(apiErrorHandler);

// server health

app.use('/health', (request: express.Request, response: express.Response) => {
  response.status(200).send({
    server: 'ok',
  });
});

export default app;
