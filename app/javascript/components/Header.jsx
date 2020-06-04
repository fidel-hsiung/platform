import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Image } from 'react-bootstrap';
import { BsBoxArrowRight } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from 'actions/currentUserActions';

export default function App(props) {

  const currentUser = useSelector(state => state.currentUser);
  const dispatch = useDispatch();
  const history = useHistory();

  return(
    <Navbar className="header" bg="dark" variant="dark">
      <Navbar.Brand><div className='platform-title' onClick={()=>history.push('/')}>Platform</div></Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className='justify-content-end'>
        <Navbar.Text className='font-italic mr-5'>
          <Link to={'/users/'+currentUser.id}>
            <u>
              Hello, {currentUser.first_name} {currentUser.last_name}
            </u>
          </Link>
          <img className={'header-avatar'} src={currentUser.avatar_url}></img>
        </Navbar.Text>
        <BsBoxArrowRight size={28} color={'white'} style={{cursor: 'pointer'}} onClick={()=>dispatch(logout())} />
      </Navbar.Collapse>
    </Navbar>
  );
}