# signature-example

This repo is to demonstrate how to prevent users from minting NFT in other ways.

- Using Merkle Root as Whitelist mechanism

this will save the gas fee of updating white list on the contract

- Using EIP712 to let users can only mint NFT via frontend.

the signature will be provided only from backend, in this way, users are able to mint NFT via frontend.

## Contract

```
npm install
```

## Backend

```
npm install
touch .env
```

open .env and input below data
```
PORT = 7000
INFURA_API_KEY = {{your infura api key}}
NETWORK = {{your network}}
PRIVATE_KEY = {{whitelist signature address private key}}
NFT_CONTRACT_ADDRESS = {{yout nft contract address}}
NODE_ENV = dev // chang to prod if you deploy on the mainnet
```
start the server with below command
```
npm run start:dev
```


## Frontend

```
npm install
```
open index.tsx on `./frontend/pages/index.tsx` and paste your nft contract address on mintNFT function
```
  const mintNFT = async () => {
    const contract = new ethers.Contract({{your nft contract address}}, WHITELIST_NFT_ABI, signer!);
    try {
      const mint = await contract.mint(signature, merkleproof, tokenId, amount);
      await mint.wait();
    } catch (error) {
      console.log(error);
    }
  }
```
