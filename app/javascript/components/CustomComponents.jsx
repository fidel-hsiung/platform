import React from 'react';
import parse from 'html-react-parser';
import { Row, Col } from 'react-bootstrap';

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

export function InfoGroupAttendees(props) {
  function renderAttendees() {
    return props.users.map(user => {
      return(
        <Col sm='6' key={user.id}>
          <div className="user-name-pane">
            <img className="avatar small" src={user.avatar_url}></img>
            <div className="name">{user.full_name}</div>
          </div>
        </Col>
      );
    })
  }

  return(
    <div className='info-group'>
      <div className='info-label'>
        Attendees
      </div>
      <div className='info-content' >
        <Row>
          {renderAttendees()}
        </Row>
      </div>
    </div>
  );
}

export function UserInfoGroup(props) {
  return(
    <div className='user-info-group'>
      <div className='info-label'>
        {props.label}
      </div>
      <div className='info-content'>
        {props.content}
      </div>
    </div>
  );
}
