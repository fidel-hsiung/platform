import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from 'actions/currentUserActions';
import LoadingPage from 'components/LoadingPage';

export default function VerifyToken(props) {

  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    console.log(props.authToken);
    fetch('/api/v1/user-info', {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': props.authToken
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.error) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        setRedirect(true)
      } else {
        dispatch(login(data.attributes))
      }
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  }, [])

  if (redirect) {  
    return(
      <Redirect to="/login" />
    );
  } else {    
    return (
      <LoadingPage />
    );
  }
}