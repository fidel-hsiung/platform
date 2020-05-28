import initialState from 'reducers/initialState';
import {
  REFRESH_USERS_COLLECTION,
} from '../constants/actionTypes';

export default (state = initialState.user, action) => {
  switch (action.type) {
    case REFRESH_USERS_COLLECTION:
      return{
        ...state,
        refreshUsersCollection: !state.refreshUsersCollection
      }
    default:
      return state;
  }
};