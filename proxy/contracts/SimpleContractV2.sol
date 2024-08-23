// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

//This contract is only intended for testing purposes
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
contract SimpleContractV2 is Initializable {
    string internal message ;

    function initialize(string memory _message) public initializer {
        message = _message;
    }
    /**
     * @dev setMessage() updates the stored message in the contract
     * @param _message the new message to replace the existing one
     */
    function setMessage(string memory _message) public {
        message = _message;
    }

    /**
     * @dev getMessage() retrieves the currently stored message in the contract
     * @return The message associated with the contract
     */
    function getMessage() public view returns(string memory){
        return string(abi.encodePacked(message, "from SimpleContractV2"));
    }
}