import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Ship from '../game/gameObjects/ship.js';
import Particle from '../game/gameObjects/particle.js';
import './plane.css';

class Plane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRadio || 1
      },
      context: null
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
    if (this.state.context) {
      const context = this.state.context;
      const ship = this.ship[0];
  
      // store canvas state on the stack
      context.save();
      
      // remove or render
      this.updateObjects(this.particles, 'particles');
      this.updateObjects(this.ship, 'ship');
  
      // pop the top state off the stack, restore context
      context.restore();
  
      // set up next frame 
      requestAnimationFrame(() => { this.update() });
    }
  }

  startGame() {
    // make the ship
    // create a ship object
    let ship = new Ship({
      attr: this.props.plane[1],
      position: {
        x: 75,
        y: 25,
      },
      create: this.createObject.bind(this),
      ingame: false,
    });

    // save the ship object via the create object method
    this.createObject(ship, 'ship');
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    let context = this.state.context;
    // go through each item of the specified group and delete them or call their render functions
    let index = 0;
    for (let item of items) {
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

  select (e) {
    e.preventDefault();
    this.props.highlight(this.props.plane[1]);
  }

  render() {
    return (
      <div>
        {this.props.selected === true ? 
          <div onClick={(e) => this.select(e)} width={16} className='plane blinking-border selected-plane-background' >
          <canvas ref='canvas' width={150} height={150} className='canvas-plane'/>
            <div>
              <p className='selected-plane-stats'>
                Speed: {parseInt(JSON.stringify(this.props.plane[1]).slice(6, 7)) % 4 + 1} <br/>
                Inertia: {parseInt(JSON.stringify(this.props.plane[1]).slice(7, 8)) % 3 + 1} <br />
                Fire Rate: {parseInt(JSON.stringify(this.props.plane[1]).slice(8, 9)) % 7 + 1}
              </p>
            </div>
          </div>
          : 
          <div>
            <div onClick={(e) => this.select(e)} width={16} className='plane' >
            <canvas ref='canvas' width={150} height={150} className='canvas-plane'/>
            </div>
          </div>
        }
      </div>
    );
  }  
}

export default Plane;