import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { AppRoute } from "./app.routing";

export class App {
  private app = express();
  private route: AppRoute | undefined;
  private config: any;

  constructor() {
    this.setEnvironment();
    this.setHelmet();
    this.setCors();
    this.setJsonParse();
    this.registerRoute();
  }

  public bootstrap(): void {
    this.app.listen(process.env.PORT, () => {
      console.log(`API Server is running at port ${process.env.PORT}.`);
    });
  }

  private setHelmet(): void {
    this.app.use(helmet());
  }

  private setCors(): void {
    this.app.use(cors());
  }

  private setJsonParse(): void {
    this.app.use(express.json({ limit: 43610 }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setEnvironment(): void {
    dotenv.config();
    this.config = {
      INFURA_API_KEY: process.env.INFURA_API_KEY,
      NETWORK: process.env.NETWORK,
      PRIVATE_KEY: process.env.PRIVATE_KEY,
      NFT_CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS,
      NODE_ENV: process.env.NODE_ENV,
    };
  }

  private registerRoute(): void {
    this.route = new AppRoute(this.config);
    this.app.use("/", this.route.router);
  }

  public setException(handler: ErrorRequestHandler): void {
    this.app.use(handler);
  }
}
