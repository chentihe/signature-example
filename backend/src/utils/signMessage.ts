import { Wallet } from "ethers";

export default async function signMessage(
  wallet: Wallet,
  contractAddress: string,
  mintingAddress: string
) {
  const chainId = await wallet.getChainId();
  // Domain data should match whats specified in the DOMAIN_SEPARATOR constructed in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L33-L43
  const domain = {
    name: "WhitelistNFT",
    version: "1",
    chainId: 1337,
    verifyingContract: contractAddress,
  };

  // The types should match the TYPEHASH specified in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L27-L28
  const types = {
    Minter: [{ name: "wallet", type: "address" }],
  };

  const sig = await wallet._signTypedData(domain, types, {
    wallet: mintingAddress,
  });

  return sig;
}
