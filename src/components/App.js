import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { HashRouter, Routes, Route, BrowserRouter} from 'react-router-dom'
import Countdown from 'react-countdown';
import { ethers } from 'ethers'


// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Data from './Data';
import Homepage from './Homepage';
import Mint from './Mint';
import Mint2 from './Mint2';
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
    <Container>
      
        <Navigation account={account} />

        <hr />
        
        <Tabs />

        <Routes>
          <Route exact path="/" element={<Homepage/>} />
          <Route path="Mint" element={<Mint />} />
          <Route path="Mint2" element={<Mint2 />} />
        </Routes>
      
    </Container>
  )
}

export default App;
