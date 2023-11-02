import Navbar from 'react-bootstrap/Navbar';
import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux';
import Blockies from 'react-blockies';
import Button from 'react-bootstrap/Button';
import { loadAccount, loadInftBalance } from '../store/interactions';
import Form  from 'react-bootstrap/Form';

import logo from '../logo.png';
// Config: Import your network config here
import config from '../config.json';

const Navigation = () => {
  const chainId = useSelector(state=>state.provider.chainId)
  const account = useSelector(state=>state.provider.account)
  const dispatch = useDispatch()

  const connectHandler = async () =>{
    const account = await loadAccount(dispatch)
  }

  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: e.target.value }],
    })
  }

  return (
    <Navbar className='my-3'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand style={{color: 'white',  }} 
      href="/"><strong>iNFT</strong></Navbar.Brand>
      <Navbar.Toggle aria-controls='nav' />
      <Navbar.Collapse id='nav'className="justify-content-end">

        <div className='d-flex justify-content-end '>
          <Form.Select
          aria-label="Network Selector"
          value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
          onChange={networkHandler}
          style={{ maxWidth: '200px', marginRight: '20px' }}
        >
          <option value="0" disabled>Select Network</option>
          <option value="0x7A69">Localhost</option>
          <option value="0x5">Goerli</option>
          </Form.Select>
          
          { account ? (
            <Navbar.Text className='d-flex align-items-center'style={{color: 'white'  }}>
              <strong> {account.slice(0,5)+'...'+account.slice(38,42)} </strong> 
              <Blockies seed={account} size={10} scale={3} color='#2187D0' bgColor='#F1F2F9' spotColor='#767F92' className='identicon mx-2'/>
            </Navbar.Text>
          ) : (
            <Button onClick={connectHandler}>Connect</Button>
          )}

        </div>
        
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
