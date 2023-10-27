// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import './Counters.sol';

contract NFTliser721 is ERC721URIStorage {

    address public owner;
    uint256 public cost;
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    mapping (uint256 => string) private _tokenURIs;


    constructor( string memory _name, string memory _symbol, uint256 _cost) 
    ERC721(_name, _symbol){
        cost = _cost;
    }

    function uri(uint256 tokenId) public view returns (string memory){
        return(_tokenURIs[tokenId]);
    }

    /* function _ownerOf(uint256 tokenId) internal view returns (bool) {
        return balanceOf(msg.sender, tokenId) != 0;
    } */

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setCost(uint256 _cost) public onlyOwner {
        cost = _cost;
    }

    function mint(string memory tokenURI) public payable {
        require(msg.value >= cost);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }

   /* function mint(uint256 amount, string memory setUri) payable virtual public {
        require(msg.value >= (amount * cost), "Not enough ether sent");
        uint256 tokenId = _tokenIdCounter.current();
        _mint(msg.sender, tokenId, amount, "");
        _tokenIdCounter.increment();
        _uris[tokenId] = setUri;
    }


    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }  */

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    // The following functions are overrides required by Solidity.

    /*  function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    } */
 
}