const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Token', () => {
    const NAME = 'Intelligent NFT'
    const SYMBOL = 'iNFT'
    const COST = ether(10)
    const MAX_SUPPLY = 100
    const BASE_URI = 'ipfs://lorum/'

    let inft

    beforeEach(async () => {
        let accounts = await ethers.getSigners()
        deployer = accounts[0]
        minter = accounts[1] 
    })

    describe('Deployment', () => {

        const ALLOW_MINTING_ON = (Date.now()+120000).toString().slice(0,10) //2 mins from now

        beforeEach(async () => {
        const iNFT = await ethers.getContractFactory('iNFT')
        inft = await iNFT.deploy(NAME, SYMBOL, COST, /* MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI */)  
        })
    
        it('has correct name', async () => {
        expect(await inft.name()).to.equal(NAME)
        })

        it('has correct symbol', async () => {
        expect(await inft.symbol()).to.equal(SYMBOL)
        })

        it('has correct cost', async () => {
            expect(await inft.cost()).to.equal(COST)
        })

        it('return the maximum total supply', async () => {
            expect(await inft.maxSupply()).to.equal(MAX_SUPPLY)
        })

        it('returns the allowed minting', async () => {
            expect(await inft.allowMintingOn()).to.equal(ALLOW_MINTING_ON)
        })

        it('returns the Base Uri', async () => {
            expect(await inft.baseURI()).to.equal(BASE_URI)
        })

        it('returns the owner ', async () => {
            expect(await inft.owner()).to.equal(deployer.address)
        })


    })

    describe('Minting', () => {
        let transaction, result
    
        describe('Success', async () => {
            

            const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 

            beforeEach(async () => {
            const iNFT = await ethers.getContractFactory('iNFT')
            inft = await iNFT.deploy(NAME, SYMBOL, COST, /* MAX_SUPPLY, ALLOW_MINTING_ON,  BASE_URI */ )  
            
            transaction = await inft.connect(minter).mint(BASE_URI,{value:COST})
            result = await transaction.wait()
            
            })

            it('Returns URI', async () => {
                const result = await inft.tokenURI('1')
                expect(result).to.be.equal(BASE_URI)

                console.log(result)
            })

            it('Updates supply', async() =>{
            expect(await inft.totalSupply()).to.equal(1)
            })

            it('Updates contract balance', async() =>{
            expect(await ethers.provider.getBalance(inft.address)).to.equal(COST)
            })

            it('returns ipfs URI', async() =>{
                console.log(await inft.TokenURI(1))
                expect(await inft.TokenURI(1)).to.equal(`${BASE_URI}1.json`)
            })
      
        })

        describe('Failure', async () => {

            it('Rejects insuf payment', async() =>{
                const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
            
                await expect( inft.connect(minter).mint(1,{value:ether(1) })).to.be.reverted
            
             })

            it('Requires at least 1 NFT to be minted', async() =>{
                const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
                
                await expect( inft.connect(minter).mint(0,{value:COST})).to.be.reverted
                
            })

            it('Rejects minting more than 2 nfts', async() =>{
                const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
                
                await expect (inft.connect(minter).mint(3,{value:ether(30)})).to.be.reverted
                
            })


            it('Rejects minting before allowed time', async() =>{
                const ALLOW_MINTING_ON = new Date('May 26, 2030 18:00:00').getTime().toString().slice(0,10) 
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
                
                await expect( inft.connect(minter).mint(1,{value:COST})).to.be.reverted
                
            })

            it('Cant mint more than max amount', async() =>{
                const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
                
                await expect( inft.connect(minter).mint(100,{value:COST})).to.be.reverted
                
            })

            it('Does not return URI for invalid tokens', async() =>{
                const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
                inft.connect(minter).mint(1,{value:COST})

                await expect( inft.tokenURI('99')).to.be.reverted
                
            })

        })


    })

    describe('Displaying NFTS', () => {
        let transaction, result
    
        const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 

        beforeEach(async () => {
            const iNFT = await ethers.getContractFactory('iNFT')
            inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
            
            transaction = await inft.connect(minter).mint(2,{value:ether(20)})
            result = await transaction.wait()
        })

        it('Returns all the nfts for a given owner', async() =>{
            let tokenIds = await inft.walletOfOwner(minter.address)
            console.log('testing...', tokenIds)  

            expect(tokenIds.length).to.equal(2)
            expect(tokenIds[0].toString()).to.equal('1')
            expect(tokenIds[1].toString()).to.equal('2')
 
        })
            
    })

    describe('Minting', () => {
        let transaction, result
    
        describe('Success', async () => {
            const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 

            beforeEach(async () => {
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
            
                transaction = await inft.connect(minter).mint(1,{value:COST})
                result = await transaction.wait()

                balanceBefore = await ethers.provider.getBalance(deployer.address)

                transaction = await inft.connect(deployer).withdraw()
                result = await transaction.wait()
            
            })

            it('Deducts contract balance', async() =>{
                expect(await ethers.provider.getBalance(inft.address)).to.equal(0)
            })

            it('Sends funds to the owner', async() =>{
                expect(await ethers.provider.getBalance(deployer.address)).to.be.greaterThan(balanceBefore)
            })

            it('emits a withdraw event', async() =>{
                expect(transaction).to.emit(inft,'Withdraw').withArgs(COST, deployer.address)
            })
      
        })

        describe('Failure', async () => {

            it('prevents non-owner from withdrawing', async() =>{
                const ALLOW_MINTING_ON = Date.now().toString().slice(0,10) 
                const iNFT = await ethers.getContractFactory('iNFT')
                inft = await iNFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI) 
                inft.connect(minter).mint(0, { value:COST })
            
                await expect( inft.connect(minter).withdraw()).to.be.reverted
            
            })

        })

    })

        

    


    


})
