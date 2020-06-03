import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';
import DefaultAvatar from 'images/default-user.png';
import LoadingPage from 'components/LoadingPage';
import { FormImageUpload, FormInput, FormSelect } from 'components/CustomFormComponents';

function mapStateToProps(state){
  return{
    role: state.currentUser.role
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, logout}, dispatch)
}

const emptyUser = {
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  role: 'employee',
  archived: '',
  avatar: '',
  avatar_url: '',
  errors: {}
}

class UserFormPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: Object.assign({}, emptyUser)
    };
  }

  componentDidMount(){
    if (this.props.match.params.id){
      this.getUser(this.props.match.params.id);
    }
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

  handleInputChange(value, name){
    let user = this.state.user;
    user[name] = value;
    this.setState({user: user});
  }

  handleImageUploadChange(image, name){
    let user = this.state.user;
    URL.revokeObjectURL(user[name]);
    user[name] = image;
    this.setState({user: user});
  }

  handleClearUser(){
    if (this.props.match.params.id) {
      this.getUser(this.props.match.params.id);
    } else {
      this.setState({user: Object.assign({}, emptyUser)});
    }
  }

  renderUserAvatar(){
    if (this.state.user.avatar) {
      return(
        <img className="avatar xlg" src={URL.createObjectURL(this.state.user.avatar)}></img>
      );
    } else if (this.state.user.avatar_url) {
      return(
        <img className="avatar xlg" src={this.state.user.avatar_url}></img>
      );
    } else {
      return(
        <img className="avatar xlg" src={DefaultAvatar}></img>
      );
    }
  }

  handleSubmit(e){
    e.preventDefault();
    e.stopPropagation();

    let user = Object.assign({}, this.state.user);
    delete user['id'];
    delete user['errors'];
    delete user['assigned_active_jobs_count']
    delete user['assigned_failed_jobs_count']
    delete user['assigned_finished_jobs_count']
    delete user['assigned_jobs_count']
    delete user['avatar_url']
    if (!user.avatar) {
      delete user['avatar']
    }

    const data = {user: user}
    const url = this.props.match.params.id ? '/api/v1/users/' + this.props.match.params.id : '/api/v1/users'
    const method = this.props.match.params.id ? 'PUT' : 'POST'

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
      this.props.history.push('/users/'+this.props.match.params.id)
    })
    .catch(response => {
      if (response.status == 401){
        localStorage.removeItem('authToken');
        this.props.logout()
      } else if (response.status == 422){
        let user = this.state.user;
        user.errors = response.data.error;
        this.setState({
          user: user
        });
      } else {
        this.props.openModalBox('Error', response.data.error.join(','));
      }
    });
  }

  render() {
    if (this.props.match.params.id && this.state.user.id == null) {
      return <LoadingPage />;
    } else {
      return(
        <div className='page-main-content user-form-page'>
          <div className='page-content-header user-form-header'>
            <Link to={this.state.user.id ? '/users/'+this.state.user.id : '/users'}>
              <Button variant="secondary">
                Back
              </Button>
            </Link>
            <Button variant="warning" onClick={()=>this.handleClearUser()} >
              Cancel
            </Button>
          </div>
          <Form noValidate className='user-form' onSubmit={e => this.handleSubmit(e)}>
            <div className='user-avatar-input'>
              {this.renderUserAvatar()}
              <FormImageUpload buttonText='Upload avatar' image={this.state.user.avatar} handleChange={image => this.handleImageUploadChange(image, 'avatar')} />
            </div>
            <FormInput label='Email' placeholder='Enter user email' value={this.state.user.email} handleChange={value => this.handleInputChange(value, 'email')} error={this.state.user.errors.email} />
            <FormInput label='First Name' placeholder='Enter user first name' value={this.state.user.first_name} handleChange={value => this.handleInputChange(value, 'first_name')} error={this.state.user.errors.first_name} />
            <FormInput label='Last Name' placeholder='Enter user last name' value={this.state.user.last_name} handleChange={value => this.handleInputChange(value, 'last_name')} error={this.state.user.errors.last_name} />
            <FormSelect label='Role' placeholder='Select user role' value={this.state.user.role} options={[{value: 'employee', label: 'Employee'}, {value: 'contract', label: 'Contract'}, {value: 'admin', label: 'Admin'}]} handleChange={value=>this.handleInputChange(value, 'role')} error={this.state.user.errors.role} />
            <FormSelect label='Archived' placeholder='Select user archived' value={this.state.user.archived} options={[{value: '1', label: 'True'}, {value: '0', label: 'False'}]} handleChange={value=>this.handleInputChange(value, 'archived')} error={this.state.user.errors.archived} />
            <div className='form-actions'><Button type="submit">Submit</Button></div>
          </Form>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFormPage);