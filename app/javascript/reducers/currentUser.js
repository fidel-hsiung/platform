import initialState from 'reducers/initialState';
import {
  LOGIN,
  UPDATE_AVATAR
} from '../constants/actionTypes';

export default (state = initialState.currentUser, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case UPDATE_AVATAR:
      return {
        ...state,
        avatar: action.payload
      }
    default:
      return state;
  }
};