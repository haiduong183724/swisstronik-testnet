const { ethers } = require("hardhat");
const fs = require("fs");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction  = async (signer, destination, data, value) => {
  const rpclink = hre.network.config.url;
  if(data !=  undefined) {
    const [encryptedData] = await encryptDataField(rpclink, data);
    return await signer.sendTransaction({
      from: signer.address,
      to: destination,
      data: encryptedData,
      value,
    });
  }
  else {
    return await signer.sendTransaction({
      from: signer.address,
      to: destination,
      value,
    });
  }
};
async function main() {

    const perc20 = await ethers.deployContract("MyPERC20");
    await perc20.waitForDeployment();
    fs.appendFileSync(".env", `\nCONTRACT_ADDRESS=${perc20.target}\n`);
    console.log(`PERC20Sample was deployed to ${perc20.target}`)
    // Mint token to address
    const [deployer] = await ethers.getSigners();
    const responseMessage = await sendShieldedTransaction(deployer, perc20.target,undefined , 1);
    console.log("Transaction Receipt: ", responseMessage);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});