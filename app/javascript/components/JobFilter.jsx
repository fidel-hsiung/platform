import React from 'react';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { FormInput, FilterFormMultiSelect, FilterFormDateRange } from 'components/CustomFormComponents';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, logout}, dispatch)
}

const emptyJobFilter = {
  name: '',
  jobNumber: '',
  statuses: [],
  startDate: '',
  endDate: '',
  attendeeIds: [],
  creatorIds: []
}

class JobFilter extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      jobFilter: {
        name: this.props.jobFilter.name,
        jobNumber: this.props.jobFilter.jobNumber,
        statuses: this.props.jobFilter.statuses,
        startDate: this.props.jobFilter.startDate,
        endDate: this.props.jobFilter.endDate,
        attendeeIds: this.props.jobFilter.attendeeIds,
        creatorIds: this.props.jobFilter.creatorIds
      },
      filterShow: false,
      users: []
    };
  }

  componentDidMount(){
    fetch('/api/v1/users-collection', {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      }
    })
    .then(processResponse)
    .then(response => {
      this.setState({
        users: response.data.users
      });
    })
    .catch(response => {
      if (response.status == 401){
        localStorage.removeItem('authToken');
        this.props.logout();
      }
      this.props.openModalBox('Error', response.data.error.join(','));
    });
  }

  toggleFilter(){
    let filterShow = !this.state.filterShow;
    this.setState({filterShow: filterShow});
  }

  handleSubmit(e){
    e.preventDefault();
    e.stopPropagation();

    if (this.state.jobFilter.name != '' || this.state.jobFilter.jobNumber != '' || this.state.jobFilter.statuses.length > 0 || this.state.jobFilter.startDate != '' || this.state.jobFilter.endDate != '' || this.state.jobFilter.attendeeIds.length > 0 || this.state.jobFilter.creatorIds.length > 0) {
      this.setState({filterShow: false});
      this.props.handleJobFilterChange(this.state.jobFilter, true, !this.props.applyFilterChanged);
    }
  }

  handleJobFilterInputChange(value, name){
    let jobFilter = this.state.jobFilter;
    jobFilter[name] = value;
    this.setState({jobFilter: jobFilter});
  }

  clearFilter(){
    let jobFilter = Object.assign({}, emptyJobFilter);
    this.setState({
      jobFilter: jobFilter,
      filterShow: false
    });
    let applyFilterChanged = this.props.applyFilter ? !this.props.applyFilterChanged : this.props.applyFilterChanged;
    this.props.handleJobFilterChange(jobFilter, false, applyFilterChanged);
  }

  handleToggle(isOpen, e, metadata){
    this.setState({filterShow: isOpen});
  }

  render(){
    return(
      <Dropdown className='job-filter' show={this.state.filterShow} onToggle={(isOpen, e, metadata)=>this.handleToggle(isOpen, e, metadata)} >
        <Dropdown.Toggle variant={this.props.filterButtonVariant} onClick={()=>this.toggleFilter()}>
          Job Filter
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Form noValidate onSubmit={e=>this.handleSubmit(e)} >
            <FormInput name='name' label='Name' placeholder='Job name' value={this.state.jobFilter.name} handleChange={value=>this.handleJobFilterInputChange(value, 'name')} />
            <FormInput name='jobNumber' label='Job Number' placeholder='Job number' value={this.state.jobFilter.jobNumber} handleChange={value=>this.handleJobFilterInputChange(value, 'jobNumber')} />
            <FilterFormMultiSelect name='statuses' label='Status' placeholder='Select status' value={this.state.jobFilter.statuses} options={[{value: 'pending', label: 'Pending'}, {value: 'active', label: 'Active'}, {value: 'finished', label: 'Finished'}, {value: 'failed', label: 'Failed'}]} handleChange={value=>this.handleJobFilterInputChange(value, 'statuses')} />
            <FilterFormDateRange startDate={this.state.jobFilter.startDate} endDate={this.state.jobFilter.endDate} handleStartDateChange={value=>this.handleJobFilterInputChange(value, 'startDate')} handleEndDateChange={value=>this.handleJobFilterInputChange(value, 'endDate')} />
            <FilterFormMultiSelect name='attendeeIds' label='Attendees' placeholder='Select Attendees' value={this.state.jobFilter.attendeeIds} options={this.state.users.map(user => {return {value: user.id, label: user.full_name}})} handleChange={value=>this.handleJobFilterInputChange(value, 'attendeeIds')} />
            <FilterFormMultiSelect name='creatorIds' label='Creators' placeholder='Select Creators' value={this.state.jobFilter.creatorIds} options={this.state.users.filter(user=>{return user.role == 'admin'}).map(user => {return {value: user.id, label: user.full_name}})} handleChange={value=>this.handleJobFilterInputChange(value, 'creatorIds')} />
            <div className='d-flex justify-content-end'>
              <Button type='submit' className='mr-2' >Apply Filter</Button>
              <Button variant='secondary' onClick={()=>this.clearFilter()} >Clear</Button>
            </div>
          </Form>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default connect(null, mapDispatchToProps)(JobFilter);