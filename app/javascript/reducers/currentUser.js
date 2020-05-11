import initialState from 'reducers/initialState';
import {
  LOGIN,
  LOGOUT,
  UPDATE_AVATAR,
} from '../constants/actionTypes';

export default (state = initialState.currentUser, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case LOGOUT:
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      return {
        first_name:    null,
        last_name:     null,
        email:         null,
        avatar:        null,
        role:          null
      };
    case UPDATE_AVATAR:
      return {
        ...state,
        avatar: action.payload
      };
    default:
      return state;
  }
};