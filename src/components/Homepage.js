import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link, Routes, Route, BrowserRouter} from 'react-router-dom'
import Countdown from 'react-countdown';
import { ethers } from 'ethers'
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { Web3Storage, File } from "web3.storage";




// ABIs: Import your contract ABIs here
import iNFT_ABI from '../abis/iNFT.json'
import NFTLISER_ABI from '../abis/NFTliser.json'


// Config: Import your network config here
import config from '../config.json';

import preview from '../preview.jpg';
import preview2 from '../preview2.jpg';


// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Data from './Data';
import Loading from './Loading';
import Data2 from './Data2';

//web3storage get token
function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhkZjE2REMzNzkzMjJiRUQxM2EzQjM4M0ZGRUViMTYwOUU1OUE5NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc5NDIzNjMzMTAsIm5hbWUiOiJNaW50ZWR0ZXN0In0.JDYGKZoWGLHC3M0BYq9Hj9pH5IQWOoHgH77t_yjYRmY";

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
   return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY3M2E1Y0UwZDY1M0NDNjkyOGE3MjZFNmFEQTI3ZjlEMERBRTI0MDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTc0ODExNjA2MTQsIm5hbWUiOiJORlRsaXNlciJ9.-V4LO4pD0PsBQul8aoJ5OSfXUKoCalbsyQY6tZ4BArM";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}


const Homepage = () => {

    const [provider, setProvider] = useState(null)
    
    const [inft, setINFT] = useState(null)
    const [inftBalance, setINFTBalance] = useState(0)
    const [inftCost, setINFTCost] = useState(0)

    const [nftliser, setNFTLISER] = useState(null)
    const [nftliserBalance, setNFTLISERBalance] = useState(0)
    const [nftliserCost,setNFTLISERCost]= useState(0)

    const [account, setAccount] = useState(null)
    const [url, setURL] = useState(null)

    

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [finalCid, setFinalCid] = useState(null);
    const [cid, setCid] = useState(null);
    const [cid2, setCid2] = useState(null);



    
    const [flip, setFlip] = useState(false);

    const [data, setData] = useState({ name: "", description: "", units: "" });


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

    const nftliser = new ethers.Contract(config[31337].nftliser.address, NFTLISER_ABI, provider)
    setNFTLISER(nftliser)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch Balance
    const inftBalance = await inft.balanceOf(account)
    setINFTBalance(inftBalance)

    //const nftliserBalance = await nftliser.balanceOf(account,cid)
    //setNFTLISERBalance(nftliserBalance)

    // Fetch Cost
    const inftCost = await inft.cost()
    setINFTCost(inftCost)

    const nftliserCost = await nftliser.cost()
    setNFTLISERCost(nftliserCost)

    
    setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading) {
      loadBlockchainData()
        }
    }, [isLoading]);
    

    return(
        <div className='my-4 text-center'>
        <h1 className='my-4 text-center'>Intelligent NFTs</h1>
        <p>Which type of NFT would you like to create?</p>

        {isLoading ? (
        <Loading />
       ) : ( 
        <>
          <Row>
            {/* 1st Row Column leftside */} 
            <Col>

            <Link to="/Mint">
            <img src={preview2} className="AiNFT-Link" width='100%' height = '100%' />
            </Link>
             
            </Col>
            
            {/* 1st Row Column rightside */}
            <Col>
              
            <Link to="/Mint2">
            <img src={preview} className="NFTliser-Link" width='100%' height = '100%'/>
            </Link>
             
            </Col>
          </Row>

          <Row>
            {/* 2nd Row Column leftside */}
            <Col>
                <h3 className='my-3'>AiNFT</h3>  
                <Data
                cost={inftCost}
                balance={inftBalance}
                />     
            </Col>

            {/* 2nd Row Column rightside */}
            <Col>
                <h3 className='my-3'>NFTliser</h3>
                <Data
                cost={nftliserCost}
                balance={nftliserBalance}
                />     
            </Col>

          </Row>
        </>
               )} 
        </div>
        
    )
        
}

export default Homepage;
