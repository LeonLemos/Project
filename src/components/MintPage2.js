import React, { useState } from 'react'
import { Web3Storage } from "web3.storage";
import { NFTStorage, File } from 'nft.storage'

import { mint2 } from '../store/interactions';
import Alert from './Alert';

import { useDispatch, useSelector } from 'react-redux';

// Components
import Spinner from 'react-bootstrap/Spinner';

//import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
//dotenv.config()
// import 'dotenv/config' ;

//require("dotenv").config({path:"/Users/tertulianosilva/code/iNFT_Project/.env"})
 
function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:

  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY3M2E1Y0UwZDY1M0NDNjkyOGE3MjZFNmFEQTI3ZjlEMERBRTI0MDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTc0ODExNjA2MTQsIm5hbWUiOiJORlRsaXNlciJ9.-V4LO4pD0PsBQul8aoJ5OSfXUKoCalbsyQY6tZ4BArM"
  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  //console.log(process.env.REACT_APP_WEB3STORAGE_API_KEY);
  //return process.env.REACT_APP_WEB3STORAGE_API_KEY ;
}

function makeStorageClient() {

  return new Web3Storage({ token: getAccessToken() })
}

const MintPage2 = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [finalCid, setFinalCid] = useState(null);
  const [isWaiting, setIsWaiting]= useState(true)
  const [isMintable, setIsMintable] = useState(false)
  const [ShowAlert, setShowAlert] = useState(0)
  
  const [flip, setFlip] = useState(false);

  const provider = useSelector(state=>state.provider.connection)
  const nftliser = useSelector(state=>state.nftliser.contract)

  const isMinting = useSelector(state => state.nftliser.minting.isMinting)
  const isSuccess = useSelector(state => state.nftliser.minting.isSuccess)
  const transactionHash = useSelector(state => state.nftliser.minting.transactionHash)

  const dispatch = useDispatch()

  const [data, setData] = useState({ name: "", description: "" });

  async function makeFileObjects() {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!

    const image = selectedImage;
    const media = selectedMedia;
    const blob = new Blob([image], { type: "image.png" });
    const blob2 = new Blob([media], { type: "file.mp4" });

    const files = [new File([blob], "image"), new File([blob2], "media")];
    console.log("Step one: ", files);

    const client = makeStorageClient();
    const cid = await client.put(files);
    //const cid = await client.storeDirectory(files)

    console.log("step two");
    console.log("stored files with cid:", cid); 

    var obj = new Object();
    obj.name = data.name;
    obj.description = data.description;
    obj.image = "ipfs://" + cid + "/image";
    obj.animation_url = "ipfs://" + cid + "/media";

    //convert object to json string
    var string = JSON.stringify(obj);
    console.log("step three");
    console.log("String ", string);

    const blob3 = new Blob([string], { type: "application.json" });

    const ipfsfiles = [new File([blob3], "json")];
    console.log("step four");
    console.log(ipfsfiles);

    const client2 = makeStorageClient();
    const cid2 = await client2.put(ipfsfiles);
    //const cid2 = await client2.storeDirectory(ipfsfiles);
    setFinalCid("ipfs://" + cid2 + "/json");
    console.log("finalCid = ", finalCid);

    setIsMintable(true)
  } 

  async function mint() {
    makeFileObjects();
    
    console.log(nftliser)
    await mint2 (provider, nftliser, finalCid, dispatch)

    setShowAlert(true)
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if(selectedImage === null){
      window.alert("Please provide a File")
      return
    }
    console.log("data created ", data);
    console.log("media", selectedMedia);

  };


  return (
    <div className='create-container'>
      <h3 className='my-4 p-4 text-center'>NFTliser</h3>
      <div className="text-center">Upload the file you want to NFTlise !</div>
      <div className="containerMain">

        <div className="left">
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="NFT Name"
              name="name"
              onChange={handleChange}
            />
            <input
              type="description"
              placeholder="NFT Description"
              name="description"
              onChange={handleChange}
            />
            <p>Image File</p>
            <input
              type="file"
              id="imageFile"
              name="myImage"
              accept="image/*"
              onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedImage(event.target.files[0]);
              }}
            />
            <p>Media File</p>
            <input
              type="file"
              name="myMedia"
              onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedMedia(event.target.files[0]);
              }}
            />
            <button
              id="BtnColor"
              className='submit'
              type="button"
              onClick={() => {
                setFlip(true);
                makeFileObjects();
                setIsWaiting(false);
                setIsMintable(false)
                setShowAlert(false)
              }}
            >
              Submit
            </button>  
            
          </form>
        </div>

        <div className="right">
        {isWaiting ? (
          <div className=" text-center">

            <p> We invite you to use our state-of-the-art <strong> NFTliser </strong>!</p>
            <p> Simply upload any Image/Media file
            and watch the magic happen as it turns into a mintable NFT!</p>
            <p>Don't forget to name and describe your masterpiece. </p>
            <p>Have Fun! </p>

          </div>
          
        ):(
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                {/* <img id="cardLogo" src={minted} alt="logo" /> */}
              </div>
              <div className="flip-card-back">
                {flip && (
                  <div className="front">
                    <p className="title">{data.name}</p>
                    <p className='description'>{data.description}</p>
                    
                    <img
                      alt="not found"
                      width={"180px"}
                      src={URL.createObjectURL(selectedImage)}
                    />
                    
                    { !isMintable? (
                    <div>
                      <div className='title my-3'> ...Preparing File to Mint... </div>
                      <div> <Spinner animation='border'/> </div> 
                    </div> ):(
                      <>
                      <br />

                      <button onClick={() => setSelectedImage(null)}>
                        Remove
                      </button>
                      {/* <br/> */}

                      <button id="BtnColor" className="mintBtn" onClick={mint}>
                      Mint
                      </button>

                      </>
                    )}              
                    {selectedMedia && (
                      <div className="media">
                        <p>Media File</p>
                        <p>{selectedMedia.name}</p>
                      </div>
                    )}
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <></>
          {isMinting ? (
          <Alert
          message={"Mint Pending..."}
          transactionHash={null}
          variant={'info'}
          setShowAlert={setShowAlert}
          />

        ): isSuccess && ShowAlert ? (
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

export default MintPage2


