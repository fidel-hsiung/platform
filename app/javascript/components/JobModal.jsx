import React from 'react';
import { Form, Modal, Button, Row, Col } from 'react-bootstrap';
import { FormInput, FormSelect, FormAddress, FormDatePicker, FormAttendeesSelect, FormRichTextInput } from 'components/CustomFormComponents';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeJobModal } from 'actions/jobActions';
import { openModalBox } from 'actions/modalBoxActions';
import { checkJobRefresh } from 'actions/refreshControlsActions';
import { processResponse } from 'middlewares/custom';
import LoadingPage from 'components/LoadingPage';

function mapStateToProps(state){
  return{
    show: state.job.jobModalShow,
    jobId: state.job.editJobId,
    refreshUsersCollection: state.refreshControls.refreshUsersCollection
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({closeJobModal, openModalBox, checkJobRefresh}, dispatch)
}

const emptyJob = {
  id: null,
  name: '',
  status: '',
  job_number: '',
  location: '',
  start_date: '',
  end_date: '',
  user_ids: [],
  body: '',
  user_jobs_attributes: [],
  errors: {}
}

class JobModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      job: Object.assign({}, emptyJob),
      users: []
    };
  }

  componentDidMount(){
    this.getUsers();
  }

  componentDidUpdate(prevProps){
    if (this.props.jobId != prevProps.jobId){
      if (this.props.jobId == null){
        this.setState({job: Object.assign({}, emptyJob)});
      } else {
        this.getJob()
      }
    }

    if (!this.props.show) {
      if (this.props.refreshUsersCollection != prevProps.refreshUsersCollection) {
        this.getUsers();
      }
    }
  }

  getJob(){
    const url = '/api/v1/jobs/' + this.props.jobId + '/edit';
    fetch(url, {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      }
    })
    .then(processResponse)
    .then(response => {
      this.setState({
        job: response.data
      })
    })
    .catch(response => {
      if (response.status == 401){
        localStorage.removeItem('authToken');
        this.props.logout();
      }
      this.props.openModalBox('Error', response.data.error.join(','));
    });
  }

  getUsers(){
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
      })
    })
    .catch(response => {
      if (response.status == 401){
        localStorage.removeItem('authToken');
        this.props.logout();
      }
      this.props.openModalBox('Error', response.data.error.join(','));
    });
  }

  handleInputChange(value, name){
    let job = this.state.job;
    job[name] = value;
    this.setState({job: job});
  }

  handleDateChange(e, name){
    let job = this.state.job;
    let res = e == null ? '' : moment(e).format('YYYY-MM-DD');
    job[name] = res;
    this.setState({job: job});
  }

  handleAttendeesChange(e){
    let job = this.state.job;
    let temp_res = [];
    if (e){
      temp_res = e.map(user => user.id);
    }
    job.user_ids = temp_res;
    let temp_user_jobs_attributes = job.user_jobs_attributes;
    temp_user_jobs_attributes.map(temp_user_job => {
      if (temp_res.indexOf(temp_user_job.user_id) == -1){
        temp_user_job._destroy = true;
      }
    });
    temp_res.map(user_id => {
      if (!temp_user_jobs_attributes.some(obj => obj.user_id == user_id && obj._destroy == false)) {
        let temp_user = this.state.users.find(function(u){return u.id == user_id});
        temp_user_jobs_attributes.push({
          id: null,
          user_id: temp_user.id,
          user_avatar_url: temp_user.avatar_url,
          user_full_name: temp_user.full_name,
          errors: {},
          _destroy: false
        });
      }
    });
    job.user_jobs_attributes = temp_user_jobs_attributes;
    this.setState({job: job});
  }

  handleRemoveUser(user_id){
    let job = this.state.job;
    let temp_user_ids = job.user_ids;
    temp_user_ids.splice(temp_user_ids.indexOf(user_id), 1);
    job.user_ids = temp_user_ids;
    let temp_user_jobs_attributes = job.user_jobs_attributes;
    temp_user_jobs_attributes.map(user_job=>{
      if (user_job.user_id == user_id){
        user_job._destroy = true;
      }
    });
    job.user_jobs_attributes = temp_user_jobs_attributes;
    this.setState({job: job});
  }

  handlePluginInputChange(e, name){
    let job = this.state.job;
    job[name] = e;
    this.setState({job: job});
  }

  handleSubmit(e){
    e.preventDefault();
    e.stopPropagation();

    let job = Object.assign({}, this.state.job);
    job.user_jobs_attributes = [];
    this.state.job.user_jobs_attributes.forEach(user_job => {
      job.user_jobs_attributes.push(Object.assign({}, user_job));
    })
    delete job['id'];
    delete job['errors'];
    delete job['users'];
    delete job['user_ids'];
    delete job['users_count'];
    job.user_jobs_attributes.forEach(user_job => {
      delete user_job['job_id'];
      delete user_job['user_avatar_url'];
      delete user_job['user_full_name'];
      delete user_job['errors'];
    })
    const data = {job: job}
    const url = this.props.jobId == null ? '/api/v1/jobs' : '/api/v1/jobs/' + this.props.jobId
    const method = this.props.jobId == null ? 'POST' : 'PUT'

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      },
      body: JSON.stringify(data)
    })
    .then(processResponse)
    .then(response => {
      this.props.checkJobRefresh(response.data);
      this.props.closeJobModal();
      this.handleClearJob();
    })
    .catch(response => {
      if (response.status == 401){
        localStorage.removeItem('authToken');
        this.props.logout()
      } else if (response.status == 422){
        let job = this.state.job;
        job.errors = response.data.error;
        this.setState({
          job: job
        });
      } else {
        this.props.openModalBox('Error', response.data.error.join(','));
      }
    });
  }

  renderAttendees(){
    return this.state.job.user_jobs_attributes.map((user_job, index) => {
      if (user_job._destroy == false) {
        return(
          <Col sm='6' key={index+'-'+user_job.id}>
            <div className="user-name-pane">
              <img className="avatar small" src={user_job.user_avatar_url}></img>
              <div className="name">{user_job.user_full_name}</div>
              <a className="form-close-button" onClick={()=>this.handleRemoveUser(user_job.user_id)}>&times;</a>
            </div>
          </Col>
        );
      }
    })
  }

  handleClearJob(){
    if (this.props.jobId) {
      this.getJob();
    } else {
      let job = Object.assign({}, emptyJob);
      job.user_jobs_attributes = [];
      this.setState({job: job});
    }
  }

  renderJobForm(){
    if ((this.props.jobId && (this.state.job.id == null)) || (this.state.users.length == 0)) {
      return <LoadingPage />
    } else {
      return (
        <Form noValidate onSubmit={e => this.handleSubmit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.jobId == null ? 'Create New' : 'Edit'} Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormInput label='Name' placeholder='Enter job name' value={this.state.job.name} handleChange={value => this.handleInputChange(value, 'name')} error={this.state.job.errors.name} />
            <FormInput label='Job Number' placeholder='Enter job number' value={this.state.job.job_number} handleChange={value => this.handleInputChange(value, 'job_number')} error={this.state.job.errors.job_number} />
            <FormSelect label='Status' placeholder='Select job status' value={this.state.job.status} options={[{value: 'pending', label: 'Pending'}, {value: 'active', label: 'Active'}, {value: 'finished', label: 'Finished'}, {value: 'failed', label: 'Failed'}]} handleChange={value=>this.handleInputChange(value, 'status')} error={this.state.job.errors.status} />
            <FormDatePicker name='start_date' label='Start Date' placeholder='Enter job start date' value={this.state.job.start_date} handleChange={(e, name)=>this.handleDateChange(e, name)} error={this.state.job.errors.start_date} />
            <FormDatePicker name='end_date' label='End Date' placeholder='Enter job end date' value={this.state.job.end_date} handleChange={(e, name)=>this.handleDateChange(e, name)} error={this.state.job.errors.end_date} />
            <FormAddress name='location' label='Location' placeholder='Enter job location' value={this.state.job.location} handleChange={(e, name) => this.handlePluginInputChange(e, name)} error={this.state.job.errors.location} />
            <FormAttendeesSelect name='user_ids' label='Attendees' placeholder='Select job attendees' value={this.state.job.user_ids} options={this.state.users} handleChange={e => this.handleAttendeesChange(e)} error={this.state.job.errors.user_ids} />
            <Row>
              <Col sm={{span: 9, offset: 3}}>
                <Row>
                  {this.renderAttendees()}
                </Row>
              </Col>
            </Row>
            <FormRichTextInput name='body' label='Note' placeholder='Enter job note' value={this.state.job.body} handleChange={(e, name)=>this.handlePluginInputChange(e, name)} error={this.state.job.errors.body} />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Submit form</Button>
            <Button variant="warning" onClick={() => this.handleClearJob()} >Clear</Button>
            <Button variant="secondary" onClick={() => this.props.closeJobModal()}>Close</Button>
          </Modal.Footer>
        </Form>
      );
    }
  }

  render(){
    return (
      <Modal className='job-form-modal' show={this.props.show} onHide={() => this.props.closeJobModal()} dialogClassName='modal-lg'>
        {this.renderJobForm()}
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobModal);