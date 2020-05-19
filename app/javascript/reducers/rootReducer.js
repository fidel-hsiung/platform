import { combineReducers } from 'redux';
import currentUser from 'reducers/currentUser';
import modalBox from 'reducers/modalBox';
import refreshCalendar from 'reducers/refreshCalendar';

export default combineReducers({
  currentUser,
  modalBox,
  refreshCalendar
});