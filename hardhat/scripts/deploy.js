const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const metadataURL =
    "https://ipfs.io/ipfs/QmQkCCpeQ5f1g4XQaCoxQARzZeRPNd9SbrzLc5cvnmHwS7/";

  const zyzzContract = await ethers.getContractFactory("Zyzz");

  const deployedZyzzContract = await zyzzContract.deploy(metadataURL);

  await deployedZyzzContract.deployed();

  console.log("Zyzz Contract Address:", deployedZyzzContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
