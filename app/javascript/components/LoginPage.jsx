import React from 'react';
import Logo from 'images/logo.png';
import LoginForm from 'components/LoginForm';

export default function App(props) {

  return(
    <div className={'login-page'} >
      <div className={'login-left'} >
        <img className={'logo'} src={Logo}></img>
      </div>

      <div className={'login-right'} >
        <div className={'user-panel'} >
          <div className={'title'} >Log in to Platform</div>
          <LoginForm />
         </div>
      </div>
    </div>
  );
}