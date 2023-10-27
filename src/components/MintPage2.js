import React, { useState } from 'react'
import { Web3Storage, File } from "web3.storage";
import { ethers } from "ethers";

// import 'dotenv/config' ;
// require('dotenv').config()

// import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config()

// ABIs: Import your contract ABIs here
import NFTliser_ABI from '../abis/NFTliser.json'

// Config: Import your network config here
import config from '../config.json';

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


const MintPage2 = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [finalCid, setFinalCid] = useState(null);
  const [flip, setFlip] = useState(false);

  const [data, setData] = useState({ name: "", description: "", units: "" });

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
    setFinalCid("ipfs://" + cid2 + "/json");
    console.log("finalCid = ", finalCid);
  }

  async function mint() {
    makeFileObjects();
    // const provider = new ethers.providers.JsonRpcProvider(
    //   "https://hidden-morning-seed.matic-testnet.discover.quiknode.pro/020a375541e8da3b2e4e95138cf72daee91ed6e2/"
    // );
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts[0])
    const signer = provider.getSigner();
    
    const network = await provider.getNetwork()

    const nftliser = new ethers.Contract(config[31337].nftliser.address, NFTliser_ABI, provider)
    console.log(nftliser)
    // const gasPrice = await provider.getFeeData();
    // console.log(gasPrice)
    // const gas = 1000000;//ethers.utils.formatUnits(100000000);
    const cost = await nftliser.cost();
    const totalCost = cost * data.units;
     const transaction = {
      from: accounts[0],
      value: ethers.utils.parseUnits(totalCost.toString(), "wei"),
      /*gasPrice: gas, */
    };
    const tx = await nftliser.connect(signer).mint(data.units, finalCid, transaction);
    console.log(tx); 

    //const transaction = await nftliser.connect(signer).mint(finalCid, { value: ethers.utils.parseUnits(totalCost.toString(), "wei") })
    //await transaction.wait()
    //console.log(transaction); 
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
      <p className="title text-center">Upload the file you want to NFTlise ?</p>
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
            <input
              type="number"
              placeholder="Number of NFTs to Mint"
              name="units"
              onChange={handleChange}
            />
            <p>Display image</p>
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
              }}
            >
              Submit
            </button>
          </form>
        </div>

        <div className="right">
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
                    <p>{data.units} x NFTs</p>
                    <img
                      alt="not found"
                      width={"180px"}
                      src={URL.createObjectURL(selectedImage)}
                    />
                    <br />
                    <button onClick={() => setSelectedImage(null)}>
                      Remove
                    </button>
                    {/* <br/> */}

                    {selectedMedia && (
                      <div className="media">
                        <p>Media File</p>
                        <p>{selectedMedia.name}</p>
                      </div>
                    )}

                    <button id="BtnColor" className="mintBtn" onClick={mint}>
                      Mint
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintPage2
