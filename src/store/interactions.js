import {ethers} from 'ethers'

import { setProvider, setNetwork, setAccount } from './reducers/provider'
import { Web3Storage, File } from "web3.storage";


import  { setInftContract, inftBalanceLoaded, inftCostLoaded, mintRequest, mintSuccess, mintFail } from './reducers/inft';
import  { setNftliserContract, nftliserBalanceLoaded, nftliserCostLoaded, mint2Request, mint2Success, mint2Fail } from './reducers/nftliser';



// Config: Import your network config here
import config from '../config.json';

// ABIs: Import your contract ABIs here
import iNFT_ABI from '../abis/iNFT.json'
import NFTLISER_ABI from '../abis/NFTliser.json'



export const loadProvider = async (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch(setProvider(provider))

    return provider;
}

export const loadNetwork = async (provider, dispatch) => {
    const chainId = await provider.getNetwork()
    dispatch(setNetwork(chainId))

    return chainId;
}

export const loadAccount = async (dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    dispatch(setAccount(account))

    return account;
}

//-----------------------------------------------------------------------------------------------------------------
//LOAD CONTRACTS

export const loadNFTliser = async ( provider, chainId, dispatch) =>{
    const nftliser = new ethers.Contract(config[31337].nftliser.address, NFTLISER_ABI, provider)

    dispatch(setNftliserContract(nftliser))
    return nftliser
}

export const loadINFT = async ( provider, chainId, dispatch) =>{
    const inft = new ethers.Contract(config[31337].inft.address, iNFT_ABI, provider)

    dispatch(setInftContract(inft))
    return inft
}

//-----------------------------------------------------------------------------------------------------------------
//LOAD BALANCES

export const loadInftBalance = async (inft, account, dispatch) =>{
    const inftBalance = await inft.balanceOf(account)

    dispatch(inftBalanceLoaded(inftBalance.toString()))
    return inftBalance
}

export const loadNFTliserBalance = async (nftliser, account,id, dispatch) =>{
    const nftliserBalance = await nftliser.balanceOf(account, id)
    
    dispatch(nftliserBalanceLoaded(nftliserBalance.toString()))
    return nftliserBalance
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

//-----------------------------------------------------------------------------------------------------------------
//LOAD CID

/*
export const loadNFTliserCid = async (dispatch) =>{

    
    
    let selectedImage = null
    let selectedMedia = null

    //web3storage get token
    function getAccessToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY3M2E1Y0UwZDY1M0NDNjkyOGE3MjZFNmFEQTI3ZjlEMERBRTI0MDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTc0ODExNjA2MTQsIm5hbWUiOiJORlRsaXNlciJ9.-V4LO4pD0PsBQul8aoJ5OSfXUKoCalbsyQY6tZ4BArM";
    }
  
    function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
    }

    const image = selectedImage;
    const media = selectedMedia;
    const blob = new Blob([image], { type: "image.png" });
    const blob2 = new Blob([media], { type: "file.mp4" });

    const files = [new File([blob], "image"), new File([blob2], "media")];
    console.log("Step one: ", files);

    const client = makeStorageClient();
    const cid = await client.put(files);

   // dispatch(loadNFTliserCid(cid))
    return cid;

}
*/

//-----------------------------------------------------------------------------------------------------------------
//LOAD MINT
export const mint = async (provider, inft,tokenURI, dispatch) =>{

    try{

    dispatch(mintRequest())

    let transaction
    const signer = await provider.getSigner()
    transaction = await inft.connect(signer).mint(tokenURI, { value: ethers.utils.parseUnits("5", "ether")  })

    await transaction.wait()
    dispatch(mintSuccess(transaction.hash))

    } catch(error) {
        dispatch(mintFail())
    }
}

export const mint2 = async (provider,data, nftliser, finalCid, dispatch) =>{

    dispatch(mint2Request())
    
    const signer = await provider.getSigner()
    const accounts = await provider.send("eth_requestAccounts", []);

    const cost = await nftliser.cost();
     const totalCost = cost * data.units;
      const transaction = {
      from: accounts[0],
      value: ethers.utils.parseUnits(totalCost.toString(), "wei"),
      
    };
    const tx = await nftliser.connect(signer).mint(data.units, finalCid, transaction);
    console.log(tx);  
   
    /* const totalCost = (await nftliser.cost()) * data.units;
    transaction = {
        from: signer,
        value: ethers.utils.parseUnits(totalCost.toString(), "wei"),
        gasPrice: gas, 
    };
    tx = await nftliser.connect(signer).mint(data.units, finalCid, transaction);
    await tx.wait() */

}
