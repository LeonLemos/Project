const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Token', () => {
  let inft

  beforeEach(async () => {
    const iNFT = await ethers.getContractFactory('iNFT')
    inft = await iNFT.deploy('Intelligent NFT', 'iNFT')

    
  })

  describe('Deployment', () => {
    const name = 'Intelligent NFT'
    const symbol = 'iNFT'
    

    it('has correct name', async () => {
      expect(await inft.name()).to.equal(name)
    })

    it('has correct symbol', async () => {
      expect(await inft.symbol()).to.equal(symbol)
    })


  })


})
