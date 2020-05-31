import React from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown, FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';
import UserFilter from 'components/UserFilter';

function mapStateToProps(state){
  return{
    role: state.currentUser.role
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({openModalBox, logout}, dispatch)
}

class UsersPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      users: [],
      userFilter: {
        email: '',
        firstName: '',
        lastName: [],
        roles: [],
        archived: ''
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
    this.getUsers(this.state.page, this.state.sortBy, this.state.sortMethod);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.refreshUsersList != prevProps.refreshUsersList || (this.state.applyFilterChanged != prevState.applyFilterChanged && (this.state.applyFilter == true || this.state.applyFilter != prevState.applyFilter))){
      this.getUsers(this.state.page, this.state.sortBy, this.state.sortMethod);
    }
  }

  getQueryString(){
    let queryString = '';
    if (this.state.applyFilter){
      if (this.state.userFilter.email != ''){
        queryString += '&email='+this.state.userFilter.email;
      }
      if (this.state.userFilter.firstName != ''){
        queryString += '&first_name='+this.state.userFilter.firstName;
      }
      if (this.state.userFilter.lastName != ''){
        queryString += '&last_name='+this.state.userFilter.lastName;
      }
      for(let i=0;i<this.state.userFilter.roles.length;i++){
        queryString += '&roles[]='+this.state.userFilter.roles[i];
      }
      if (this.state.userFilter.archived != ''){
        queryString += '&archived='+this.state.userFilter.archived;
      }
    }
    return queryString;
  }

  getUsers(page, sortBy, sortMethod){
    let url = '/api/v1/users?page='+page+'&sort_by='+sortBy+'&sort_method='+sortMethod+this.getQueryString();
    fetch(url, {
      method: 'GET',
      headers: {
        'X-USER-AUTH-TOKEN': localStorage.getItem('authToken')
      }
    })
    .then(processResponse)
    .then(response => {
      this.setState({
        users: response.data.users,
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
    this.getUsers(this.state.page, nextSortBy, nextSortMethod)
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
    if (this.state.applyFilter && (this.state.userFilter.email != '' || this.state.userFilter.firstName != '' || this.state.userFilter.lastName != '' || this.state.userFilter.roles.length > 0 || this.state.userFilter.archived != '')){
      return 'success';
    } else {
      return 'secondary';
    }
  }

  handleUserFilterChange(userFilter, applyFilter, applyFilterChanged){
    this.setState({
      userFilter: userFilter,
      applyFilter: applyFilter,
      applyFilterChanged: applyFilterChanged
    })
  }

  render() {
    return(
      <div className='page-main-content users-page'>
        <div className='page-content-header users-header'>
          <UserFilter userFilter={this.state.userFilter} applyFilter={this.state.applyFilter} applyFilterChanged={this.state.applyFilterChanged} filterButtonVariant={this.filterButtonVariant()} handleUserFilterChange={(jobFilter, applyFilter, applyFilterChanged)=>this.handleUserFilterChange(jobFilter, applyFilter, applyFilterChanged)} />
          {this.props.role == 'admin' &&
            <Button variant="info">
              Create New User
            </Button>
          }
        </div>
        <Table responsive bordered hover className='user-table'>
          <thead>
            <tr>
              <th>
                <a onClick={()=>this.handleSortClick('email')}>
                  Email
                  {this.sortIcon('email')}
                </a>
              </th>
              <th>
                <a onClick={()=>this.handleSortClick('first_name')}>
                  Name
                  {this.sortIcon('first_name')}
                </a>
              </th>
              <th>
                <a onClick={()=>this.handleSortClick('role')}>
                  Role
                  {this.sortIcon('role')}
                </a>
              </th>
              <th>
                <a onClick={()=>this.handleSortClick('archived')}>
                  Archived
                  {this.sortIcon('archived')}
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user =>
              <tr key={user.id} >
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>{user.role}</td>
                <td>{user.archived ? 'True' : 'False'}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);