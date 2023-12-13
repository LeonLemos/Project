
import { useState } from 'react'
import { NFTStorage, File } from 'nft.storage'
import { Buffer } from 'buffer';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { mint } from '../store/interactions';
import Alert from './Alert';

// Components
import Spinner from 'react-bootstrap/Spinner';

require('dotenv').config()

const MintPage = () => {

  const [isWaiting, setIsWaiting] = useState(false)
  const [message, setMessage] = useState("")
  const [ShowAlert, setShowAlert] = useState(0)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [url, setURL] = useState(null)

  const isMinting = useSelector(state => state.inft.minting.isMinting)
  const isSuccess = useSelector(state => state.inft.minting.isSuccess)
  const transactionHash = useSelector(state => state.inft.minting.transactionHash)

  // Initiate provider
  const provider = useSelector(state=>state.provider.connection)

  const inft = useSelector(state=>state.inft.contract)

  const dispatch = useDispatch()
  
  const submitHandler = async (e) =>{
    e.preventDefault()
    setIsWaiting(true)
    setShowAlert(false)

    if (name === "" || description === "") {
      window.alert("Please provide a name and description")
      return
    }

    //call AI API to generate a image based on description
    const imageData = await createImage() 

    //Upload image to IPFS(NFT.Storage)
    const url = await uploadImage(imageData) 

    //Mint nft
    await mintImage(url)

    setMessage("")
    setIsWaiting(false)
    setShowAlert(true)

  }
    
  const createImage = async () => {
    setMessage('Generating image...')

    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`

    const response = await axios({
      url: URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}` , //Import from .env file
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
    setMessage('Uploading image...')

    //Instantiate to NFT.Storage
    const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY })
    
    //Send request to store image
    const { ipnft } = await nftstorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    })

    console.log({ ipnft })

    // Save the URL
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
    setURL(url)

    return url
  }

  const mintImage = async (tokenURI) =>{
    
    setMessage("Waiting for mint...")
    await mint(provider, inft, tokenURI, dispatch)

  }

  return(
      <div className='MintPage' >
        <h3 className='my-4 p-4 text-center' >AiNFT</h3>
        <p className='my-4 text-center'>Describe What You would like to create...</p>

          {/* 1st Row Column leftside */} 
          <div className='form'>
            <div className='image' >
                {!isWaiting && image ? (
                <img src={image} alt="Intelligent NFT"  />
                ) : isWaiting ? (
                  <div className='image__placeholder' >
                    <Spinner animation='border'/>
                    <p>{message}</p>
                  </div>
                ): !isWaiting && !image ? (
                  
                  <div className=" text-center" style={{color: 'white' }} > 
                  <p>Create your next digital masterpieces with the help of AI. </p>
                  <p>Simply provide a description, and our cutting-edge AI algorithms will spring into action, transforming your ideas into captivating visual wonders!</p>
                  <p>Have Fun! </p> 
                  
                  </div>
                  
                ):("")}
            </div>  
          </div>
              
          {/* 2nd Row Column rightside */}
            <div >
              <form onSubmit={submitHandler} > 
                <input type='text' placeholder='Create a name...' onChange={(e) => {setName(e.target.value)}}></input>                
                <input type='text' placeholder='Create a description...' onChange={(e) => {setDescription(e.target.value)}}></input>
                <input type='submit' value='Create & Mint NFT'  ></input>
              </form>
            </div>
          
            <div>
              {!isWaiting && url && (
                <p>
                  View&nbsp;<a href={url} target="_blank" rel="noreferrer">Metadata</a>
                </p>
              )}
            </div>

            <></>
            {isMinting ? (
            <Alert
            message={"Mint Pending..."}
            transactionHash={null}
            variant={'info'}
            setShowAlert={setShowAlert}
            />

          ): isSuccess && ShowAlert ?(
            <Alert
            message={"Mint Successful..."}
            transactionHash={transactionHash}
            variant={'success'}
            setShowAlert={setShowAlert}
            />

          ): !isSuccess && ShowAlert ? (
            <Alert
            message={"Mint Failed..."}
            transactionHash={null}
            variant={'danger'}
            setShowAlert={setShowAlert}
            />
          
          ):(<></>)}
        
      </div>
      
  )
        
}

export default MintPage;
