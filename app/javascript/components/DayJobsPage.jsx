import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Form } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown, FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import moment from 'moment';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { viewJob } from 'actions/jobActions';
import { logout } from 'actions/currentUserActions';
import { setJobsDate } from 'actions/refreshControlsActions';
import { getDayFromHashParameter } from 'middlewares/custom';
import LoadingPage from 'components/LoadingPage';

function mapStateToProps(state){
  return{
    refreshDayJobsList: state.refreshControls.refreshDayJobsList,
    currentUserId: state.currentUser.id
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, viewJob, logout, setJobsDate}, dispatch)
}

class DayJobsPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      day: getDayFromHashParameter(this.props.location.hash),
      jobs: null,
      sortBy: 'id',
      sortMethod: 'asc',
      onlyViewMyJobs: false
    };
  }

  componentDidMount(){
    this.getJobs(this.state.day);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.refreshDayJobsList != prevProps.refreshDayJobsList){
      this.getJobs(this.state.day);
    }
  }

  getJobs(day){
    let url = '/api/v1/day-jobs?day='+day;
    fetch(url, {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      }
    })
    .then(processResponse)
    .then(response => {
      this.setState({
        jobs: response.data.jobs,
        day: response.data.day
      });
      this.props.setJobsDate(response.data.day);
      if (this.props.location.hash != ('#'+response.data.day)){
        window.history.pushState(null, null, '#'+response.data.day)
      }
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
    if (this.state.onlyViewMyJobs) {
      let currentUserId = this.props.currentUserId;
      return this.state.jobs.filter(job => {
        return job.user_ids.indexOf(currentUserId) != -1
      })
    } else {
      return this.state.jobs;
    }
  }

  sortedJobs(){
    let tempSortMethod = this.state.sortMethod == 'asc' ? 1 : -1;
    let tempSortBy = this.state.sortBy;
    return this.filteredJobs().sort(function(a,b){
      let temp = (a[tempSortBy] > b[tempSortBy]) ? 1 : (a[tempSortBy] < b[tempSortBy]) ? -1 : 0
      return temp*tempSortMethod;
    });
  }

  handleSortClick(nextSortBy){
    if(nextSortBy == this.state.sortBy){
      let nextSortMethod = this.state.sortMethod == 'asc' ? 'desc' : 'asc';
      this.setState({sortMethod: nextSortMethod});
    } else {
      this.setState({sortBy: nextSortBy, sortMethod: 'asc'});
    }
  }

  sortIcon(name){
    if (name == this.state.sortBy){
      if (this.state.sortMethod == 'asc') {
        return <FaSortUp />
      } else {
        return <FaSortDown />
      }
    } else {
      return <FaSort />
    }
  }

  handleOnlyViewMyJobsChange(e){
    let onlyViewMyJobs = e.target.checked;
    this.setState({onlyViewMyJobs: onlyViewMyJobs});
  }

  goToPreviousDay(){
    this.getJobs(moment(this.state.day).subtract(1, 'day').format('YYYY-MM-DD'));
  }

  goToNextDay(){
    this.getJobs(moment(this.state.day).add(1, 'day').format('YYYY-MM-DD'));
  }

  render() {
    if (this.state.jobs){
      return(
        <div className='page-main-content day-page'>
          <div className='page-content-header day-header'>
            <div className='day-tool-box'>
              <FaCaretLeft style={{cursor: 'pointer'}} onClick={()=>this.goToPreviousDay()} />
              <div className={'label-date'}>{this.state.day}</div>
              <FaCaretRight style={{cursor: 'pointer'}} onClick={()=>this.goToNextDay()} />
            </div>
            <Form.Check className='text-secondary' id='my-jobs' inline label='Only view my jobs' onChange={e=>this.handleOnlyViewMyJobsChange(e)} checked={this.state.onlyViewMyJobs} />
          </div>
          <Table responsive bordered hover className='job-table'>
            <thead>
              <tr>
                <th>
                  <a onClick={()=>this.handleSortClick('name')}>
                    Job Name
                    {this.sortIcon('name')}
                  </a>
                </th>
                <th>
                  <a onClick={()=>this.handleSortClick('job_number')}>
                    Job Number
                    {this.sortIcon('job_number')}
                  </a>
                </th>
                <th>
                  <a onClick={()=>this.handleSortClick('status')}>
                    Job status
                    {this.sortIcon('status')}
                  </a>
                </th>
                <th>
                  <a onClick={()=>this.handleSortClick('start_date')}>
                    Job Date Range
                    {this.sortIcon('start_date')}
                  </a>
                </th>
                <th>
                  <a onClick={()=>this.handleSortClick('users_count')}>
                    Job Attendees
                    {this.sortIcon('users_count')}
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.sortedJobs().map(job =>
                <tr key={job.id} onClick={()=>this.props.viewJob(job.id)} >
                  <td>{job.name}</td>
                  <td>{job.job_number}</td>
                  <td>{job.status}</td>
                  <td>{job.start_date + ' to ' + job.end_date}</td>
                  <td className='attendees-td'>
                    {job.users.map(user =>
                      <img key={user.id} className="avatar small" title={user.full_name} src={user.avatar_url}></img>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      );
    } else {
      return <LoadingPage />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayJobsPage);