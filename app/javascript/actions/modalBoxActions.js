import {
  POPUP,
  CLOSE
} from '../constants/actionTypes';

export const openModalBox = (title, content) => {
  const payload = {
    show: true,
    title: title,
    content: content
  }
  return {type: POPUP, payload};
};

export const closeModalBox = () =>{
  return {type: CLOSE};
};