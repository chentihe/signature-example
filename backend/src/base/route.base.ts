import { ResponseObject } from "common/response/response.object";
import { NextFunction, Request, Response, Router } from "express";
import { HttpStatus } from "types/response.type";
import { ControllerBase } from "./controller.base";

export abstract class RouteBase {
  public router = Router();
  protected controller!: ControllerBase;

  constructor(_config?: any) {
    this.initial(_config);
  }

  protected initial(_config: any): void {
    this.registerRoute();
  }

  protected abstract registerRoute(): void;

  protected responseHandler(
    method: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<ResponseObject>,
    controller = this.controller
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      method
        .call(this.controller, req, res, next)
        .then((obj) => res.status(obj.status).json(obj))
        .catch((err: Error) =>
          next(
            controller.formatResponse(err.message, (err as any).status) ||
              HttpStatus.INTERNAL_ERROR
          )
        );
    };
  }
}
