import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'
import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux';
import Blockies from 'react-blockies';
import Button from 'react-bootstrap/Button';
import { loadAccount, loadInftBalance, loadNFTliserBalance } from '../store/interactions';
import Form  from 'react-bootstrap/Form';

import logo from '../logo.png';

// Config: Import your network config here
import config from '../config.json';

const Navigation = () => {
  const chainId = useSelector(state=>state.provider.chainId)
  const account = useSelector(state=>state.provider.account)
  const inft = useSelector(state=>state.inft.contract)
  const nftliser = useSelector(state=>state.nftliser.contract)

  const dispatch = useDispatch()

  const connectHandler = async () =>{
    //Fetch account
    const account = window.ethereum.on('accountsChanged', async()=>{
      await loadAccount(dispatch)
    })
    
    // Fetch Balances
    await loadInftBalance(inft, account, dispatch)
    await loadNFTliserBalance (nftliser, account, dispatch)
  }

  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: e.target.value }],
    })
  }

  return (
    <Navbar className='my-3' >
      <Link to="/">
      <img className="NavLogo"
        alt="logo"
        src={logo}
        width="110"
        height="110"
      />
      </Link>
      
      <Navbar.Brand style={{color: 'white',  }} 
      href="/"><strong>iNFT</strong></Navbar.Brand>
      <Navbar.Toggle aria-controls='nav' />
      <Navbar.Collapse id='nav'className="justify-content-end">

        <div className='d-flex justify-content-end mt-3'>
          <Form.Select
          aria-label="Network Selector"
          value={config[chainId] ? `0x${chainId.toString(16)}`:`0`}
          onChange={networkHandler}
          style={{ maxWidth: '200px', marginRight: '20px', marginBottom:'14px' }}
        >
          <option value="0" disabled>Select Network</option>
          <option value="0x7A69">Localhost</option>
          <option value="0x5">Goerli</option>
          <option value="0x5">Sepolia</option>
          </Form.Select>
          
          { account ? (
            <Navbar.Text className='d-flex align-items-center'style={{color: 'white'  }}>
              <strong> {account.slice(0,5)+'...'+ account.slice(38,42)} </strong> 
              <Blockies seed={account} size={10} scale={3} color='#2187D0' bgColor='#F1F2F9' spotColor='#767F92' className='identicon mx-2'/>
            </Navbar.Text>
          ) : (
            <Button  type="button" onClick={connectHandler} style={{ maxWidth: '200px', marginRight: '20px', marginBottom:'14px' }}>Connect</Button>
            
            
            
          )}

        </div>
        
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
