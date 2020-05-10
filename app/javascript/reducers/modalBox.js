import initialState from 'reducers/initialState';
import {
  POPUP,
  CLOSE
} from '../constants/actionTypes';

export default (state = initialState.modalBox, action) => {
  switch (action.type) {
    case POPUP:
      return action.payload;
    case CLOSE:
      return {
        show: false,
        title: '',
        content: ''
      }
    default:
      return state;
  }
};