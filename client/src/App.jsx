import React from 'react';
import './App.css';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import Results from './Results';
import Details from './Details';
import Home from './Home';
import moment from 'moment';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
// import {createBrowserHistory} from 'history'
// import {createHashHistory} from 'history';
// const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user: null,
      errorMessage: '',
      address: '',
      addressInfo: {
        center: [],
        neighborhood: '',
        zipcode: '',
        city: '',
        state: ''
      },
      crime: null,
      disasters: null,
      air: null,
      showResults: false
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this);
    this.liftToken = this.liftToken.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleRootLink = this.handleRootLink.bind(this);
  }

  checkForLocalToken() {
    var token = localStorage.getItem('mernToken');
    if (!token || token === 'undefined') {
      // Token is invalid or missing
      // todo localStorage keep user login even after close browser
      localStorage.removeItem('mernToken');
      this.setState({
        token: '',
        user: null
      })
    } else {
      // token is found, verify it
      axios.post('/auth/me/from/token', {token})
        .then( res => {
          //if come back with an error
        if (res.data.type === 'error') {
          localStorage.removeItem('mernToken'); 
          this.setState({
            errorMessage: res.data.message,
            token: '',
            user: null
          })
        } else {
          localStorage.setItem('mernToken', res.data.token);
          this.setState({
            token: res.data.token,
            user: res.data.user,
            errorMessage: ''
          })
        }
      })

    }
  }

  liftToken({token, user}) {
    this.setState({
      token,
      user
    })
  }

  logout() {
    //remove token from from localStorage
    localStorage.removeItem('mernToken');
    // Romve user and token from state
    this.setState({
      token: '',
      user: null
    })
  }

  handleAddressChange(e) {
    this.setState({
      address: e.target.value
    })
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('mernToken');
    console.log('go to backend for data');
    axios.get(`/api/address?address=${this.state.address}`).then(response => {
      console.log('get data from backend', response.data);
      this.setState({
        addressInfo: response.data,
      })
      axios.get(`/api/disasters?state=${this.state.addressInfo.state}&zipcode=${this.state.addressInfo.zipcode}`).then(response => {
        let disastersSummary = response.data;
        console.log('diasters are ', disastersSummary);
        this.setState({
          disasters: disastersSummary
        });
      })

      axios.get(`/api/airquality?city=${this.state.addressInfo.city}`).then(response => {
        console.log('get air quality response', response.data);
        this.setState({
          air: response.data
        })
      })

      axios.get(`/api/crime?neighborhood=${this.state.addressInfo.neighborhood}`).then(response => {
        console.log('get crime records, ', response.data);
        this.setState({
          crime: response.data,
          showResults: true
        })
      })


    })
  }

  handleRootLink() {
    this.setState({
      showResults: false
    })
  }

  componentDidMount() {
    this.checkForLocalToken();
  }

  render() {
    var user = this.state.user;
    var contents = (
      <Route exact path='/' render={() => (
        <div className='landing-page'>
          <Link to='/signup' >
            <div className="btn-div">
              Signup
            </div>
          </Link>
          <Link to='/login'>
            <div className="btn-div">
              Login
            </div>
          </Link>
        </div>
      )} />
    );

    if (this.state.disasters) {
      var disastersRender = [<h3>Total Disasters: {this.state.disasters.total}</h3>];
      for (let key in this.state.disasters) {
        if (key !='total') {
          let name = key.toString();
          console.log(key);
          disastersRender.push(<p>{name}: {this.state.disasters[key]}</p>)
        }
      }
    }

    if (user) {
      //have a user
      if (!this.state.showResults) {
        contents = (
          <Route exact path='/' render={(props) => (
            <div className='search-page'>
              <p>Hello, {user.name}</p>
              <p onClick={this.logout}>Logout</p>
              <form onSubmit={this.handleSearchSubmit}>
                <input type='text' placeholder='City Name' value={this.state.address} onChange={this.handleAddressChange}/> {' '}
                <input type='submit' value='SEARCH' />
              </form>
            </div> 
          )}/>
        );
      } else {
        contents = (
          <Route exact path='/' render={(props) => (
            <Redirect to='/results' />
            )}
          />
        )
      }
    }

    return (
      <div style={{backgroundImage: 'url(./iphone8_frame.png)'}} className='phone'>
        <div className='phone-frame'>
          <Router>
            {contents}
            {/* <Route exact path='/' render = {(props) => (contents)} /> */}
            <Route exact path='/login' render={(props) => (<Login {...props} liftToken = {this.liftToken} />)} />
            <Route exact path='/signup' render={(props) => (<Signup {...props} liftToken = {this.liftToken} />)} />
            <Route exact path='/results' render={() => (<Results 
              neighborhood={this.state.addressInfo.neighborhood} 
              address={this.state.address}
              disasters={this.state.disasters} 
              crime={this.state.crime}
              air={this.state.air}
              handleRootLink={this.handleRootLink}/>)} />
            <Route path='/results/:name' render={(props) => (<Details
              {...props} 
              disasters={this.state.disasters}
              crime={this.state.crime}
              air={this.state.air}
              />)} 
            />
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
