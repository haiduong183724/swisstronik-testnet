// scripts/mintNFT.js
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
    const deployedAddress = process.env.DEPLOYED_ADDRESS; // Replace with your deployed contract address
    const recipientAddress = "RECIPIENT_ADDRESS_HERE"; // Replace with the address you want to mint the NFT to
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const [deployer] = await hre.ethers.getSigners();

    // Attach to the deployed contract
    const MyNFT = await hre.ethers.getContractFactory("MyNFT721");
    const contract = MyNFT.attach(contractAddress);
    const functionName = "createNFT";
    const responseMessage = await sendShieldedTransaction(deployer, contractAddress, contract.interface.encodeFunctionData(functionName, [deployedAddress]), 0);
    console.log("Transaction Receipt: ", responseMessage);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});