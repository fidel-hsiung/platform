import {
  LOGIN,
  UPDATE_AVATAR,
} from '../constants/actionTypes';

export const login = payload => ({
    type: 'LOGIN',
    payload
});