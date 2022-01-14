import * as StatusController from '../controllers/StatusController'

var express = require('express');

var statusRouter = express.Router();

// get all activities
statusRouter.get("/", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await StatusController.getAll(req.payload.uid));
  }
  catch(err) { next(err); }
});

// create activities
// takes an array of statuses as the body
statusRouter.post("/", async (req: any, res: any, next: any) => {
  try {
    await StatusController.create(req.payload.uid, req.body);
    res.status(201).send();
  }
  catch(err) { next(err); }
});

export default statusRouter;
