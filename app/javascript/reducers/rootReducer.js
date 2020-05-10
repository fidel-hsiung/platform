import { combineReducers } from 'redux';
import currentUser from 'reducers/currentUser';
import modalBox from 'reducers/modalBox';

export default combineReducers({
  currentUser,
  modalBox
});