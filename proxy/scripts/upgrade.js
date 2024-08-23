const { ethers, upgrades  } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();

async function main() {
    // Lấy địa chỉ ProxyAdmin và Proxy (đã triển khai trước đó)
    const proxyAddress = process.env.PROXY_ADDRESS; // Địa chỉ của TransparentUpgradeableProxy
    if (!proxyAddress) {
        throw new Error("Proxy address not found. Please make sure to deploy the contract first.");
    }

    const MyContractV2 = await ethers.getContractFactory("SimpleContractV2");
    const myContractV2 = await MyContractV2.deploy("Hello, World!");
    await myContractV2.waitForDeployment();
    // Nâng cấp proxy
    console.log("Upgrading...");
    await upgrades.upgradeProxy(proxyAddress, MyContractV2);
    console.log("Upgrade completed!");

}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });