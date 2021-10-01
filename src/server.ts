import { config } from 'dotenv';
config(); // dotenv config

import * as mongoose from 'mongoose';
import app from './app';

const mongoConnectionString = process.env.MONGO_CONN_STR || '';
const port = process.env.PORT;

const start = async () => {
  // initialize mongoose
  mongoose.connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('error', (err) => {
    console.log('err', err);
  });
  mongoose.connection.on('connected', (err, res) => {
    console.log('MongoDB is connected');
  });

  app.listen(port, () => {
    console.log(`Server is connected on port: `, port);
  });
};

start();
