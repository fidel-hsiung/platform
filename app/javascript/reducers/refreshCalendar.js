import initialState from 'reducers/initialState';
import {
  REFRESH_CALENDAR
} from '../constants/actionTypes';

export default (state = initialState.refreshCalendar, action) => {
  switch (action.type) {
    case REFRESH_CALENDAR:
      return !state;
    default:
      return state;
  }
};