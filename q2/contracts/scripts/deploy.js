const hre = require("hardhat");

async function main() {
  const MerkleTree = await hre.ethers.getContractFactory("MerkleTree");
  const merkleTree = await MerkleTree.deploy();

  const ZKUTokenWithMerkleTree = await hre.ethers.getContractFactory("ZKUTokenWithMerkleTree");
  const zkuTokenWithMerkleTree = await ZKUTokenWithMerkleTree.deploy();

  await merkleTree.deployed();
  console.log("MerkleTree: ", merkleTree.address);

  await zkuTokenWithMerkleTree.deployed();
  console.log("ZKUTokenWithMerkleTree: ", zkuTokenWithMerkleTree.address);

  // Sample run
  // MerkleTree:  0x45904A05BA393d1B341fceAb72f56BaaC03b199B
  // ZKUTokenWithMerkleTree:  0x4373967A68d67bc5783ac4329692032fb2c4DFf0
  // Contracts which return the leaves
  // MerkleTree:  0x39Fa96f5bC6D9DA5F30bCbFF0D0Fd9e976e85c9a
  // ZKUTokenWithMerkleTree:  0x80878c0fAe3F64f65dd06d1e49608bBCFf049748

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
