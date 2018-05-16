// From: http://codepen.io/bungu/pen/rawvJe
const Particle = require('./particle.js');
const { serverUpdate } = require('../serverEvents.js');

/**
 * Rotate point around center on certain angle
 * @param {Object} p        {x: Number, y: Number}
 * @param {Object} center   {x: Number, y: Number}
 * @param {Number} angle    Angle in radians
 */

const rotatePoint = (p, center, angle) => {
  return {
    x: ((p.x-center.x)*Math.cos(angle) - (p.y-center.y)*Math.sin(angle)) + center.x,
    y: ((p.x-center.x)*Math.sin(angle) + (p.y-center.y)*Math.cos(angle)) + center.y
  };
};

/**
 * Random Number between 2 numbers
 */
module.exports.randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

/**
 * Random Number between 2 numbers excluding a certain range
 */
module.exports.randomNumBetweenExcluding = (min, max, exMin, exMax) => {
  let random = randomNumBetween(min, max);
  while (random > exMin && random < exMax) {
    random = Math.random() * (max - min + 1) + min;
  }
  return random;
};

const randomNumBetweenExcluding = (min, max, exMin, exMax) => {
  let random = randomNumBetween(min, max);
  while (random > exMin && random < exMax) {
    random = Math.random() * (max - min + 1) + min;
  }
  return random;
};

const randomNumBetweenExcludingTwoRanges = (min, max, r1Min, r1Max, r2Min, r2Max) => {
  let random = randomNumBetween(min, max);
  while (random > r1Min && random < r1Max && random > r2Min && random < r1Max) {
    random = Math.random() * (max - min + 1) + min;
  }
  return random;
};


const update = (room, type) => {
  let array = room.get(type) || [];
  // look at every item and update their positions
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    item.position.x += item.velocity.x;
    item.position.y += item.velocity.y;

    if (type === 'particles') {
      item.position.x += item.velocity.x;
      item.position.y += item.velocity.y;
      item.velocity.x *= item.inertia;
      item.velocity.y *= item.inertia;

      item.radius -= 0.1;
      if (item.radius < 0.1) {
        item.radius = 0.1;
      }
      if (item.lifeSpan-- < 0) {
        item.delete = true;
      }
    }

  //   if (array.length === 0 && type === 'enemies') {
  //      // generate a new enemy, quantity = the number passed into the function
  //      let ship1 = room.get('p1_ship');
  //      let ship2 = room.get('p2_ship');
  //      for (let i = 0; i < number; i++) {
  //          let enemy = new Enemy({
  //              // give it a random position on the screen
  //              position: {
  //                  x: randomNumBetweenExcludingTwoRanges(0, this.state.screen.width, ship1.position.x - 60, ship1.position.x + 60, ship2.position.x - 60, ship2.position.x + 60),
  //                  y: randomNumBetweenExcludingTwoRanges(0, this.state.screen.height, ship2.position.y - 60, ship2.position.y + 60, ship2.position.y - 60, ship2.position.y + 60),
  //              }, 
  //          });
  //          this.createObject(enemy, 'enemies')
  //      }
  //  }
  
    // delete the item if it is destroyed
    if (item.delete) {
      console.log('DELETING AN ITEM', item);
      array.splice(i, 1);
    }
    
    // check for the different types for when they go too far off screen
    // Remove if it goes too far off screen 
    // if (item.position.x < -10 || item.x > 1000 || item.y < -10 || item.y > 1000) {
    //   if (type === 'bullets') {
    //     array.splice(i, 1);
    //     i--;
    //   }
    // }
  }
  room.set(type, array);
}


const checkCollisionsWith = (items1, items2) => {
  // loop through each item in one array, compare to each item in second array
  let a = items1.length - 1;
  let b;
  for (a; a >= 0; a--) {
    b = items2.length - 1;
    for (b; b >= 0; b--) {
      let item1 = items2[a];
      let item2 = items2[b];
      if (checkCollision(item1, item2)) {
        // destroy if a collision is detected
        item1.destroy();
        item2.destroy();
      }
    }
  }
}

const checkCollision = (obj1, obj2) => {
  let vx = obj1.position.x - obj2.position.x;
  let vy = obj1.position.y - obj2.position.y;
  // pythagorean theorem formula a^2 + b^2 = c^2 
  // gets the distance between the two objects based on their separation on the horizontal and vertical planes
  let length = Math.sqrt(vx * vx + vy * vy);
  // checks against the two radiuses added together
  // example 
  // obj 1 and 2 are 10 pixels away from each other's center
  // if their radius's are greater than 5 pixels, a collision is registered
  if (length < obj1.radius + obj2.radius) {
    return true;
  } else {
    return false;
  }
}

module.exports.ServerGameLoop = ({ io, client, room, player }) => {
  // update all of their positions
  update(room, 'bullets');
  update(room, 'ships');
  update(room, 'particles');
  update(room, 'enemies');

  // check collisions
  // pull out all of the items in the room
  let bullets = room.get('bullets');
  let enemies = room.get('enemies');
  let ships = room.get('ships');

  // check the relevant collisions
  checkCollisionsWith(bullets, enemies);
  checkCollisionsWith(ships, enemies);

  // reset the items in the room
  room.set('bullets', bullets);
  room.set('enemies', enemies);
  room.set('ships', ships);

  // clear out the variables for garbage collection
  // bullets = enemies = ships = null;

  // emit the new items
  serverUpdate({ io, client, room, player });
}

module.exports.accelerate = (room, ship) => {
  // ship.accelerate(1);
  ship.velocity.x -= Math.sin(-ship.rotation * Math.PI / 180) * ship.speed;
  ship.velocity.y -= Math.cos(-ship.rotation * Math.PI / 180) * ship.speed;

  // Thruster particles
  let posDelta = rotatePoint({
    x: 0,
    y: -55
  }, {
    x: 0,
    y: 0
  }, (ship.rotation - 180) * Math.PI / 180);
  const particle = new Particle({
    lifeSpan: randomNumBetween(20, 40),
    size: randomNumBetween(1, 3),
    position: {
      x: ship.position.x + posDelta.x + randomNumBetween(-2, 2),
      y: ship.position.y + posDelta.y + randomNumBetween(-2, 2)
    },
    color: ship.smokeColor,
    velocity: {
      x: posDelta.x / randomNumBetween(3, 5),
      y: posDelta.y / randomNumBetween(3, 5)
    }
  });

  create(room, particle, 'particles');
  return ship;
}

module.exports.create = (room, item, type) => {
  let items = room.get(type) ? room.get(type) : [];
  items.push(item);
  room.set(type, items);
}

const create = (room, item, type) => {
  let items = room.get(type) ? room.get(type) : [];
  items.push(item);
  room.set(type, items);
}