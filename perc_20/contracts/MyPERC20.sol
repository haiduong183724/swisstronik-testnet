pragma solidity ^0.8.19;

import "./PERC20.sol";

contract MyPERC20 is PERC20{

    constructor() payable PERC20("MyPERC20", "MPC") {
    }
    receive() external payable {
        _mint(_msgSender(), msg.value);
    }
    function checkSender() public view returns (address) {
        return msg.sender;
    }
    function balanceOf(address account) public view override returns (uint256) {
        require(msg.sender==account,"You are not allowed to check allowance of other account");
        return _balances[account];
    }
    function allowance(address owner, address spender) public view override returns (uint256) {
        require(msg.sender==owner,"You are not allowed to check allowance of other account");
        return _allowances[owner][spender];
    }
}