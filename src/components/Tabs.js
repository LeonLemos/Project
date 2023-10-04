import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

const Tabs = () => {
    return(
        <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-4'>
            <LinkContainer to="/mint">
            <Nav.Link>Mint</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/mint2">
            <Nav.Link>Mint2</Nav.Link>
            </LinkContainer>
        </Nav>
    );  
}

export default Tabs;
