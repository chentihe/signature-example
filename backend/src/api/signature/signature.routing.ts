import { RouteBase } from "../../base/route.base";
import { SignatureController } from "./signature.controller";

export class SignatureRoute extends RouteBase {
  protected controller!: SignatureController;

  protected initial(_config: any): void {
    this.controller = new SignatureController(_config);
    super.initial(_config);
  }

  protected registerRoute(): void {
    this.router.get("/", this.responseHandler(this.controller.getSignature));
  }
}
