import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown, FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { newJob, viewJob } from 'actions/jobActions';
import { logout } from 'actions/currentUserActions';
import JobFilter from 'components/JobFilter';

function mapStateToProps(state){
  return{
    refreshJobsList: state.refreshControls.refreshJobsList,
    role: state.currentUser.role
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, newJob, viewJob, logout}, dispatch)
}

class JobsPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      jobs: [],
      jobFilter: {
        name: '',
        jobNumber: '',
        statuses: [],
        startDate: '',
        endDate: '',
        attendeeIds: [],
        creatorIds: []
      },
      applyFilter: false,
      applyFilterChanged: false,
      page: 1,
      totalPages: 1,
      sortBy: 'id',
      sortMethod: 'desc'
    };
  }

  componentDidMount(){
    this.getJobs(this.state.page, this.state.sortBy, this.state.sortMethod);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.refreshJobsList != prevProps.refreshJobsList || (this.state.applyFilterChanged != prevState.applyFilterChanged && (this.state.applyFilter == true || this.state.applyFilter != prevState.applyFilter))){
      this.getJobs(this.state.page, this.state.sortBy, this.state.sortMethod);
    }
  }

  getQueryString(){
    let queryString = '';
    if (this.state.applyFilter){
      if (this.state.jobFilter.name != ''){
        queryString += '&name='+this.state.jobFilter.name;
      }
      if (this.state.jobFilter.jobNumber != ''){
        queryString += '&job_number='+this.state.jobFilter.jobNumber;
      }
      for(let i=0;i<this.state.jobFilter.statuses.length;i++){
        queryString += '&statuses[]='+this.state.jobFilter.statuses[i];
      }
      if (this.state.jobFilter.startDate != ''){
        queryString += '&start_date='+this.state.jobFilter.startDate;
      }
      if (this.state.jobFilter.endDate != ''){
        queryString += '&end_date='+this.state.jobFilter.endDate;
      }
      for(let i=0;i<this.state.jobFilter.attendeeIds.length;i++){
        queryString += '&attendee_ids[]='+this.state.jobFilter.attendeeIds[i];
      }
      for(let i=0;i<this.state.jobFilter.creatorIds.length;i++){
        queryString += '&creator_ids[]='+this.state.jobFilter.creatorIds[i];
      }
    }
    return queryString;
  }

  getJobs(page, sortBy, sortMethod){
    let url = '/api/v1/jobs?page='+page+'&sort_by='+sortBy+'&sort_method='+sortMethod+this.getQueryString();
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
        page: page,
        totalPages: response.data.total_pages,
        sortBy: sortBy,
        sortMethod: sortMethod
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

  handleSortClick(nextSortBy){
    let nextSortMethod = 'asc';
    if(nextSortBy == this.state.sortBy){
      nextSortMethod = this.state.sortMethod == 'asc' ? 'desc' : 'asc';
    }
    this.getJobs(this.state.page, nextSortBy, nextSortMethod)
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

  filterButtonVariant(){
    if (this.state.applyFilter && (this.state.jobFilter.name != '' || this.state.jobFilter.jobNumber != '' || this.state.jobFilter.statuses.length > 0 || this.state.jobFilter.startDate != '' || this.state.jobFilter.endDate != '' || this.state.jobFilter.attendeeIds.length > 0 || this.state.jobFilter.creatorIds.length > 0)){
      return 'success';
    } else {
      return 'secondary';
    }
  }

  handleJobFilterChange(jobFilter, applyFilter, applyFilterChanged){
    this.setState({
      jobFilter: jobFilter,
      applyFilter: applyFilter,
      applyFilterChanged: applyFilterChanged
    })
  }

  handlePageChange(e){
    let currentPage = e.selected + 1;
    this.getJobs(currentPage, this.state.sortBy, this.state.sortMethod);
  }

  render() {
    return(
      <div className='page-main-content jobs-page'>
        <div className='page-content-header jobs-header'>
          <JobFilter jobFilter={this.state.jobFilter} applyFilter={this.state.applyFilter} applyFilterChanged={this.state.applyFilterChanged} handleJobFilterChange={(jobFilter, applyFilter, applyFilterChanged)=>this.handleJobFilterChange(jobFilter, applyFilter, applyFilterChanged)} filterButtonVariant={this.filterButtonVariant()} />
          {this.props.role == 'admin' &&
            <Button variant="info" onClick={() => this.props.newJob()}>
              Create New Job
            </Button>
          }
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
            {this.state.jobs.map(job =>
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
        {this.state.totalPages > 1 &&
          <ReactPaginate pageCount={this.state.totalPages}
                         PageRangeDisplayed={3}
                         marginPagesDisplayed={1}
                         forcePage={this.state.page-1}
                         disableInitialCallback={true}
                         containerClassName='table-pagination'
                         pageClassName='page'
                         pageLinkClassName=''
                         activeClassName='current-page'
                         activeLinkClassName=''
                         previousClassName='hide'
                         nextClassName='hide'
                         breakClassName=''
                         breakLinkClassName=''
                         onPageChange={e=>this.handlePageChange(e)}
          />
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsPage);