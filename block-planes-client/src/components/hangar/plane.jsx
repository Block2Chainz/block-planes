import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
// import { connect } from "react-redux";
import Ship from '../game/ship.js';
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
    // make your ship
    // create a ship object
    let randomAttrString = '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) +
      '' + Math.floor(Math.random() * 10) + '';

    let ship = this.shipCreator(randomAttrString, {
      position: {
        // x: this.state.screen.width / 2,
        // y: this.state.screen.height / 2,
        x: 0,
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
      bodyColor: attrPossibilities.bodyColor[attrString[0] % 8],
      wingShape: attrPossibilities.wingShape[attrString[0] % 5],
      wingColor: attrPossibilities.wingColor[attrString[1] % 8],
      tailShape: attrPossibilities.tailShape[attrString[2] % 5],
      tailColor: attrPossibilities.tailColor[attrString[3] % 8],
      cockpitShape: attrPossibilities.cockpitShape[attrString[4] % 5],
      cockpitColor: attrPossibilities.cockpitColor[attrString[5] % 8],
      speed: attrPossibilities.speed[attrString[6] % 4],
      inertia: attrPossibilities.inertia[attrString[7] % 3],
      shootingSpeed: attrPossibilities.shootingSpeed[attrString[8] % 7],
      smokeColor: attrPossibilities.smokeColor[attrString[9] % 8],
      ingame: false,
    };
    return new Ship(Object.assign({}, shipArgs, otherAttr, ));
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    // go through each item of the specified group and delete them or call their render functions
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        // delete the object from the field
        this[group].splice(index, 1);
      } else {
        // else call the render method attached to each object
        items[index].render(this.state);
      }
      index++;
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
        <Grid.Column width={16} className='plane' >
          <canvas ref='canvas' width={150} height={150} />
        </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }  
}

export default Plane;