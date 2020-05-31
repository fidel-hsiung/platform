import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import CalendarPage from 'components/CalendarPage';
import DayJobsPage from 'components/DayJobsPage';
import JobsPage from 'components/JobsPage';
import UsersPage from 'components/UsersPage';
import LoginPage from 'components/LoginPage';
import Header from 'components/Header';
import LeftSideNav from 'components/LeftSideNav';
import VerifyToken from 'components/VerifyToken';
import JobModal from 'components/JobModal';
import JobView from 'components/JobView';

export default function Main(props) {

  const authenticated = useSelector(state => state.currentUser.email != null);
  const history = useHistory()

  if (authenticated) {
    return(
      <React.Fragment>
        <Header />
        <JobModal />
        <JobView />
        <div className='authenticated-page'>
          <LeftSideNav />
          <Switch>
            <Route exact path="/" render={(props) => <CalendarPage {...props} history={history} />} />
            <Route path="/day" component={DayJobsPage} />
            <Route path="/jobs" component={JobsPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="*" render={() => <Redirect to="/" />} />
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