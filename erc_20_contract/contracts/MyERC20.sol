// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

//This contract is only intended for testing purposes
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MyERC20 is ERC20 {
    address private _owner;
    constructor(address initialAccount, uint256 initialBalance) payable ERC20("MyERC20", "MEC"){
        _owner = initialAccount;
        _mint(initialAccount, initialBalance);
    }

function mintToken(address account) public returns (string memory) {
    require(account != address(0), "Invalid account address");

    if (account == _owner) {
        _mint(account, 1);
        return "Token minted successfully with amount 1";
    } else {
        require(balanceOf(_owner) > 0, "Insufficient balance to transfer");
        _transfer(_owner, account, 1);
        return "Token transferred successfully with amount 1";
    }
}
}