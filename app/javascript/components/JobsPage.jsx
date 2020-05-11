import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

moment.updateLocale('en', {
  week: {
    dow: 1,
  }
});

const localizer = momentLocalizer(moment)


export default function JobsPage(props) {

  return(
  	<div className='page-main-content'>
	    <Calendar
	      className='jobs-calendar'
	      localizer={localizer}
	      events={[]}
	      startAccessor="start"
	      endAccessor="end"
	    />
	   </div>
  );
}