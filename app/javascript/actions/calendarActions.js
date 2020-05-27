import {
	SET_CALENDAR_DATES,
  REFRESH_CALENDAR,
  CHECK_REFRESH_CALENDAR
} from '../constants/actionTypes';

export const setCalendarDates = (payload) => {
	return {type: SET_CALENDAR_DATES, payload};
}

export const refreshCalendar = () => {
  return {type: REFRESH_CALENDAR};
};

export const checkRefreshCalendar = (payload) => {
  return {type: CHECK_REFRESH_CALENDAR, payload};
};
