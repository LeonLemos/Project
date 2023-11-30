const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Token', () => {
    const amount = 1
    const amount2 = 2
    const COST = ether(1)
    const BASE_URI = ""

    let nftliser

    beforeEach(async () => {
        let accounts = await ethers.getSigners()
        deployer = accounts[0]
        minter = accounts[1] 
    })

    describe('Deployment', () => {

        const ALLOW_MINTING_ON = (Date.now()+120000).toString().slice(0,10) //2 mins from now

        beforeEach(async () => {
        const NFTliser = await ethers.getContractFactory('NFTliser1155')
        nftliser = await NFTliser.deploy(/*NAME, SYMBOL, COST,  MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI */)  
        })

        it('has correct cost', async () => {
            expect(await nftliser.cost()).to.equal(COST)
        })

    })

    describe('Minting', () => {
        let transaction, result
    
        describe('Success', async () => {

            beforeEach(async () => {
            const NFTliser = await ethers.getContractFactory('NFTliser1155')
            nftliser = await NFTliser.deploy(/* NAME, SYMBOL, COST,  MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI */ )  
            
            transaction = await nftliser.connect(minter).mint(amount2,BASE_URI,{value:ether(2)})
            result = await transaction.wait()
            
            })

            it('Returns URI', async () => {
                const result = await nftliser.uri('1')
                expect(result).to.be.equal(BASE_URI)

                console.log(result)
            })

            it('Updates supply', async() =>{
            expect(await nftliser.totalSupply()).to.equal(1)
            })

            
      
        })
    })
})