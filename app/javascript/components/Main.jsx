import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import JobsPage from 'components/JobsPage';
import LoginPage from 'components/LoginPage';
import Header from 'components/Header';
import LeftSideNav from 'components/LeftSideNav';
import VerifyToken from 'components/VerifyToken';

export default function Main(props) {

  const authenticated = useSelector(state => state.currentUser.email != null);
  const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  if (authenticated) {  
    return(
      <React.Fragment>
        <Header />
        <div className='authenticated-page'>
          <LeftSideNav />
          <Switch>
            <Route exact path="/" component={JobsPage} />
            <Route path="/login" render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </React.Fragment>
    );
  } else {
    if (authToken) {
      return(
        <Switch>
          <Route path="*" render={(props) => <VerifyToken {...props} authToken={authToken} />} />
        </Switch>
      );
    } else {
      return(
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route path="/loading" component={VerifyToken} />
          <Route path="*" render={() => <Redirect to="/login" />} />
        </Switch>
      );
    }
  }
}