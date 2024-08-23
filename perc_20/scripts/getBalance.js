const hre = require("hardhat");
const { ethers, Wallet } = require("@swisstronik/utils/node_modules/ethers"); // Sử dụng ethers từ module chính
require('dotenv').config();
const { encryptDataField, decryptNodeResponse } = require('@swisstronik/utils')

const getTokenBalance = async (wallet, contract) => {
    const req = await sendSignedShieldedQuery(
      wallet,
      contract.address,
      contract.interface.encodeFunctionData("balanceOf", [wallet.address]),
    );
  
    const balance = contract.interface.decodeFunctionResult("balanceOf", req)[0]
    return balance
}

// Sends signed encrypted query to the node
const sendSignedShieldedQuery = async (wallet, destination, data) => {
    if (!wallet.provider) {
        throw new Error("wallet doesn't contain connected provider")
    }

    // Encrypt call data
    const [encryptedData, usedEncryptedKey] = await encryptDataField(
        wallet.provider.connection.url,
        data
    )

    // Get chain id for signature
    const networkInfo = await wallet.provider.getNetwork()
    const nonce = await wallet.getTransactionCount()

    // We treat signed call as a transaction, but it will be sent using eth_call
    const callData = {
        nonce: ethers.utils.hexValue(nonce), // We use nonce to create some kind of reuse-protection
        to: destination,
        data: encryptedData,
        chainId: networkInfo.chainId,
    }

    // Extract signature values
    const signedRawCallData = await wallet.signTransaction(callData)
    const decoded = ethers.utils.parseTransaction(signedRawCallData)
    
    // Construct call with signature values
    const signedCallData = {
        nonce: ethers.utils.hexValue(nonce), // We use nonce to create some kind of reuse-protection
        to: decoded.to,
        data: decoded.data,
        v: ethers.utils.hexValue(decoded.v),
        r: ethers.utils.hexValue(decoded.r),
        s: ethers.utils.hexValue(decoded.s),
        chainId: ethers.utils.hexValue(networkInfo.chainId)
    }

    console.log("SignedCallData: ", signedCallData);
        // Decrypt call result
        console.log("Response: ", wallet.provider.connection.url);
    // Do call
    const response = await wallet.provider.send('eth_call', [signedCallData, "latest"])

console.log("Response: ", response);
    return await decryptNodeResponse(wallet.provider.connection.url, response, usedEncryptedKey)
}
const sendShieldedTransaction = async (signer, destination, data, value) => {
    // Get the RPC link from the network configuration
    const rpclink = hre.network.config.url;
  
    // Encrypt transaction data
    const [encryptedData] = await encryptDataField(rpclink, data);
    console.log("Encrypted Data: ", encryptedData);
    // Construct and sign transaction with encrypted data
    return await signer.sendTransaction({
      from: signer.address,
      to: destination,
      data: encryptedData,
      value,
    });
  };

async function main() {
    const [signer] = await hre.ethers.getSigners();
    // Replace with your deployed contract address
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const provider = new ethers.providers.JsonRpcProvider('https://json-rpc.testnet.swisstronik.com/');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Wallet Address: ", wallet.address);
    // Attach to the deployed contract
    const MyPERC20 = await hre.ethers.getContractFactory("MyPERC20");
    const myPERC20 = MyPERC20.attach(contractAddress);
    // console.log("wallet provider: ", wallet.provider);
    const accountAddress = signer.address;
    
    console.log("Check balance of: ", accountAddress);
    try {
        const balance = await getTokenBalance(wallet, myPERC20);
        console.log("Balance: ", balance); // Assuming 18 decimal places for the token
    } catch (error) {
        console.error("Error fetching balance: ", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

