import initialState from 'reducers/initialState';
import {
  NEW_JOB,
  VIEW_JOB,
  EDIT_JOB,
  CLOSE_JOB_MODAL
} from '../constants/actionTypes';

export default (state = initialState.job, action) => {
  switch (action.type) {
    case NEW_JOB:
      return {
        ...state,
        jobModalShow: true,
        editJobId: null,
        jobViewShow: false,
        viewJobId: null,
      }
    case VIEW_JOB:
      return {
        ...state,
        jobModalShow: false,
        editJobId: null,
        jobViewShow: true,
        viewJobId: action.payload
      }
    case EDIT_JOB:
      return {
        ...state,
        jobModalShow: true,
        editJobId: action.payload,
        jobViewShow: false,
        viewJobId: null
      }
    case CLOSE_JOB_MODAL:
      return {
        ...state,
        jobModalShow: false,
        editJobId: null,
        jobViewShow: false,
        viewJobId: null
      }
    default:
      return state;
  }
};