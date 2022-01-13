import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(err: any, req: any, res: any, next: (err: any) => any) {
    console.error(err.stack);
    res.status(err.httpCode || 500).send({
      reuslt: "error",
      message: err.message
    });
  }
}
