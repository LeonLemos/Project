import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'


// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Homepage from './Homepage';
import MintPage from './MintPage1';
import MintPage2 from './MintPage2';

import { loadProvider, loadNetwork, loadAccount, loadOwner } from '../store/interactions';
import { loadINFT, loadNFTliser  } from '../store/interactions';
import { loadInftBalance,loadInftCost, loadNFTliserBalance, loadNFTliserCost, updateInftSupply, updateNFTliserSupply,loadInftDeposits,loadNFTliserDeposits} from '../store/interactions';


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

    // Fetch current accounts
    window.ethereum.on('accountsChanged', async()=>{
      await loadAccount(dispatch)
    })

  
    // Initiate contracts
    const inft = await loadINFT(provider, chainId, dispatch)
    const nftliser = await loadNFTliser(provider, chainId, dispatch)

    // Fetch Balance
    await loadInftBalance(inft, await loadAccount(dispatch), dispatch)
    await loadNFTliserBalance (nftliser, await loadAccount(dispatch), dispatch)
                      
    // Fetch Cost
    await loadInftCost(inft, dispatch)
    await loadNFTliserCost(nftliser, dispatch)

    //Fetch owner account
    await loadOwner(inft, dispatch)

    // Fetch Supply
    await updateInftSupply(inft,dispatch)
    await updateNFTliserSupply(nftliser,dispatch)

    // Fetch Deposits
    await loadInftDeposits(inft, provider, dispatch)
    await loadNFTliserDeposits(nftliser, provider, dispatch)

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
