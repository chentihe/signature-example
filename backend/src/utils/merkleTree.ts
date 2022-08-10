import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";

export default function createMerkleTree(whitelistAddresses: string[]) {
  const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  return merkleTree;
}
