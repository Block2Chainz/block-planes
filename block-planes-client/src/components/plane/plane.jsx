import React, { Component } from 'react';
import './plane.css';
import Collection from '../collection/collection.jsx';

class Plane extends Component {
  constructor(props) {
    super(props)  
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