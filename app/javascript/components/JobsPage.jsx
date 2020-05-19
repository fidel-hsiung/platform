import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { processResponse } from 'middlewares/custom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';

function mapStateToProps(state){
  return{
    refreshCalendar: state.refreshCalendar,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, logout}, dispatch)
}

moment.updateLocale('en', {
  week: {
    dow: 1,
  }
});

const localizer = momentLocalizer(moment)


class JobsPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      calendarDay: new Date(),
      jobs: [],
      statuses: []
    };
  }

  componentDidMount(){
    this.getCalendarEvents(this.state.calendarDay);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.refreshCalendar != prevProps.refreshCalendar){
      this.getCalendarEvents(this.state.calendarDay);
    }
  }

  getCalendarEvents(date){
  	let url = '/api/v1/calendar-jobs?calendar_day='+moment(date).format('YYYY-MM-DD');
    fetch(url, {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      }
    })
    .then(processResponse)
    .then(response => {
      this.setState({
        calendarDay: date,
        jobs: response.data.jobs
      });
    })
    .catch(response => {
			if (response.status == 401){
        localStorage.removeItem('authToken');
        this.props.logout()
			}
			this.props.openModalBox('Error', response.data.error.join(','));
    });
  }

  filteredJobs(){
    const statuses = this.state.statuses;
    if (statuses.length == 0){
      return this.state.jobs;
    } else{    
      return this.state.jobs.filter(job => {
        return statuses.includes(job.status);
      });
    }
  }

  handleCheckboxClick(e){
    const target = e.target;
    let statuses = this.state.statuses;
    if (target.checked) {
      statuses.push(target.name)
    } else {
      statuses = statuses.filter(status => {return status != target.name})
    }
    this.setState({
      statuses: statuses
    })
  }

  customToolbar(toolbar){
    const goToBack = () => {
      let currentDate = toolbar.date;
      let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      toolbar.onNavigate('prev', newDate);
      this.getCalendarEvents(newDate);
    };

    const goToNext = () => {
      let currentDate = toolbar.date;
      let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
      toolbar.onNavigate('prev', newDate);
      this.getCalendarEvents(newDate);
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span><b>{date.format('MMMM YYYY')}</b></span>
      );
    };

    return (
      <div className={'toolbar-container'}>
        <BsFillCaretLeftFill style={{cursor: 'pointer'}} onClick={goToBack} />
        <div className={'label-date'}>{label()}</div>
        <BsFillCaretRightFill style={{cursor: 'pointer'}} onClick={goToNext} />
      </div>
    );
  }

  eventStyleGetter(event, start, end, isSelected) {
    console.log(event);
    var status = event.status;
    return {
      className: status
    };
  }

	render() {
	  return(
	  	<div className='page-main-content calendar-page'>
        <div className='job-filter'>
          <div className='filter-title'>Job Filter:</div>
          <Form.Check name='active' className='text-danger' inline label='active' onChange={e=>this.handleCheckboxClick(e)} checked={this.state.statuses.includes('active')} />
          <Form.Check name='finished' className='text-success' inline label='finished' onChange={e=>this.handleCheckboxClick(e)} checked={this.state.statuses.includes('finished')} />
          <Form.Check name='failed' className='text-secondary' inline label='failed' onChange={e=>this.handleCheckboxClick(e)} checked={this.state.statuses.includes('failed')} />
        </div>
		    <Calendar
		      className='jobs-calendar'
		      localizer={localizer}
          views={['month']}
		      events={this.filteredJobs()}
		      startAccessor='start_date'
		      endAccessor='end_date'
          titleAccessor='name'
          components={
            {
              toolbar: this.customToolbar.bind(this),
            }
          }
          eventPropGetter={(this.eventStyleGetter)}
		    />
		  </div>
	  );
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsPage);