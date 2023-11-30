// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import './Counters.sol';
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract iNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;
    uint256 public cost;
    address public owner;
    // uint256 public maxSupply;
    // uint256 public allowMintingOn;
    // string public tokenURI;
    // uint256 public tokenId;
    // string public baseURI;
    // string public baseExtension = '.json';

    Counters.Counter private _tokenIds;

    // Optional mapping for token URIs
    // mapping(uint256 => string) private _tokenURIs;

   // event Mint(uint256 amount, address minter);
    event Withdraw(uint256 amount, address owner);

    constructor( string memory _name, string memory _symbol, uint256 _cost) 
    ERC721(_name, _symbol){
        cost = _cost;
        
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    
    function mint(string memory tokenURI) public payable {
        require(msg.value >= cost);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function withdraw() public onlyOwner{
        uint256 balance = address(this).balance;

        (bool sucess,) = payable(msg.sender).call{value:balance}("");
        require(sucess);

        emit Withdraw(balance, msg.sender);
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

}