import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

class TopNav extends React.Component {
    render() {
        return (
            <Navbar bg={'dark'} variant={'dark'} style={{marginBottom: 40}}>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer exact to={'/'}>
                            <Nav.Link>
                                Dashboard
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to={'/scan'}>
                            <Nav.Link>
                                New scan
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to={'/my_scans'}>
                            <Nav.Link>
                                My scans
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default TopNav;
