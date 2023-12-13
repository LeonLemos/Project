import {ethers} from 'ethers'
import { setProvider, setNetwork, setAccount } from './reducers/provider'

import  { setInftContract, inftBalanceLoaded, inftCostLoaded, mintRequest, mintSuccess, mintFail, inftSupplyUpdated, setOwner, inftDepositsLoaded, withdrawRequest, withdrawSuccess, withdrawFail, } from './reducers/inft';
import  { setNftliserContract, nftliserBalanceLoaded, nftliserCostLoaded, nftliserSupplyUpdated, mint2Request, mint2Success, mint2Fail, nftliserDepositsLoaded } from './reducers/nftliser';

// Config: Import your network config here
import config from '../config.json';

// ABIs: Import your contract ABIs here
import iNFT_ABI from '../abis/iNFT.json'
import NFTLISER_ABI from '../abis/NFTliser.json'

export const loadProvider = async ( dispatch ) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch(setProvider(provider))

    return provider;
}

export const loadNetwork = async ( provider, dispatch ) => {
    const chainId = await provider.getNetwork()
    dispatch(setNetwork(chainId))

    return chainId;
}

export const loadAccount = async ( dispatch ) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    dispatch(setAccount(account))

    return account;
}

//-----------------------------------------------------------------------------------------------------------------
//LOAD CONTRACTS

export const loadINFT = async ( provider, chainId, dispatch ) =>{
    const inft = new ethers.Contract(config[31337].inft.address, iNFT_ABI, provider)

    dispatch(setInftContract(inft))
    return inft
}

export const loadNFTliser = async ( provider, chainId, dispatch ) =>{
    const nftliser = new ethers.Contract(config[31337].nftliser.address, NFTLISER_ABI, provider)

    dispatch(setNftliserContract(nftliser))
    return nftliser
}

//-----------------------------------------------------------------------------------------------------------------
//LOAD BALANCES

export const loadInftBalance = async ( inft, account, dispatch ) =>{
    const inftBalance = await inft.balanceOf(account)

    dispatch(inftBalanceLoaded(inftBalance.toString()))
    return inftBalance
}

export const loadNFTliserBalance = async (nftliser, account, dispatch) =>{
    const nftliserBalance = await nftliser.balanceOf(account)
    
    dispatch(nftliserBalanceLoaded(nftliserBalance.toString()))
    return nftliserBalance
}

//-----------------------------------------------------------------------------------------------------------------
//LOAD DEPOSITS

export const loadInftDeposits = async (inft, provider, dispatch) =>{
    //const inftDeposits = await ethers.provider.getBalance(inft.address)
    //const inftDeposits = await web3.eth.getBalance(inft.address)
    const inftDeposits = await provider.getBalance(inft.address)

    dispatch(inftDepositsLoaded(ethers.utils.formatUnits(inftDeposits, "ether")))
    return inftDeposits
}

export const loadNFTliserDeposits = async (nftliser, provider, dispatch) =>{
    const nftliserDeposits = await provider.getBalance(nftliser.address)
    
    dispatch(nftliserDepositsLoaded(ethers.utils.formatUnits(nftliserDeposits, "ether")))
    //dispatch(nftliserDepositsLoaded(nftliserDeposits.toString()))
    return nftliserDeposits
}

//-----------------------------------------------------------------------------------------------------------------
//LOAD COST
export const loadInftCost = async (inft, dispatch) =>{
    const inftCost = await inft.cost()

    dispatch(inftCostLoaded(ethers.utils.formatUnits(inftCost, 'ether')))
    return inftCost
}

export const loadNFTliserCost = async (nftliser, dispatch) =>{
    const nftliserCost = await nftliser.cost()

    dispatch(nftliserCostLoaded(ethers.utils.formatUnits(nftliserCost, 'ether')))
    return nftliserCost
}

//----------------------------------------------------------------------------------------------------------------
//Owner

export const loadOwner = async (inft, dispatch) =>{
    const owner = await inft.owner()

    dispatch(setOwner(owner))
    return owner
}

//-------LOAD SUPPLY COUNTS

export const updateInftSupply = async (inft, dispatch) =>{
    const inftSupply = await inft.totalSupply()

    dispatch(inftSupplyUpdated(inftSupply.toNumber()))
    return inftSupply
}

export const updateNFTliserSupply = async (nftliser, dispatch) =>{
    const nftliserSupply = await nftliser.totalSupply()

    dispatch(nftliserSupplyUpdated(nftliserSupply.toNumber()))
    return nftliserSupply
}

//----------------------------------------------------------------------------------------------------------------
//LOAD MINT
export const mint = async (provider, inft, tokenURI, dispatch) =>{

    try{

    dispatch(mintRequest())

    let transaction
    const signer = await provider.getSigner()
    transaction = await inft.connect(signer).mint(tokenURI, { value: ethers.utils.parseUnits("0.02", "ether")  })

    await transaction.wait()
    dispatch(mintSuccess(transaction.hash))

    } catch(error) {
        dispatch(mintFail())
    }
}

export const mint2 = async (provider,/* data, */ nftliser, finalCid, dispatch) =>{

    try{

    dispatch(mint2Request())

    const signer = await provider.getSigner()
    const accounts = await provider.send("eth_requestAccounts", []);

    const cost = await nftliser.cost();
    //const totalCost = cost * data.units;
    const transaction = {
        from: accounts[0],
        value: ethers.utils.parseUnits(cost.toString(), "wei") 
    }
    
    const tx = await nftliser.connect(signer).mint( finalCid, transaction);
    console.log(tx);

    dispatch(mint2Success(transaction.hash))

    }catch(error){
        dispatch(mint2Fail())
    }
}

//----------------------------------------------------------------------------------------------------------------
//WITHDRAW
export const withdraw = async ( provider, nftliser, inft, dispatch) =>{

    try{

    dispatch(withdrawRequest())

    const signer = await provider.getSigner()
        
    let transaction1 = await nftliser.connect(signer).withdraw()
    await transaction1.wait()

    let transaction2 = await inft.connect(signer).withdraw()
    await transaction2.wait()

    dispatch(withdrawSuccess())

    }catch(error){
        dispatch(withdrawFail())

    }
}





