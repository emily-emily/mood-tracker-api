import 'reflect-metadata';
import express from "express";
import { useExpressServer } from 'routing-controllers';
import { ActivityController } from './controllers/ActivityController';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDb } from "./start/db";

async function launch() {
  try {
    await connectDb();
  }
  catch (err) {
    console.log(err);
  }
  
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  // run express application
  let port = parseInt(process.env.PORT || "");
  if (isNaN(port) || port === 0) {
    port = 3000;
  }
  app.listen(port);
  console.log(`app running on port ${port}`);
}

launch();
