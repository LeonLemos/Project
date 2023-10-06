import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Routes, Route} from 'react-router-dom'
import Countdown from 'react-countdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import preview from '../preview.png';
import Data from './Data';


const Mint2 = ({ provider, inft, cost, setIsLoading }) => {
    const [isWaiting, setIsWaiting] = useState(false)
    const [balance, setBalance] = useState(0)
    const [maxSupply, setMaxSupply] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0)
    const [revealTime, setRevealTime] = useState(0)


  
    const mint2Handler = async (e) =>{
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
    <Form onSubmit={mint2Handler} style={{maxWidth: '450px', margin:'50px auto'}}>
        {isWaiting?(

            <Spinner animation='border' style={{display:'block', margin:'0 auto'}} />

        ):(
            <Form.Group>
                <Row>
                    <Button className='text-center' variant='primary' type='submit' style={{width:'100%'}}>
                       Mint
                    </Button>
                </Row>

                <Row>
                    {/* Column1 leftside */} Choose2
                    <Col>
                        { balance > 0 ? (
                        <div className='text-center'>
                        <img src={`https:gateway.pinata.coud/ipfs/Lorem/${balance.toString()}.png`} alt="Intelligent NFT" width='400px' height = '400px' />
                        </div>
                        ):(
                        <img src={preview} alt=""/>   
                        )}

                    </Col>
                </Row>
                
            </Form.Group>
        )}
        
    </Form>
  )
}

export default Mint2;
