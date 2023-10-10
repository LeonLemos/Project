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


   


  return(
    <Form onSubmit={mintHandler} style={{maxWidth: '450px', margin:'50px auto'}}>
        {isWaiting?(

            <Spinner animation='border' style={{display:'block', margin:'0 auto'}} />

        ):(
            <Form.Group>

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
