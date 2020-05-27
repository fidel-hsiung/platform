import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { processResponse } from 'middlewares/custom';
import { closeJobModal, editJob } from 'actions/jobActions';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';
import { InfoGroup, InfoGroupRichText } from 'components/CustomComponents';

export default function JobView(props){

  const [job, setJob] = useState({});
  const show = useSelector(state => state.job.jobViewShow);
  const jobId = useSelector(state => state.job.viewJobId);;
  const refreshJobView = useSelector(state => state.job.refreshJobView);
  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {    
      const url = '/api/v1/jobs/' + jobId;
      fetch(url, {
        method: 'GET',
        headers: {
          'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
        }
      })
      .then(processResponse)
      .then(response => {
        setJob(response.data);
      })
      .catch(response => {
        if (response.status == 401){
          localStorage.removeItem('authToken');
          dispatch(logout());
        }
        dispatch(openModalBox('Error', response.data.error.join(',')));
      });
    }
  }, [jobId, refreshJobView])

  return (
    <Modal show={show} onHide={() => dispatch(closeJobModal())} dialogClassName='modal-lg'>
      <Modal.Header closeButton>
        <Modal.Title>{job.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InfoGroup label='Name' content={job.name} />
        <InfoGroup label='No.' content={job.job_number} />
        <InfoGroup label='Status' content={job.status} />
        <InfoGroup label='Date Range' content={job.start_date + ' to ' + job.end_date} />
        <InfoGroup label='Location' content={job.location} />
        {job.users &&
          <InfoGroup label='Attendees' content={job.users.map(user => user.first_name + ' ' + user.last_name).join(', ')} />
        }
        {job.body &&
          <InfoGroupRichText label='Note' content={job.body} />
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => dispatch(editJob(jobId))}>
          Edit
        </Button>
        <Button variant="secondary" onClick={() => dispatch(closeJobModal())}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  ); 
}