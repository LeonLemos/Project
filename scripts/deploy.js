// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME1 = 'Artificial NFT'
  const SYMBOL1 = 'AiNFT'
  const COST1 = ethers.utils.parseUnits('0.02', 'ether')
  
  
  // const IPFS_METADATA_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

  const NAME2 = 'NFTliser'
  const SYMBOL2 = 'NFTlzr'
  const COST2 = ethers.utils.parseUnits('0.01', 'ether')

  // Deploy AiNFT
  const iNFT = await hre.ethers.getContractFactory('iNFT')
  let inft = await iNFT.deploy(NAME1, SYMBOL1, COST1)

  await inft.deployed()
  console.log(`iNFT deployed to: ${inft.address}\n`)
  //await inft.initialize()
  console.log(`iNFT owner is: ${await inft.owner()}\n`)

  // Deploy NFTliser
  const NFTliser = await hre.ethers.getContractFactory('NFTliser721')
  let nftliser = await NFTliser.deploy(NAME2, SYMBOL2, COST2 )

  await nftliser.deployed()
  console.log(`NFTliser deployed to: ${nftliser.address}\n`)
  //await nftliser.initialize()
  console.log(`NFTliser owner is: ${await nftliser.owner()}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
