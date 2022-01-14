import MyError from "./MyError";

var jwt = require('jsonwebtoken');

const verifyToken = (req: any, res: any, next: any) => {
  try {
    req.token = req.headers.authorization;
    if (req.token === undefined) {
      throw new MyError("Unauthorized", 401);
    }
    req.payload = jwt.verify(req.token, process.env.JWT_SECRET);
    next();
  }
  catch(err) {
    next(err);
  }
}

export default verifyToken;
