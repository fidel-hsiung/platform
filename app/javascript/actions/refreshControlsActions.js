import {
	SET_CALENDAR_DATES,
  SET_JOBS_DATE,
  CHECK_JOB_REFRESH,
  REFRESH_USERS_COLLECTION
} from '../constants/actionTypes';

export const setCalendarDates = (payload) => {
	return {type: SET_CALENDAR_DATES, payload};
}

export const setJobsDate = (payload) => {
  return {type: SET_JOBS_DATE, payload};
}

export const checkJobRefresh = (payload) => {
  return {type: CHECK_JOB_REFRESH, payload};
};

export const refreshUsersCollection = () => {
  return {type: REFRESH_USERS_COLLECTION};
}