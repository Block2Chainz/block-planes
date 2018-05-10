import React, { Component } from 'react';
import Profile from '../profile/profile.jsx';
import './plane.css';

class Plane extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {console.log('props inside Plane Component', this.props)}
      </div>
    )
  }
}

export default Plane;