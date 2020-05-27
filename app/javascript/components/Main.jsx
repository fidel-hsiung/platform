import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import JobsPage from 'components/JobsPage';
import LoginPage from 'components/LoginPage';
import Header from 'components/Header';
import LeftSideNav from 'components/LeftSideNav';
import VerifyToken from 'components/VerifyToken';
import JobModal from 'components/JobModal';
import JobView from 'components/JobView';

export default function Main(props) {

  const authenticated = useSelector(state => state.currentUser.email != null);

  if (authenticated) {  
    return(
      <React.Fragment>
        <Header />
        <JobModal />
        <JobView />
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
    if (localStorage.getItem('authToken')) {
      return(
        <Switch>
          <Route path="*" component={VerifyToken} />
        </Switch>
      );
    } else {
      return(
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route path="*" render={() => <Redirect to="/login" />} />
        </Switch>
      );
    }
  }
}