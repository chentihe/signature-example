import { RouteBase } from "../base/route.base";
import { MerkleRootRoute } from "./merkleRoot/merkleRoot.routing";
import { SignatureRoute } from "./signature/signature.routing";

export class ApiRoute extends RouteBase {
  private merkleRootRoute: MerkleRootRoute | undefined;
  private signatureRoute: SignatureRoute | undefined;

  protected initial(_config: any): void {
    this.merkleRootRoute = new MerkleRootRoute();
    this.signatureRoute = new SignatureRoute(_config);
    super.initial(_config);
  }

  protected registerRoute(): void {
    this.router.use("/merkleroot", this.merkleRootRoute!.router);
    this.router.use("/signature", this.signatureRoute!.router);
  }
}
