import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Link} from 'react-router-dom'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: ''
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    })
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post('/auth/login', {
      email: this.state.email,
      password: this.state.password
    }).then((res) => {
      if (res.data.type === 'error') {
        this.setState({
          message: res.data.message
        })
      } else {
        localStorage.setItem('mernToken', res.data.token);
        this.props.liftToken(res.data);
        this.props.history.push('/')
      }
    }).catch((err) => {
      console.log('login error is ', err);
      this.setState ({
        message: "Maximum login attemps exceeded. Please try again later."
      })
    }) 
  }
  

  render() {

    return (
      <div className="Login">
        <h1 className="appName">SafeStreeet</h1>
        <h5>Login to see SaftyScore:</h5>
        <form onSubmit={this.handleSubmit}>
          <div >
              <input className="loginInput"  onChange={this.handleEmailChange} 
                      value = {this.state.email} 
                      type ='email' 
                      name = 'email' 
                      placeholder = 'Email' />
                  
          </div>
          <input className="loginInput" onChange={this.handlePasswordChange}
                  value = {this.state.password}
                  type='password'
                  name='password'
                  placeholder ='Password' />
                  <br/><br/>
          <input className="submitBtn" type='submit' value='Login' />
        </form>
        <>
          <Link to='/signup' >Signup</Link> | {' '}
          <Link  to='/login'>Login</Link>
        </>
      </div>
      );
  }
}

export default Login;