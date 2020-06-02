import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';
import { UserInfoGroup } from 'components/CustomComponents';
import LoadingPage from 'components/LoadingPage';

function mapStateToProps(state){
  return{
    role: state.currentUser.role
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, logout}, dispatch)
}

class UserPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount(){
    this.getUser(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState){
  }

  getUser(id){
    let url = '/api/v1/users/'+id;
    fetch(url, {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      }
    })
    .then(processResponse)
    .then(response => {
      this.setState({
        user: response.data
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

  render() {
    if (this.state.user){
      return(
        <div className='page-main-content user-page'>
          <div className='page-content-header user-header'>
            <Link to='/users'>
              <Button variant="secondary">
                Back
              </Button>
            </Link>
            {this.props.role == 'admin' &&
              <Link to={'/users/'+this.state.user.id+'/edit'}>
                <Button variant="info">
                  Edit User
                </Button>
              </Link>
            }
          </div>
          <div className='user-profile'>
            <img className="avatar lg" src={this.state.user.avatar_url}></img>
            <div className='user-name'>
              <div className='name'>{this.state.user.full_name}</div>
              {this.state.user.archived &&
                <div className='status'>(archived)</div>
              }
            </div>
          </div>
          <Row>
            <Col sm='6'>
              <UserInfoGroup label='Email' content={this.state.user.email} />
            </Col>
            <Col sm='6'>
              <UserInfoGroup label='Role' content={this.state.user.role} />
            </Col>
            <Col sm='6'>
              <UserInfoGroup label='First Name' content={this.state.user.first_name} />
            </Col>
            <Col sm='6'>
              <UserInfoGroup label='Last Name' content={this.state.user.last_name} />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm='6'>
              <UserInfoGroup label='Assigned Jobs count' content={this.state.user.assigned_jobs_count} />
            </Col>
            <Col sm='6'>
              <UserInfoGroup label='Active Jobs Count' content={this.state.user.assigned_active_jobs_count} />
            </Col>
            <Col sm='6'>
              <UserInfoGroup label='Failed Jobs Count' content={this.state.user.assigned_failed_jobs_count} />
            </Col>
            <Col sm='6'>
              <UserInfoGroup label='Finished Jobs Count' content={this.state.user.assigned_finished_jobs_count} />
            </Col>
          </Row>
        </div>
      );
    } else {
      return <LoadingPage />;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);