import { RouteBase } from "../../base/route.base";
import { MerkleRootController } from "./merkleRoot.controller";

export class MerkleRootRoute extends RouteBase {
  protected controller!: MerkleRootController;

  protected initial(_config: any): void {
    this.controller = new MerkleRootController();
    super.initial(_config);
  }

  protected registerRoute(): void {
    this.router.get(
      "/", 
      this.responseHandler(this.controller.getMerkleRoot));
    this.router.post(
      "/",
      this.responseHandler(this.controller.createMerkleRoot)
    );
    this.router.get(
      "/proof",
      this.responseHandler(this.controller.getMerkleProof)
    );
  }
}
