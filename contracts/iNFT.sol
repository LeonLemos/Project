// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import './ERC721Enumerable.sol';

contract iNFT is ERC721Enumerable {

    constructor( string memory _name, string memory _symbol) ERC721(_name, _symbol){
        
    }

}