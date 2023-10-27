import Navbar from 'react-bootstrap/Navbar';
import './Navigation.css';

import logo from '../logo.png';

const Navigation = ({ account }) => {
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
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text style={{color: 'white',  }}>
          <strong> {account} </strong> 
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
