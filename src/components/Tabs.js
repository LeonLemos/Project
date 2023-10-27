import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import './Tabs.css';

const Tabs = () => {
    return(
        <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-4 ' >
            <LinkContainer to="/Mint">
            <Nav.Link><strong>AiNFT</strong></Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/Mint2">
            <Nav.Link><strong>NFTliser</strong></Nav.Link>
            </LinkContainer>
        </Nav>
    );  
}

export default Tabs;
