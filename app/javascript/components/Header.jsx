import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { BsBoxArrowRight } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';

export default function App(props) {

  const currentUser = useSelector(state => state.currentUser);

  return(
    <Navbar fixed="top" bg="dark" variant="dark">
      <Navbar.Brand href="#home">Platform</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className='justify-content-end'>
        <Navbar.Text className='font-italic mr-5'>
          <u>
            Hello, {currentUser.first_name} {currentUser.last_name}
          </u>
        </Navbar.Text>
        <BsBoxArrowRight size={28} color={'white'} style={{cursor: 'pointer'}}/>
      </Navbar.Collapse>
    </Navbar>
  );
}