import { combineReducers } from 'redux';
import currentUser from 'reducers/currentUser';
import modalBox from 'reducers/modalBox';
import calendar from 'reducers/calendar';
import job from 'reducers/job';
import user from 'reducers/user';

export default combineReducers({
  currentUser,
  modalBox,
  calendar,
  job,
  user
});