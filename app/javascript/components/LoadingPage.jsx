import React from 'react';
import Loading from 'images/loading.gif';

export default function VerifyToken(props) {

  return (
    <div className='loading-page'>
      <img className={'loading'} src={Loading}></img>
    </div>
  );
}