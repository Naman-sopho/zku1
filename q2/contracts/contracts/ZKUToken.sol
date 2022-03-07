// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ZKUToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    
    // to keep track of tokens already issued
    // Counter gives an easy way to generate/increment addresses
    Counters.Counter private _tokenIds;

    // sets token name and symbol
    constructor() ERC721("ZKUToken", "ZKUT") {}

    // Override the ERC721 standard method to access tokenURI
    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            '{'
                '"name": "ZKUToken #', Strings.toString(tokenId), '"',
                '"description": "this token is awesome"',
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function awardItem(address player)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI(newItemId));

        return newItemId;
    }
}
