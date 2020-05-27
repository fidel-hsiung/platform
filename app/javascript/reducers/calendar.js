import initialState from 'reducers/initialState';
import {
	SET_CALENDAR_DATES,
  REFRESH_CALENDAR,
  CHECK_REFRESH_CALENDAR
} from '../constants/actionTypes';

export default (state = initialState.calendar, action) => {
  switch (action.type) {
  	case SET_CALENDAR_DATES:
  	  return{
  	  	...state,
  	  	calendar_start_day: new Date(action.payload.start_date),
  	  	calendar_end_day: new Date(action.payload.end_date)
  	  }
    case REFRESH_CALENDAR:
      return {
        ...state,
        refreshCalendar: !state.refreshCalendar,
      }
    case CHECK_REFRESH_CALENDAR:
      let refresh = state.refreshCalendar;
      if (state.calendar_start_day && state.calendar_end_day) {
      	if (action.payload.start_date <= state.calendar_end_day && action.payload.end_date >= state.calendar_start_day) {
      		refresh = !refresh;
      	}
      }
      return {
        ...state,
        refreshCalendar: refresh,
      }
    default:
      return state;
  }
};