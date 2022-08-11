import { useAddress, useDisconnect, useMetamask, useNetwork } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";

const mockWhiteList = [
  "0xf418a4f543ead7be043635fe1bd8862cad99d6f6",
  "0x3d6172c7e34a684c91c87b334497d22f6f950b54",
  "0x78072bb36cb0c13bea63132e02f2b8d49dad6089",
  "0xcc9e910d3077775604923221c19181ea92b1ae60",
  "0x73a0c458accdcbfee575c28ad8d87fb21f75cfa9",
  "0xEb4fc229Bc49f2271E828D343c8fCd9A3a6E4c98"
];

const WHITELIST_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_baseURI",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "values",
        "type": "uint256[]"
      }
    ],
    "name": "TransferBatch",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "TransferSingle",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "value",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "URI",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINTER_TYPEHASH",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "accounts",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      }
    ],
    "name": "balanceOfBatch",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "merkleRoot",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "internalType": "bytes32[]",
        "name": "merkleProof",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeBatchTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_merkleRoot",
        "type": "bytes32"
      }
    ],
    "name": "setMerkleRoot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_signatureAddress",
        "type": "address"
      }
    ],
    "name": "setSignatureAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "signatureAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "uri",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelistClaimed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const Home: NextPage = () => {
  let domain, provider, signer: ethers.providers.Provider | ethers.Signer | undefined;
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const [tokenId, setTokenId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [merkleroot, setMerkleroot] = useState("");
  const [signature, setSignature] = useState("");
  const [merkleproof, setMerkleproof] = useState<string[]>([]);
  const [inputs, setInputs] = useState({ ["address"]: address, ["time"]: new Date(Date.now()) });
  const [stringformat, setStringformat] = useState("");

  useEffect(() => {
    if (!address) return
    domain = window.location.host;
    if (inputs.address !== address) {
      setInputs((values) => ({ ...values, ["address"]: address, ["domain"]: window.location.href }))
    }
    provider = new ethers.providers.Web3Provider(window.ethereum as InjectedProviders);
    signer = provider.getSigner();
    if (signature) {
      formatMerkleProof();
    }
  }, [address, network]);

  const getMerkleRoot = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetch("http://localhost:7000/api/merkleroot", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setMerkleroot(result.data.merkleRoot);
      });
  };

  const getSignature = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetch(`http://localhost:7000/api/signature?mintingAddress=${address}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setSignature(result.data.signature);
      });
  };

  const formatMerkleProof = () => {
    let string = merkleproof.map((proof) => `"${proof}"`);
    console.log(merkleproof);
    console.log(string);
    setStringformat(`[${string}]`);
  };

  const getMerkleproof = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetch(
      `http://localhost:7000/api/merkleroot/proof?mintingAddress=${address}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setMerkleproof(result.data.merkleProof);
      });
  };

  const whitelistSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("http://localhost:7000/api/merkleroot", {
      method: "POST",
      body: JSON.stringify({
        leaf: mockWhiteList,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setMerkleroot(result.data.merkleRoot);
      });
  };

  const tokenIdHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenId(Number(event.target.value));
  }

  const amountHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  }

  const mintNFT = async () => {
    const contract = new ethers.Contract("0x5AFd4810ffaB55cA341737e5BA568Ac02da16077", WHITELIST_NFT_ABI, signer!);
    try {
      const mint = await contract.mint(signature, merkleproof, tokenId, amount);
      await mint.wait();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {address ? (
        <>
          <div className="mt-10 sm:mt-0">
            <div className="m-10 md:grid md:grid-cols-3 md:gap-6">
              {/* Whitelist Sector */}
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Personal Information
                  </h3>
                  <button
                    className="m-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </button>
                  <p className="mt-1 text-sm text-gray-600">
                    Your address: {address}
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <h1 className="text-2xl mb-2 text-gray-600 font-bold">
                  Whitelist Setup
                </h1>
                <form action="#" onSubmit={whitelistSubmit}>
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="white-list"
                            className="text-xl block font-medium text-gray-700"
                          >
                            White List
                          </label>
                          <textarea
                            name="white-list"
                            id="white-list"
                            defaultValue={mockWhiteList}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="merkle-root"
                            className="block text-xl font-medium text-gray-700"
                          >
                            MerkleRoot
                          </label>
                          <input
                            type="text"
                            name="merkle-root"
                            id="merkle-root"
                            value={merkleroot}
                            className="mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Create Merkle Root
                      </button>
                      <button
                        type="button"
                        onClick={getMerkleRoot}
                        className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Get Merkle Root
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* Backend API Sector */}
              <div className="md:col-span-1"></div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <h1 className="text-2xl mb-2 text-gray-600 font-bold">
                  Backend API
                </h1>
                <form action="#">
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="signature-whitelist"
                            className="block text-xl font-medium text-gray-700"
                          >
                            Signature
                          </label>
                          <input
                            type="text"
                            name="signature-whitelist"
                            id="signature-whitelist"
                            value={signature}
                            className="mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            disabled
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="merkle-proof-whitelist"
                            className="block text-xl font-medium text-gray-700"
                          >
                            Merkle Proof
                          </label>
                          <input
                            type="text"
                            name="merkle-proof-whitelist"
                            id="merkle-proof-whitelist"
                            value={merkleproof}
                            className="mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="button"
                        onClick={getSignature}
                        className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Get Signature
                      </button>
                      <button
                        type="button"
                        onClick={getMerkleproof}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Get Merkle Proof
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* Mint Sector */}
              <div className="md:col-span-1"></div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <h1 className="text-2xl mb-2 text-gray-600 font-bold">
                  Contract Interaction
                </h1>
                <form action="#">
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="signature"
                            className="block text-xl font-medium text-gray-700"
                          >
                            Signature
                          </label>
                          <input
                            type="text"
                            name="signature"
                            id="signature"
                            value={signature}
                            className="mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="merkle-proof"
                            className="block text-xl font-medium text-gray-700"
                          >
                            Merkle Proof
                          </label>
                          <input
                            type="text"
                            name="merkle-proof"
                            id="merkle-proof"
                            value={stringformat}
                            className="mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="token-id"
                            className="block text-xl font-medium text-gray-700"
                          >
                            Token Id
                          </label>
                          <input
                            type="text"
                            name="token-id"
                            id="token-id"
                            value={tokenId}
                            onChange={tokenIdHandler}
                            className="mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="amount"
                            className="block text-xl font-medium text-gray-700"
                          >
                            Amount
                          </label>
                          <input
                            type="text"
                            name="amount"
                            id="amount"
                            value={amount}
                            onChange={amountHandler}
                            className="mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="button"
                        onClick={mintNFT}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Mint
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <button
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={connectWithMetamask}
        >
          Connect with Metamask
        </button>
      )}
    </div>
  );
};

export default Home;
