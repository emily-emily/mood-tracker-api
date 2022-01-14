import * as UserController from '../controllers/UserController'

var express = require('express');

var userRouter = express.Router();

userRouter.post("/signup", async (req: any, res: any, next: any) => {
  try {
    await UserController.signup(req.body.name, req.body.email, req.body.password, req.body.password2);
    res.status(201).send();
  }
  catch(err) { next(err); }
});

userRouter.get("/login", async (req: any, res: any, next: any) => {
  try {
    res.status(200).send(await UserController.login(req.body.email, req.body.password));
  }
  catch(err) { next(err); }
});

export default userRouter;
