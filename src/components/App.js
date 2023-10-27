import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import Countdown from 'react-countdown';
import { ethers } from 'ethers'


// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Data from './Data';
import Homepage from './Homepage';
import MintPage from './MintPage1';
import MintPage2 from './MintPage2';
import Loading from './Loading';

function App() {
    const [account, setAccount] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadBlockchainData = async () => {

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading) {
      loadBlockchainData()
        }
    }, [isLoading]);

  return(
    <Container >
      
      {account ? (
        <Navigation account={account} />
      ):(
        <p>Connect the Wallet Fool!</p>
      )}

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
