import {
  REFRESH_USERS_COLLECTION,
} from '../constants/actionTypes';

export const refreshUsersCollection = () => {
  return {type: REFRESH_USERS_COLLECTION};
}