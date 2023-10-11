import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { NFTStorage, File } from 'nft.storage'
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import Countdown from 'react-countdown';
import { ethers } from 'ethers'
import { Buffer } from 'buffer';
import axios from 'axios';

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
  const [isWaiting, setIsWaiting] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)

  const [account, setAccount] = useState(null)

  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const submitHandler = async (e) =>{
    e.preventDefault()
    
    const imageData = createImage() //call AI API to generate a image based on description

  }
    
  const createImage = async () => {
    console.log('generating image...')

    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`

    const response = await axios({
      url: URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer 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`, //Import from .env file
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        inputs: description, options: { wait_for_model: true },
      }),
      responseType: 'arraybuffer',
    })

    const type = response.headers['content-type']
    const data = response.data

    const base64data = Buffer.from(data).toString('base64')
    const img = `data:${type};base64,` + base64data // <-- This is so we can render it on the page
    setImage(img)

    return data
  }

  const uploadImage = async ( imageData) =>{
    console.log('uploading image...')

    new NFTStorage({ token: })
  }

    

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
          {/* 1st Row Column leftside */} 
          <div>
            { balance > 0 ? (
              <div className='text-center'>
                <img src={image} alt="Intelligent NFT" width='400px' height = '400px' />
              </div>
            ):(
            <img src={image} alt=""/>
            )}

          </div>
          
          {/* 2nd Row Column rightside */}
          <div>
          
              <div className='form'>
                <form onSubmit={submitHandler}>
                  <input type='text' placeholder='Create a name...' onChange={(e) => {setName(e.target.value)}}></input>
                  <input type='text' placeholder='Create a description...' onChange={(e) => {setDescription(e.target.value)}}></input>
                  <input type='submit' value='Create & Mint' ></input>
                </form>
              </div>
          </div>
        
        </>
              )} 
      </div>
      
  )
        
}

export default MintPage;
