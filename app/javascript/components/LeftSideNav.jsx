import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LeftSideNav (props) {

  return(
    <div className='left-side-nav'>
      <NavLink exact activeClassName='active' to='/'>
        Dashboard
      </NavLink>
      <NavLink activeClassName='active' to='/day'>
        Day
      </NavLink>
      <NavLink activeClassName='active' to='/jobs'>
        Jobs
      </NavLink>
      <NavLink activeClassName='active' to='/users'>
        Users
      </NavLink>
    </div>
  );
}