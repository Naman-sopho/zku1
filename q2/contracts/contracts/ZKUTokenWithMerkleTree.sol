// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./MerkleTree.sol";

contract ZKUTokenWithMerkleTree is ERC721URIStorage {
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

    // ref: https://ethereum.stackexchange.com/a/72679
    function toString(bytes memory data) public pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function awardItem(address receiver, address _merkleTree)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(receiver, newItemId);

        string memory uri = tokenURI(newItemId);
        _setTokenURI(newItemId, uri);

        // the sender and receiver addresses here can be same between transactions thus
        // we can save on no. of computations(read gas) while generating this tree
        // The generateTree method handles this.
        string[4] memory params = [
            toString(abi.encodePacked(msg.sender)), 
            toString(abi.encodePacked(receiver)), 
            Strings.toString(newItemId), 
            uri
        ];
        MerkleTree(_merkleTree).generateTree(params);

        return newItemId;
    }
}
