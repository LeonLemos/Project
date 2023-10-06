import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Routes, Route} from 'react-router-dom'
import Countdown from 'react-countdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'


import preview from '../preview.png';

// Components
import Data from './Data';
import Loading from './Loading';


const Mint = ({ provider, inft, cost, setIsLoading }) => {
    const [isWaiting, setIsWaiting] = useState(false)
    const [revealTime, setRevealTime] = useState(0)
    const [maxSupply, setMaxSupply] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0)
    const [balance, setBalance] = useState(0)
    const isLoading = false
  
    const mintHandler = async (e) =>{
        e.preventDefault()
        setIsWaiting(true)

        try{
            const signer = await provider.getSigner()
            const transaction = await inft.connect(signer).mint(1, {value:cost})
            await transaction.wait()
        } catch {
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }


    const loadBlockchainData = async () => {

    // Fetch Countdown
    const allowMintingOn = await inft.allowMintingOn()
    setRevealTime(allowMintingOn.toString()+'000')
    
    setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading) {
      loadBlockchainData()
        }
    }, [isLoading]);


  return(
    <Form onSubmit={mintHandler} style={{maxWidth: '450px', margin:'50px auto'}}>
        {isWaiting?(

            <Spinner animation='border' style={{display:'block', margin:'0 auto'}} />

        ):(
            <Form.Group>

                <Row>
                {/* Column1 leftside */} Choose1
                <>
<Col>
                <div className='my-4 text-center'>
                <Countdown date ={parseInt(revealTime)} className='h2'/>
                </div>

                <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
                />

                
                
            </Col>
</>

                </Row>

                <Row>
                
                <Button className='text-center' variant='primary' type='submit' style={{width:'100%'}}>
                    Mint
                </Button>

                </Row>
                

            </Form.Group>

        )}


        
    </Form>
    


  )
}

export default Mint;
