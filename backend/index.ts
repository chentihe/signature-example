import Express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
import signMessage from "./utils/signMessage";
import createMerkleTree from "./utils/merkleTree";
import MerkleTree from "merkletreejs";
import cors from "cors";
import { keccak256 } from "@ethersproject/keccak256";

dotenv.config();

const app = Express();
const port = process.env.PORT;

// const provider = new ethers.providers.InfuraProvider(
//   process.env.NETWORK,
//   process.env.INFURA_API_KEY
// );
const provider = ethers.getDefaultProvider();
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

let merkleTree: MerkleTree;

app.use(cors());
app.use(Express.json({ limit: 43610 }));
app.use(Express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "hello world" }).end();
});

app.get("/api/signature", async (req: Request, res: Response) => {
  const { mintingAddress } = req.query as { [key: string]: string };
  const signature = await signMessage(
    wallet,
    process.env.NFT_CONTRACT_ADDRESS!,
    mintingAddress
  );
  res
    .status(200)
    .json({
      signature,
    })
    .end();
});

app.post("/api/merkleroot", async (req: Request, res: Response) => {
  const { leaf } = req.body;
  const _merkleTree = createMerkleTree(leaf);
  const merkleRoot = _merkleTree.getHexRoot();
  merkleTree = _merkleTree;
  res
    .status(200)
    .json({
      merkleRoot,
    })
    .end();
});

app.get("/api/merkleproof", async (req: Request, res: Response) => {
  const { mintingAddress } = req.query as { [key: string]: string };
  const leave = keccak256(mintingAddress);
  const merkleProof = merkleTree.getHexProof(leave);
  res
    .status(200)
    .json({
      merkleProof,
    })
    .end();
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
