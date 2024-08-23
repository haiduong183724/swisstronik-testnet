const { ethers, upgrades } = require("hardhat");
const fs = require('fs');
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const encodeData = async ( data) => {
    const rpclink = hre.network.config.url;
    const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink, data);
    return encryptedData;
  };
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the implementation contract first
    const MyImplementation = await ethers.getContractFactory("SimpleContract");
    // const myImplementation = await MyImplementation.deploy("Hello, World!");
    // await myImplementation.waitForDeployment();

    //console.log("Implementation contract deployed at:", myImplementation.target);
    //fs.appendFileSync(".env", `\nCONTRACT_ADDRESS=${myImplementation.target}`);
    console.log("DEPLOYER ADDRESS=", deployer.address);
    // Deploy the proxy contract
    //const data2 = myImplementation.interface._encodeParams(["string"], ["Hello, World!"]);   
    //console.log("DATA=", data2);
    const data =         ethers.AbiCoder.defaultAbiCoder().encode(
        ["string"],                 // Initialize params types
        ["Initial Message"]  )  
    console.log("DATA=", data);
    console.log("input lengh: " + MyImplementation.interface.deploy.inputs);
    //const CustomProxy = await ethers.getContractFactory("CustomTransparentUpgradeableProxy");
    const proxy = await upgrades.deployProxy(MyImplementation, { initializer: 'initialize', constructorArgs: ["Hello, World!"] });
    //MyImplementation.attach(customProxy.target)
    console.log("Proxy contract deployed at:", proxy.target);
    fs.appendFileSync(".env", `\nPROXY_ADDRESS=${proxy.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });