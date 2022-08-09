// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract WhitelistNFT is ERC1155, Ownable {
    using ECDSA for bytes32;

    address private signatureAddress = address(0);
    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public merkleRoot;
    bytes32 public constant MINTER_TYPEHASH =
        keccak256("Minter(address wallet)");

    mapping(address => bool) public whitelistClaimed;

    constructor(string memory _baseURI) ERC1155(_baseURI) {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("WhitelistNFT")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function setSignatureAddress(address _signatureAddress)
        external
        onlyOwner
    {
        signatureAddress = _signatureAddress;
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    modifier verifySignature(bytes calldata signature) {
        require(signatureAddress != address(0), "whitelist not enabled");
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(MINTER_TYPEHASH, msg.sender))
            )
        );
        address recoveredAddress = digest.recover(signature);
        require(recoveredAddress == signatureAddress, "Invalid Signature");
        _;
    }

    function mint(
        bytes calldata signature,
        bytes32[] calldata merkleProof,
        uint256 tokenId,
        uint256 amount
    ) external verifySignature(signature) {
        require(!whitelistClaimed[msg.sender], "Address had already claimed.");
        bytes32 lead = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoot, lead), "Invalid proof.");
        whitelistClaimed[msg.sender] = true;
        _mint(msg.sender, tokenId, amount, "");
    }
}
