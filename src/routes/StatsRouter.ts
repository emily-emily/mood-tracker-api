import * as StatsController from '../controllers/StatsController'

var express = require('express');

var statsRouter = express.Router();

statsRouter.get("/lastEntryDate", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await StatsController.getLastEntryDate(req.payload.uid));
  }
  catch(err) { next(err); }
});

statsRouter.get("/lastActivityOccurrence", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await StatsController.getLastActivityOccurrence(req.payload.uid, req.body.activity));
  }
  catch(err) { next(err); }
});

statsRouter.get("/averageStatuses", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await StatsController.getAvg(req.payload.uid, req.body.from, req.body.to));
  }
  catch(err) { next(err); }
});

statsRouter.get("/plotData", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await StatsController.getPlotData(req.payload.uid, req.body.from, req.body.to, req.body.status));
  }
  catch(err) { next(err); }
});

export default statsRouter;
