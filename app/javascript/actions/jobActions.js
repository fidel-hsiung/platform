import {
  NEW_JOB,
  VIEW_JOB,
  EDIT_JOB,
  CLOSE_JOB_MODAL
} from '../constants/actionTypes';

export const newJob = () => {
  return {type: NEW_JOB};
};

export const viewJob = (payload) => {
	return {type: VIEW_JOB, payload};
}

export const editJob = (payload) =>{
  return {type: EDIT_JOB, payload};
};

export const closeJobModal = () => {
  return {type: CLOSE_JOB_MODAL};
};
