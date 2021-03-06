import { combineReducers } from 'redux';
import currentUser from 'reducers/currentUser';
import modalBox from 'reducers/modalBox';
import job from 'reducers/job';
import refreshControls from 'reducers/refreshControls';

export default combineReducers({
  currentUser,
  modalBox,
  job,
  refreshControls
});