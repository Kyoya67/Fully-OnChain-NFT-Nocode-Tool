// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract mintFullyOnChain is ERC721URIStorage, Ownable(msg.sender) {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _fileType;
    string private _metadataInfo;  // メディアタイプとメタデータキーを含む

    event TokenURIChanged(address indexed sender, uint256 indexed tokenId, string uri);

    constructor(string memory name, string memory symbol, string memory fileType) ERC721(name, symbol) {
        _fileType = fileType;

        if (keccak256(bytes(_fileType)) == keccak256(bytes("html"))) {
            _metadataInfo = ',"animation_url":"data:text/html;base64,';
        } else {
            _metadataInfo = ',"image":"data:image/svg+xml;base64,';
        }
    }
    
    function nftMint(
        string memory title, 
        string memory description, 
        string memory workData
    ) public onlyOwner {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // メタデータの生成
        bytes memory metaData = abi.encodePacked(
            '{"name":"', title, '","description":"', description, '"',
            _metadataInfo, workData, '"}'
        );

        string memory uri = string(abi.encodePacked(
            "data:application/json;base64,", 
            Base64.encode(metaData)
        ));

        _safeMint(_msgSender(), newTokenId);
        _setTokenURI(newTokenId, uri);
        
        emit TokenURIChanged(_msgSender(), newTokenId, uri);
    }
}