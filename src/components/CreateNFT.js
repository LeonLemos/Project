import React, { useState } from 'react'
import '../styles/App.css'
import '../styles/CreateNFT.css'
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import { abi } from "../components/abi";
// import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config()

//web3storage get token
function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhkZjE2REMzNzkzMjJiRUQxM2EzQjM4M0ZGRUViMTYwOUU1OUE5NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc5NDIzNjMzMTAsIm5hbWUiOiJNaW50ZWR0ZXN0In0.JDYGKZoWGLHC3M0BYq9Hj9pH5IQWOoHgH77t_yjYRmY";

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
   return process.env.REACT_APP_NFT_STORAGE_API_KEY
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}


const CreateNFT = () => {

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
    const contractAddress = "0xf76D167A96Fff3526918aad94e2963Bf772444ad"; // walaby testnet
    const contract = new ethers.Contract(contractAddress, abi, provider);
    console.log(contract)
    // const gasPrice = await provider.getFeeData();
    // console.log(gasPrice)
    const gas = 1000000;//ethers.utils.formatUnits(100000000);
    const costFromContract = await contract.cost();
    const totalCost = costFromContract * data.units;
    const withSigner = contract.connect(signer);
    const transaction = {
      from: accounts[0],
      value: ethers.utils.parseUnits(totalCost.toString(), "wei"),
      gasPrice: gas,
    };
    const tx = await withSigner.mint(data.units, finalCid, transaction);
    console.log(tx);
  }



  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if(selectedImage === null){
    //   console.log("no data")
    // }
    console.log("data created ", data);
    console.log("media", selectedMedia);
  };
  return (
    <div className='create-container'>
      <h3>0.3 tFILL to Mint per item</h3>
        <div className="containerMain">
        <div className="left">
          <p className="title">Create your NFTs</p>

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

export default CreateNFT
