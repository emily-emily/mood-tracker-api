import 'reflect-metadata';
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDb } from "./helpers/db";
import { errorHandler } from './middlewares/ErrorHandler';
import activityRouter from './routes/ActivityRouter';
import statusRouter from './routes/StatusRouter';
import entryRouter from './routes/EntryRouter';
import statsRouter from './routes/StatsRouter';
import userRouter from './routes/UserRouter';
import verifyToken from './helpers/auth';

async function launch() {
  try {
    await connectDb();
  }
  catch (err) {
    console.log(err);
    return;
  }
  
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/user", userRouter);

  app.use("/", verifyToken)

  app.use("/activity", activityRouter);
  app.use("/status", statusRouter);
  app.use("/entry", entryRouter);
  app.use("/stats", statsRouter);

  app.use(errorHandler);

  // run express application
  let port = parseInt(process.env.PORT || "");
  if (isNaN(port) || port === 0) {
    port = 3000;
  }
  app.listen(port);
  console.log(`app running on port ${port}`);
}

launch();
