// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./mintFullyOnChain.sol"; // HTML NFTコントラクトをインポートします。
import "@openzeppelin/contracts/access/Ownable.sol";

contract fullyOnChainFactory is Ownable(msg.sender) {

    // 新しいNFTコントラクトが作成されたときに発火するイベントを定義します。
    event NFTContractCreated(
        address indexed creator, 
        address indexed contractAddress, 
        string name, 
        string symbol, 
        string fileType
    );

    function createNFTContract(
        string memory name,
        string memory symbol,
        string memory fileType
    ) public returns (address) {
        mintFullyOnChain newContract = new mintFullyOnChain(name, symbol, fileType);
        newContract.transferOwnership(msg.sender);

        // 新しいNFTコントラクトのアドレスをイベントとして発火します。
        emit NFTContractCreated(msg.sender, address(newContract), name, symbol, fileType);

        return address(newContract);
    }
}
