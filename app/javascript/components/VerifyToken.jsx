import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from 'actions/currentUserActions';
import LoadingPage from 'components/LoadingPage';
import { processResponse } from 'middlewares/custom';

export default function VerifyToken(props) {

  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    fetch('/api/v1/user-info', {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      }
    })
    .then(processResponse)
    .then(response => {
      dispatch(login(response.data));
    })
    .catch(response => {
      console.log('test');
      localStorage.removeItem('authToken');
      setRedirect(true)
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