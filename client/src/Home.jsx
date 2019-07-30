import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ''
    }
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  handleAddressChange(e) {
    this.setState({
      address: e.target.value
    })
  }

  render() {
    return (
      <>
        {/* <p>Hello, {user.name}</p>
        <p onClick={this.logout}>Logout</p>
        <form onSubmit={this.handleSearchSubmit}>
          <input type='text' placeholder='City Name' value={this.state.address} onChange={this.handleAddressChange}/> {' '}
          <input type='submit' value='SEARCH' />
        </form> */}
      </> 
    );
  }
}

export default Home;