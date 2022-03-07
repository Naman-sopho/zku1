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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
