// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract CustomTransparentUpgradeableProxy is TransparentUpgradeableProxy {
    // This constructor initializes the proxy with the implementation address, admin address, and initialization data.
    constructor(
        address _logic,             // Address of the initial implementation contract
        address admin_,             // Address of the admin who can upgrade the implementation
        bytes memory _data          // Optional initialization data to be passed to the implementation contract
    ) 
        TransparentUpgradeableProxy(_logic, admin_, _data) 
    {
        
    }
}
