import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
// import { connect } from "react-redux";
import Ship from '../game/ship.js';
import Particle from '../game/particle.js';
import './plane.css';

// const mapStateToProps = state => {
//   return {
//     contract: state.contract,
//     userPlanes: state.userPlanes,
//     userAddress: state.userAddress,
//   };
// };

class Plane extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRadio || 1
      },
    }
    this.ship = [];
    this.particles = [];
  }

  componentDidMount() {
    // set up the canvas
    const context = this.refs.canvas.getContext('2d');
    // set variable 'context' to the canvas and save to state
    this.setState({ context: context });
    this.startGame();
    // function on the global window, calls the update function and then 
    // animates the next frame
    requestAnimationFrame(() => { this.update() });
  }

  update() {
    // for updating the new positions of everything
    // pull up the canvas
    // this.state.context = this.refs.canvas.getContext('2d')
    const context = this.state.context;
    const ship = this.ship[0];

    // ship.accelerate();
    // store canvas state on the stack

    context.save();
    // resize the field if the window has been resized
    // context.scale(this.state.screen.ratio, this.state.screen.ratio);
    
    // remove or render
    this.updateObjects(this.particles, 'particles');
    this.updateObjects(this.ship, 'ship');

    // pop the top state off the stack, restore context
    context.restore();

    // set up next frame 
    requestAnimationFrame(() => { this.update() });
  }

  startGame() {
    // make the ship
    // create a ship object

    let ship = this.shipCreator(this.props.plane[1].toString(), {
      position: {
        x: 50,
        y: 0,
      },
      create: this.createObject.bind(this),
    });

    // save the ship object via the create object method
    this.createObject(ship, 'ship');
  }

  shipCreator(attrString, otherAttr) {
    let attrPossibilities = {
      bodyColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
      wingShape: ['01', '02', '03', '04', '05'],
      wingColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
      tailShape: ['01', '02', '03', '04', '05'],
      tailColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
      cockpitShape: ['01', '02', '03', '04', '05'],
      cockpitColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
      speed: [0.15, 0.3, 0.4, 0.5],
      inertia: [0.99, 0.98, 0.97, 0.96],
      shootingSpeed: [300, 350, 400, 250, 200, 150, 100],
      smokeColor: ['#ff9999', '#b3ff99', '#ffffb3', '#80ffdf', '#99d6ff', '#c299ff', '#ff80df', '#ffffff'],
    }

    let shipArgs = {
      wingShape: attrPossibilities.wingShape[parseInt(attrString[0]) % 5],
      wingColor: attrPossibilities.wingColor[parseInt(attrString[1]) % 8],
      tailShape: attrPossibilities.tailShape[parseInt(attrString[2]) % 5],
      tailColor: attrPossibilities.tailColor[parseInt(attrString[3]) % 8],
      cockpitShape: attrPossibilities.cockpitShape[parseInt(attrString[4]) % 5],
      cockpitColor: attrPossibilities.cockpitColor[parseInt(attrString[5]) % 8],
      speed: attrPossibilities.speed[parseInt(attrString[6]) % 4],
      inertia: attrPossibilities.inertia[parseInt(attrString[7]) % 3],
      shootingSpeed: attrPossibilities.shootingSpeed[parseInt(attrString[8]) % 7],
      smokeColor: attrPossibilities.smokeColor[parseInt(attrString[9]) % 8],
      bodyColor: attrPossibilities.bodyColor[parseInt(attrString[10]) % 8],
      ingame: false,
    };
    return new Ship(Object.assign({}, shipArgs, otherAttr, ));
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    let context = this.state.context;
    // go through each item of the specified group and delete them or call their render functions
    let index = 0;
    for (let item of items) {
      // console.log(item, 'from ', items);
      if (item.delete || items.length > 5) {
        // delete the object from the field
        this[group].splice(index, 1);
      } else {
        // else call the render method attached to each object
        items[index].render(this.state);
      }
      index++;
    }
    context.restore();
  }

  render() {
    return (
        <Grid.Column width={16} className='plane' >
          <canvas ref='canvas' width={150} height={150} />
        </Grid.Column>
    )
  }  
}

export default Plane;