import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { openModalBox } from 'actions/modalBoxActions';
import { login } from 'actions/currentUserActions';
import { processResponse } from 'middlewares/custom';

export default function FormExample(props) {

  const dispatch = useDispatch();

  const [user, setUser] = useState({email: '', password: ''});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const data = {email: email, password: password, remember_me: rememberMe};

    fetch('/api/v1/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(processResponse)
    .then(response => {
      localStorage.setItem('authToken', response.data.auth_token);
      dispatch(login(response.data.user))
    })
    .catch(response => {
      dispatch(openModalBox('Login failed', response.data.error.join(',')));
      setPassword('');
    });
  }

  return (
    <React.Fragment>
      <Form noValidate onSubmit={handleSubmit} >
        <Form.Group>
          <Form.Control
            name='email'
            type='email'
            placeholder='Email'
            onChange={e=>setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            name='password'
            type='password'
            placeholder='Password'
            onChange={e=>setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>
        <Form.Check
          name="rememberMe"
          label="Remember me"
          onChange={e=>setRememberMe(e.target.checked)}
          checked={rememberMe}
        />
        <Button type='submit' className={'btn-primary btn-block mt-3'} disabled={email == '' || password == ''} >Login</Button>
      </Form>
    </React.Fragment>
  );
}
