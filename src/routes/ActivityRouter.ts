import * as ActivityController from '../controllers/ActivityController'

var express = require('express');

var activityRouter = express.Router();

// get all activities
activityRouter.get("/", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await ActivityController.getAll(req.payload.uid));
  }
  catch(err) { next(err); }
});

// create activities
// takes an array of activities as the body
activityRouter.post("/", async (req: any, res: any, next: any) => {
  try {
    await ActivityController.create(req.payload.uid, req.body);
    res.status(201).send();
  }
  catch(err) { next(err); }
});

export default activityRouter;
