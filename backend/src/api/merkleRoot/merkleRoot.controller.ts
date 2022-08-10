import { ControllerBase } from "../../base/controller.base";
import { keccak256 } from "ethers/lib/utils";
import { Request } from "express";
import MerkleTree from "merkletreejs";
import { HttpStatus } from "../../types/response.type";
import createMerkleTree from "../../utils/merkleTree";
import { ResponseObject } from "common/response/response.object";

export class MerkleRootController extends ControllerBase {
  private merkleTree: MerkleTree | undefined;

  public async getMerkleRoot(): Promise<ResponseObject> {
    const merkleRoot = this.merkleTree?.getHexRoot();
    return this.formatResponse(
      {
        merkleRoot,
      },
      HttpStatus.OK
    );
  }

  public async createMerkleRoot(
    req: Request,
  ): Promise<ResponseObject> {
    const { leaf } = req.body;
    const _merkleTree = createMerkleTree(leaf);
    const merkleRoot = _merkleTree.getHexRoot();
    this.merkleTree = _merkleTree;
    return this.formatResponse(
      {
        merkleRoot,
      },
      HttpStatus.OK
    );
  }

  public async getMerkleProof(
    req: Request,
  ): Promise<ResponseObject> {
    const { mintingAddress } = req.query as { [key: string]: string };
    const leave = keccak256(mintingAddress);
    const merkleProof = this.merkleTree!.getHexProof(leave);
    return this.formatResponse(
      {
        merkleProof,
      },
      HttpStatus.OK
    );
  }
}
