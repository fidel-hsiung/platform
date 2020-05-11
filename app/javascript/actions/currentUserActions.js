import {
  LOGIN,
  LOGOUT,
  UPDATE_AVATAR,
} from '../constants/actionTypes';

export const login = payload => ({
    type: 'LOGIN',
    payload
});

export const logout = () => ({
    type: 'LOGOUT'
});