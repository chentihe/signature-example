import { ControllerBase } from "../../base/controller.base";
import { ethers } from "ethers";
import { Request } from "express";
import { HttpStatus } from "../../types/response.type";
import signMessage from "../../utils/signMessage";
import { ResponseObject } from "common/response/response.object";

export class SignatureController extends ControllerBase {
  private provider: ethers.providers.Provider | undefined;
  private wallet;
  private NFT_CONTRACT_ADDRESS;

  constructor(_config: any) {
    super();
    this.setProvider(_config);
    this.wallet = new ethers.Wallet(_config.PRIVATE_KEY!, this.provider);
    this.NFT_CONTRACT_ADDRESS = _config.NFT_CONTRACT_ADDRESS;
  }

  private setProvider(_config: any) {
    switch (_config.NODE_ENV) {
      case "prod":
        this.provider = new ethers.providers.InfuraProvider(
          _config.NETWORK,
          _config.INFURA_API_KEY
        );
        break;
      case "dev":
      default:
        this.provider = new ethers.providers.JsonRpcProvider();
        break;
    }
  }

  public async getSignature(
    req: Request,
  ): Promise<ResponseObject> {
    const { mintingAddress } = req.query as { [key: string]: string };
    const signature = await signMessage(
      this.wallet,
      this.NFT_CONTRACT_ADDRESS,
      mintingAddress
    );

    return this.formatResponse(
      {
        signature,
      },
      HttpStatus.OK
    );
  }
}
