import 'reflect-metadata';
import express from "express";
import { useExpressServer } from 'routing-controllers';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDb } from "./start/db";
import { ActivityController } from './controllers/ActivityController';
import { EntryController } from './controllers/EntryController';
import { StatusController } from './controllers/StatusController';

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

  useExpressServer(app, {
    controllers: [ActivityController, EntryController, StatusController],
  });

  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  // run express application
  let port = parseInt(process.env.PORT || "");
  if (isNaN(port) || port === 0) {
    port = 3000;
  }
  app.listen(port);
  console.log(`app running on port ${port}`);
}

launch();
