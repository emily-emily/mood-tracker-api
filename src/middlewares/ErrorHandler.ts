export const errorHandler = (err: any, req: any, res: any, next: (err: any) => any) => {
  if (err.stack) {
    console.error(err.stack);
  }
  res.status(err.status || 500).send({
    result: "error",
    message: err.message
  });
}
