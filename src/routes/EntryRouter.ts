import * as EntryController from '../controllers/EntryController'

var express = require('express');

var entryRouter = express.Router();

// get entries
entryRouter.get("/", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await EntryController.getEntry(req.body.from, req.body.to, req.body.max, req.body.activities));
  }
  catch(err) { next(err); }
});

// create entries
// takes an array of entries as the body
entryRouter.post("/", async (req: any, res: any, next: any) => {
  try {
    await EntryController.create(req.body);
    res.status(201).send();
  }
  catch(err) { next(err); }
});

export default entryRouter;
