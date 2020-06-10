import React from 'react';
import { Provider } from 'react-redux';
import store from 'store/configureStore';
import { BrowserRouter } from 'react-router-dom';
import ModalBox from 'components/ModalBox';
import Main from 'components/Main';

export default function App(props) {

  return(
  	<Provider store={store} >
      <ModalBox />
	    <BrowserRouter>
        <Main />
	    </BrowserRouter>
	   </Provider>
  );
}