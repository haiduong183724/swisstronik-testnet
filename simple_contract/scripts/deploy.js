const { ethers } = require("hardhat");
require('dotenv').config();
async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const contract = await hre.ethers.deployContract("SimpleContract", ["Hello from duongndh"]);
    await contract.waitForDeployment();
    
    console.log(`Swisstronik contract deployed to ${contract.target}`);
    fs.appendFileSync(".env", `CONTRACT_ADDRESS=${contractAddress}\n`);
}
//DEFAULT BY HARDHAT:
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  