import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap'
import { Link, Routes, Route, BrowserRouter} from 'react-router-dom'

import preview from '../preview.jpg';
import preview2 from '../preview2.jpg';

import { loadProvider, loadNetwork, loadAccount,  } from '../store/interactions';
import { loadINFT, loadNFTliser } from '../store/interactions';
import {loadInftBalance,loadInftCost, withdraw, loadOwner} from '../store/interactions';

const Homepage = () => {
  const provider = useSelector(state=>state.provider.connection)
  const account = useSelector(state=>state.provider.account)
  const inft = useSelector(state=>state.inft.contract)
  const nftliser = useSelector(state=>state.nftliser.contract)

  const inftCost = useSelector(state=>state.inft.cost)
  const nftliserCost = useSelector(state=>state.nftliser.cost)

  const inftBalance = useSelector(state=>state.inft.balanceOf)
  const nftliserBalance = useSelector(state=>state.nftliser.balanceOf)

  const inftDeposits = useSelector(state=>state.inft.deposits)
  const nftliserDeposits = useSelector(state=>state.nftliser.deposits)

  const inftSupply = useSelector(state=>state.inft.supply)
  const nftliserSupply = useSelector(state=>state.nftliser.supply)

  const owner = useSelector(state=>state.inft.owner)

  const withdrawHandler = async(e) => {
    e.preventDefault()

    withdraw(provider, nftliser, inft)

    console.log("withdrawHandler...")
  }
    
  return(

    <div className='my-4 text-center'>
      <h1 className='my-4 text-center'>Intelligent NFTs </h1>
      
      <p> Which type of NFT would you like to create? </p>
      <p >
        { account == owner ? (
            <button id="BtnColor" type="button" onClick={withdrawHandler}> Withdraw </button>
          ) : (
            " "
          )}
        </p>
      <p> <strong>Total number of NFTs minted :</strong> {inftSupply + nftliserSupply} </p>
      
      <>
      
        <Row>
          {/* 1st Row Column leftside */} 

          <Col>

          <p>
          { account == owner ? (
            <p><strong>Deposits:</strong> {inftDeposits} ETH </p>
          ) : (
            " "
          )}    
          </p> 

          <h3 >AiNFT</h3>  
          <p>
          <Link to="/Mint">
          <img src={preview2} className="AiNFT-Link" width='100%' height = '100%' />
          </Link> 
          </p>

          </Col>
          {/* 1st Row Column rightside */}

          <Col>

          <p>
          
          { account == owner ? (
            <p><strong>Deposits:</strong> {nftliserDeposits} ETH </p>
          ) : (
            " "
          )}    
          </p> 

          <h3 >NFTliser</h3>  
          <p>
          <Link to="/Mint2">
          <img src={preview} className="NFTliser-Link" width='100%' height = '100%'/>

          </Link>
          </p>
          
          </Col>
        </Row>

        <Row>
          {/* 2nd Row Column leftside */}

          <Col>
              <p><strong>Cost to Mint:</strong> {inftCost} ETH</p>
              <p><strong>You own:</strong> {inftBalance}</p> 
              <p> <strong>Total Number of AiNFT mints :</strong> {inftSupply}</p>                  
          </Col>
          {/* 2nd Row Column rightside */}

          <Col>            
              <p><strong>Cost to Mint:</strong> {nftliserCost} ETH</p>
              <p><strong>You own:</strong> {nftliserBalance}</p>   
              <p> <strong>Total Number of NFTlised Uploads :</strong> {nftliserSupply}</p>   
          </Col> 

        </Row>
        
      </>
      
    </div>  

  )
}

export default Homepage;
