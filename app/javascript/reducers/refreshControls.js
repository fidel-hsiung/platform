import initialState from 'reducers/initialState';
import {
  SET_CALENDAR_DATES,
  SET_JOBS_DATE,
  CHECK_JOB_REFRESH
} from '../constants/actionTypes';

export default (state = initialState.refreshControls, action) => {
  switch (action.type) {
    case SET_CALENDAR_DATES:
      return{
        ...state,
        calendarStartDay: new Date(action.payload.start_date),
        calendarEndDay: new Date(action.payload.end_date)
      }
    case SET_JOBS_DATE:
      return{
        ...state,
        jobsDay: new Date(action.payload)
      }
    case CHECK_JOB_REFRESH:
      let jobStartDate = new Date(action.payload.start_date);
      let jobEndDate = new Date(action.payload.end_date);
      let jobPending = action.payload.status == 'pending';
      let refreshCalendar = state.refreshCalendar;
      let refreshDayJobsList = state.refreshDayJobsList;
      let refreshJobsList = !state.refreshJobsList;

      if (state.calendarStartDay && state.calendarEndDay && !jobPending) {
        if (jobStartDate <= state.calendarEndDay && jobEndDate >= state.calendarStartDay) {
          refreshCalendar = !refreshCalendar;
        }
      }
      if (state.jobsDay && !jobPending) {
        if (state.jobsDay >= jobStartDate && state.jobsDay <= jobEndDate) {
          refreshDayJobsList = !refreshDayJobsList
        }
      }

      return {
        ...state,
        refreshCalendar: refreshCalendar,
        refreshDayJobsList: refreshDayJobsList,
        refreshJobsList: refreshJobsList
      }
    default:
      return state;
  }
};