const { ethers } = require("hardhat");
require('dotenv').config();
const fs = require("fs");
async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const contract = await hre.ethers.deployContract("MyERC20", [deployer.address, 100000]);
    await contract.waitForDeployment();
    
    console.log(`Swisstronik contract deployed to ${contract.target}`);
    fs.appendFileSync(".env", `\nCONTRACT_ADDRESS=${contract.target}\n`);
}
//DEFAULT BY HARDHAT:
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  