import React from 'react';
import parse from 'html-react-parser';

export function InfoGroup(props) {

  return(
    <div className='info-group'>
      <div className='info-label'>
        {props.label}
      </div>
      <div className='info-content'>
        {props.content}
      </div>
    </div>
  );
}

export function InfoGroupRichText(props) {

  return(
    <div className='info-group'>
      <div className='info-label'>
        {props.label}
      </div>
      <div className='info-content richtext-content' >
        {parse(props.content)}
      </div>
    </div>
  );
}