import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { processResponse } from 'middlewares/custom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModalBox } from 'actions/modalBoxActions';
import { logout } from 'actions/currentUserActions';
import LoadingPage from 'components/LoadingPage';

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
  avatar: '',
  avatar_url: '',
  errors: {}
}

class UserPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: Object.assign({}, emptyUser)
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
      console.log(response);
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
            <Link to={'/users/'+this.state.user.id}>
              <Button variant="secondary">
                Back
              </Button>
            </Link>
            <Button variant="warning">
              Cancel
            </Button>
          </div>
        </div>
      );
    } else {
      return <LoadingPage />;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);