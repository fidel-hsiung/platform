import React from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { FormInput, FormSelect, FormAddress, FormDatePicker, FormRichTextInput } from 'components/CustomFormComponents';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeJobModal } from 'actions/jobActions';
import { openModalBox } from 'actions/modalBoxActions';
import { refreshCalendar, checkRefreshCalendar } from 'actions/calendarActions';
import { processResponse } from 'middlewares/custom';

function mapStateToProps(state){
  return{
    show: state.job.jobModalShow,
    jobId: state.job.editJobId
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({closeJobModal, openModalBox, refreshCalendar, checkRefreshCalendar}, dispatch)
}

class JobModal extends React.Component{

  constructor(props){
    super(props);
    this.emptyUserJob = {
      id: null,
      user_id: null,
      user_image_url: '',
      user_full_name: '',
      errors: {},
      _destroy: false
    };
    this.emptyJob = {
      id: null,
      name: '',
      status: 'pending',
      job_number: '',
      location: '',
      start_date: '',
      end_date: '',
      user_ids: [],
      body: '',
      user_jobs_attributes: [],
      errors: {}
    };
    this.state = {
      job: Object.assign({}, this.emptyJob)
    };
  }

  componentDidUpdate(prevProps){
    if (this.props.jobId != prevProps.jobId){
      if (this.props.jobId == null){
        this.setState({job: Object.assign({}, this.emptyJob)});
      } else {
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
    }
  }

  handleInputChange(e){
    let job = this.state.job;
    const target = e.target;
    job[target.name] = target.value;
    this.setState({job: job});
  }

  handleSelectChange(e, name){
    let job = this.state.job;
    job[name] = e.value;
    this.setState({job: job});
  }

  handleDateChange(e, name){
    let job = this.state.job;
    let res = e == null ? '' : moment(e).format('YYYY-MM-DD');
    job[name] = res;
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
    delete job['id'];
    delete job['errors'];
    delete job['users'];
    job.user_jobs_attributes.forEach(user_job => {
      delete user_job['job_id'];
    })
    const data = {job: job}
    const url = this.state.job.id == null ? '/api/v1/jobs' : '/api/v1/jobs/' + this.state.job.id
    const method = this.state.job.id == null ? 'POST' : 'PUT'

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
      console.log(response);
      if (response.data.refresh) {
        this.props.refreshCalendar()
      } else if (response.data.start_date && response.data.end_date) {
        const payload = {start_date: new Date(response.data.start_date), end_date: new Date(response.data.end_date)}
        this.props.checkRefreshCalendar(payload);
      }
      this.props.closeJobModal();
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

  render(){
    return (
      <Modal className='job-form-modal' show={this.props.show} onHide={() => this.props.closeJobModal()} dialogClassName='modal-lg'>
        <Form noValidate onSubmit={e => this.handleSubmit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.jobId == null ? 'Create New' : 'Edit'} Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormInput name='name' label='Name' placeholder='Enter job name' value={this.state.job.name} handleChange={e => this.handleInputChange(e)} error={this.state.job.errors.name} />
            <FormInput name='job_number' label='Job Number' placeholder='Enter job number' value={this.state.job.job_number} handleChange={e => this.handleInputChange(e)} error={this.state.job.errors.job_number} />
            <FormSelect name='status' label='Status' placeholder='Select job status' options={[{value: 'pending', label: 'Pending'}, {value: 'active', label: 'Active'}, {value: 'finished', label: 'Finished'}, {value: 'failed', label: 'Failed'}]} value={this.state.job.status} handleChange={(e, name)=>this.handleSelectChange(e, name)} error={this.state.job.errors.status} />
            <FormDatePicker name='start_date' label='Start Date' placeholder='Enter job start date' value={this.state.job.start_date} handleChange={(e, name)=>this.handleDateChange(e, name)} error={this.state.job.errors.start_date} />
            <FormDatePicker name='end_date' label='End Date' placeholder='Enter job end date' value={this.state.job.end_date} handleChange={(e, name)=>this.handleDateChange(e, name)} error={this.state.job.errors.end_date} />
            <FormAddress name='location' label='Location' placeholder='Enter job location' value={this.state.job.location} handleChange={(e, name) => this.handlePluginInputChange(e, name)} error={this.state.job.errors.location} />
            <FormRichTextInput name='body' label='Note' placeholder='Enter job note' value={this.state.job.body} handleChange={(e, name)=>this.handlePluginInputChange(e, name)} error={this.state.job.errors.body} />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Submit form</Button>
            <Button variant="secondary" onClick={() => this.props.closeJobModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobModal);