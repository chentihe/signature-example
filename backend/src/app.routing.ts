import { ApiRoute } from "./api/api.routing";
import { RouteBase } from "./base/route.base";

export class AppRoute extends RouteBase {
  private apiRoute: ApiRoute | undefined;

  constructor(_config: any) {
    super(_config);
  }

  protected initial(_config: any): void {
    this.apiRoute = new ApiRoute(_config);
    super.initial(_config);
  }

  protected registerRoute(): void {
    this.router.use("/api", this.apiRoute!.router);
  }
}
