const hre = require("hardhat");
require('dotenv').config();
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction  = async (signer, destination, data, value) => {
  const rpclink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpclink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not found in .env file");
  }
  const [signer] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("MyERC20");
  const contract = contractFactory.attach(contractAddress);
  const functionName = "mintToken";
  const responseMessage = await sendShieldedTransaction(signer, contractAddress, contract.interface.encodeFunctionData(functionName, ["0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1"]), 0);
  console.log("Transaction Receipt: ", responseMessage);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
