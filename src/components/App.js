import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap'
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import { Web3Storage, File } from "web3.storage";

// ABIs: Import your contract ABIs here
import iNFT_ABI from '../abis/iNFT.json'
import NFTLISER_ABI from '../abis/NFTliser.json'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Data from './Data';
import Homepage from './Homepage';
import MintPage from './MintPage1';
import MintPage2 from './MintPage2';
import Loading from './Loading';

import { loadProvider, loadNetwork, loadAccount } from '../store/interactions';
import { loadINFT, loadNFTliser  } from '../store/interactions';
import { loadInftBalance,loadInftCost, loadNFTliserBalance, loadNFTliserCost, updateInftSupply, updateNFTliserSupply} from '../store/interactions';


function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {

    // Initiate provider
    const provider = await loadProvider(dispatch)

    //Fetch current network chainID
    const chainId = await loadNetwork(provider, dispatch)

    //Reload page when network changes
    window.ethereum.on('chainChanged', ()=>{
      window.location.reload()
    })

    // Fetch account
    let account = await loadAccount(dispatch)

    // Fetch current accounts
    window.ethereum.on('accountsChanged', async()=>{
      await loadAccount(dispatch)
    })

    // Initiate contracts
    const inft = await loadINFT(provider, chainId, dispatch)
    const nftliser = await loadNFTliser(provider, chainId, dispatch)

    // Fetch Balance
    const inftBalance = await loadInftBalance(inft, account, dispatch)
    const nftliserBalance = await loadNFTliserBalance (nftliser, account, dispatch)
                      
    // Fetch Cost
    const inftCost = await loadInftCost(inft, dispatch)
    const nftliserCost = await loadNFTliserCost(nftliser, dispatch)

    // Fetch Count
    const inftSupply = await updateInftSupply(inft,dispatch)
    const nftliserSupply = await updateNFTliserSupply(nftliser,dispatch)

  }

  useEffect(() => {
    loadBlockchainData()
      }, []);

  return(
    <Container >
      
      <Navigation />

      <Tabs />  

      <hr style={{color: '#151C21', backgroundColor: '#151C21',height: 10, opacity: 1 }}/>

      <Routes>
        <Route exact path="/" element={<Homepage/>} />
        <Route path="Mint" element={<MintPage />} />
        <Route path="Mint2" element={<MintPage2 />} />
      </Routes>
      
    </Container>
  )
}

export default App;
