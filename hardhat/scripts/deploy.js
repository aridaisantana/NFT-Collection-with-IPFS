const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // URL from where we can extract the metadata for a LW3Punks
  const metadataURL = "ipfs://QmRMqgKqFZ7KddkU1obdALP2wEzBDt4RkZkyh2u3BA74hu/";
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so lw3PunksContract here is a factory for instances of our LW3Punks contract.
  */
  const zyzzContract = await ethers.getContractFactory("Zyzz");

  // deploy the contract
  const deployedZyzzContract = await zyzzContract.deploy(metadataURL);

  await deployedZyzzContract.deployed();

  // print the address of the deployed contract
  console.log("Zyzz Contract Address:", deployedZyzzContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
