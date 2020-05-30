import initialState from 'reducers/initialState';
import {
  SET_CALENDAR_DATES,
  CHECK_JOB_REFRESH
} from '../constants/actionTypes';

export default (state = initialState.refreshControls, action) => {
  switch (action.type) {
    case SET_CALENDAR_DATES:
      return{
        ...state,
        calendar_start_day: new Date(action.payload.start_date),
        calendar_end_day: new Date(action.payload.end_date)
      }
    case CHECK_JOB_REFRESH:
      let refreshCalendar = state.refreshCalendar;
      if (state.calendar_start_day && state.calendar_end_day) {
        let start_date = new Date(action.payload.start_date);
        let end_date = new Date(action.payload.end_date);
        if (start_date <= state.calendar_end_day && end_date >= state.calendar_start_day) {
          refreshCalendar = !refreshCalendar;
        }
      }

      return {
        ...state,
        refreshCalendar: refreshCalendar,
      }
    default:
      return state;
  }
};