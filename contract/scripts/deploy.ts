import { ethers } from "hardhat";

async function main() {
  const WhitelistNFT = await ethers.getContractFactory("WhitelistNFT");
  const whitelistNFT = await WhitelistNFT.deploy();
  await whitelistNFT.deployed();
  console.log("deployed to:", whitelistNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
