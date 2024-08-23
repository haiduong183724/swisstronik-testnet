// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyPrivateNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => bool) private whitelist;
    constructor() ERC721("MyNFT", "MNFT") {}

    function safeMint(address to) public onlyOwner {
        require(checkWhiteList(to), "This address is not in the whitelist, please add to whitelist before minting");
        _tokenIdCounter++;

        _safeMint(to, _tokenIdCounter);
    }
    function mint() public {
        require(checkWhiteList(msg.sender), "You are not in the whitelist");
        _tokenIdCounter++;
        _safeMint(msg.sender, _tokenIdCounter);
    }
    function addWhiteList(address _address) public onlyOwner {
        whitelist[_address] = true;
    }
    function removeWhiteList(address _address) public onlyOwner {
        whitelist[_address] = false;
    }
    function checkWhiteList(address _address) public view returns (bool) {
        require(msg.sender == _address || msg.sender == owner(), "You are not allowed to check the whitelist of this address");
        return whitelist[_address] || _address == owner();
    }
    function checkHaveNFT(address _address) public view returns (bool) {
        require( ( msg.sender == _address  && checkWhiteList(_address)) || msg.sender == owner(), "You don't have permission to check NFT in this wallet");
        return balanceOf(_address) > 0;
    }
}