// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = 'Intelligent NFT'
  const SYMBOL = 'iNFT'
  const COST = ethers.utils.parseUnits('1', 'ether')
  // const MAX_SUPPLY = 25
  // const NFT_MINT_DATE = (Date.now() + 60000).toString().slice(0, 10)
  // const IPFS_METADATA_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

  const NAME2 = 'NFTliser'
  const SYMBOL2 = 'NFTlzr'

  // Deploy NFT
  const iNFT = await hre.ethers.getContractFactory('iNFT')
  let inft = await iNFT.deploy(NAME, SYMBOL, COST /* , MAX_SUPPLY, NFT_MINT_DATE, IPFS_METADATA_URI*/)

  await inft.deployed()
  console.log(`iNFT deployed to: ${inft.address}\n`)

  // Deploy NFTliser
  const NFTliser = await hre.ethers.getContractFactory('NFTliser')
  let nftliser = await NFTliser.deploy(NAME2, SYMBOL2, COST /* , MAX_SUPPLY, NFT_MINT_DATE, IPFS_METADATA_URI*/)

  await nftliser.deployed()
  console.log(`NFTliser deployed to: ${nftliser.address}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
