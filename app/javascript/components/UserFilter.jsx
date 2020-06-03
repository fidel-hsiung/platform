import React from 'react';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { FormInput, FilterFormMultiSelect, FormSelect } from 'components/CustomFormComponents';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, logout}, dispatch)
}

const emptyUserFilter = {
  email: '',
  firstName: '',
  lastName: [],
  roles: [],
  archived: ''
}

class UserFilter extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userFilter: {
        email: this.props.userFilter.email,
        firstName: this.props.userFilter.firstName,
        lastName: this.props.userFilter.lastName,
        roles: this.props.userFilter.roles,
        archived: this.props.userFilter.archived
      },
      filterShow: false
    };
  }

  toggleFilter(){
    let filterShow = !this.state.filterShow;
    this.setState({filterShow: filterShow});
  }

  handleSubmit(e){
    e.preventDefault();
    e.stopPropagation();

    if (this.state.userFilter.email != '' || this.state.userFilter.firstName != '' || this.state.userFilter.lastName != '' || this.state.userFilter.roles.length > 0 || this.state.userFilter.archived != '') {
      this.setState({filterShow: false});
      this.props.handleUserFilterChange(this.state.userFilter, true, !this.props.applyFilterChanged);
    }
  }

  handleUserFilterInputChange(value, name){
    let userFilter = this.state.userFilter;
    userFilter[name] = value;
    this.setState({userFilter: userFilter});
  }

  clearFilter(){
    let userFilter = Object.assign({}, emptyUserFilter);
    this.setState({
      userFilter: userFilter,
      filterShow: false
    });
    let applyFilterChanged = this.props.applyFilter ? !this.props.applyFilterChanged : this.props.applyFilterChanged;
    this.props.handleUserFilterChange(userFilter, false, applyFilterChanged);
  }

  handleToggle(isOpen, e, metadata){
    this.setState({filterShow: isOpen});
  }

  render(){
    return(
      <Dropdown className='user-filter' show={this.state.filterShow} onToggle={(isOpen, e, metadata)=>this.handleToggle(isOpen, e, metadata)} >
        <Dropdown.Toggle variant={this.props.filterButtonVariant} onClick={()=>this.toggleFilter()}>
          User Filter
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Form noValidate onSubmit={e=>this.handleSubmit(e)} >
            <FormInput label='Email' placeholder='Email' value={this.state.userFilter.email} handleChange={value=>this.handleUserFilterInputChange(value, 'email')} />
            <FormInput label='First Name' placeholder='First name' value={this.state.userFilter.firstName} handleChange={value=>this.handleUserFilterInputChange(value, 'firstName')} />
            <FormInput label='Last Name' placeholder='Last name' value={this.state.userFilter.lastName} handleChange={value=>this.handleUserFilterInputChange(value, 'lastName')} />
            <FilterFormMultiSelect label='Role' placeholder='Select role' value={this.state.userFilter.roles} options={[{value: 'employee', label: 'Employee'}, {value: 'contract', label: 'Contract'}, {value: 'admin', label: 'Admin'}]} handleChange={value=>this.handleUserFilterInputChange(value, 'roles')} />
            <FormSelect label='Archived' placeholder='Select archived' value={this.state.userFilter.archived} options={[{value: '1', label: 'True'}, {value: '0', label: 'False'}]} handleChange={value=>this.handleUserFilterInputChange(value, 'archived')} />
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

export default connect(null, mapDispatchToProps)(UserFilter);