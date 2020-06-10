import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import CalendarPage from 'components/CalendarPage';
import DayJobsPage from 'components/DayJobsPage';
import JobsPage from 'components/JobsPage';
import UsersPage from 'components/UsersPage';
import UserPage from 'components/UserPage';
import UserFormPage from 'components/UserFormPage';
import LoginPage from 'components/LoginPage';
import Header from 'components/Header';
import LeftSideNav from 'components/LeftSideNav';
import VerifyToken from 'components/VerifyToken';
import JobModal from 'components/JobModal';
import JobView from 'components/JobView';
import actionCable from 'actioncable';
import { useDispatch } from 'react-redux';
import { checkJobRefresh, refreshUsersCollection } from 'actions/refreshControlsActions';

const CableApp = {}

export default function Main(props) {

  const currentUserId = useSelector(state => state.currentUser.id);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(()=>{
    if (currentUserId) {
      CableApp.cable = actionCable.createConsumer('/cable?token=' + localStorage.getItem('authToken'));
      CableApp.users = CableApp.cable.subscriptions.create({channel: "UsersChannel"}, {
        received: (data) => {
          console.log('receving user channel');
          dispatch(refreshUsersCollection());
        }
      });
      CableApp.jobs = CableApp.cable.subscriptions.create({channel: "JobsChannel"}, {
        received: (data) => {
          console.log('receving job channel');
          if (data.user_id != currentUserId){
            dispatch(checkJobRefresh(data.job));
          }
        }
      });
    }
  }, [currentUserId]);

  if (currentUserId) {
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
            <Route path="/users/:id/edit" component={UserFormPage} />
            <Route path="/users/new" component={UserFormPage} />
            <Route path="/users/:id" component={UserPage} />
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