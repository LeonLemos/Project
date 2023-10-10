import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import Countdown from 'react-countdown';
import { ethers } from 'ethers'

// ABIs: Import your contract ABIs here
import iNFT_ABI from '../abis/iNFT.json'

// Config: Import your network config here
import config from '../config.json';

import preview from '../preview.png';

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Data from './Data';
import Mint from './Mint';
import Mint2 from './Mint2';
import Loading from './Loading';


const MintPage = () => {

    const [provider, setProvider] = useState(null)
    const [inft, setINFT] = useState(null)

    const [account, setAccount] = useState(null)

    const [revealTime, setRevealTime] = useState(0)
    const [maxSupply, setMaxSupply] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0)
    const [cost, setCost] = useState(0)
    const [balance, setBalance] = useState(0)

    const [isLoading, setIsLoading] = useState(true)

    const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const inft = new ethers.Contract(config[31337].inft.address, iNFT_ABI, provider)
    setINFT(inft)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch Countdown
    const allowMintingOn = await inft.allowMintingOn()
    setRevealTime(allowMintingOn.toString()+'000')

    setMaxSupply(await inft.maxSupply())

    setTotalSupply(await inft.totalSupply())

    setCost(await inft.cost())

    setBalance(await inft.balanceOf(account))
    
    setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading) {
      loadBlockchainData()
        }
    }, [isLoading]);
    

    return(
        <div className='my-4 text-center'>
        <h1 className='my-4 text-center'>Intelligent NFT</h1>
        <p>Create your iNFT</p>

        {isLoading ? (
        <Loading />
       ) : ( 
        <>
          <Row>
            {/* 1st Row Column leftside */} 
            <Col>
              { balance > 0 ? (
                <div className='text-center'>
                  <img src={`https:gateway.pinata.coud/ipfs/Lorem/${balance.toString()}.png`} alt="Intelligent NFT" width='400px' height = '400px' />
                </div>
              ):(
              <img src={preview} alt=""/>
              )}
  
            </Col>
            
            {/* 2nd Row Column rightside */}
            <Col>
                <h3>2nd Done</h3>
                <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
                />     

                <Mint
                provider={provider}
                inft={inft}
                cost={cost}
                setIsLoading={setIsLoading}
                />
            </Col>
          </Row>

          <Row>
            

            

          </Row>
        </>
               )} 
        </div>
        
    )
        
}

export default MintPage;
