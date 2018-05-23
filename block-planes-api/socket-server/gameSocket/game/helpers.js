// From: http://codepen.io/bungu/pen/rawvJe
module.exports.asteroidVertices = (count, rad) => {
	let p = [];
	for (let i = 0; i < count; i++) {
		p[i] = {
		x: (-Math.sin((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad,
		y: (-Math.cos((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad
		};
	}
	return p;
};
/**
 * Rotate point around center on certain angle
 * @param {Object} p        {x: Number, y: Number}
 * @param {Object} center   {x: Number, y: Number}
 * @param {Number} angle    Angle in radians
 */
module.exports.rotatePoint = (p, center, angle) => {
	return {
		x: ((p.x - center.x) * Math.cos(angle) - (p.y - center.y) * Math.sin(angle)) + center.x,
		y: ((p.x - center.x) * Math.sin(angle) + (p.y - center.y) * Math.cos(angle)) + center.y
	};
};
// Random Number between 2 numbers
module.exports.randomNumBetween = (min, max) => {
  	return Math.random() * (max - min + 1) + min;
};
const randomNumBetween = (min, max) => {
  	return Math.random() * (max - min + 1) + min;
};
// Random Number between 2 numbers excluding a certain range
module.exports.randomNumBetweenExcluding = (min, max, exMin, exMax) => {
	let random = randomNumBetween(min, max);
	while (random > exMin && random < exMax) {
		random = Math.random() * (max - min + 1) + min;
	}
	return random;
};
// Random number betwen 2 numbers, excluding two ranges
module.exports.randomNumBetweenExcludingTwoRanges = (min, max, r1Min, r1Max, r2Min, r2Max) => {
	let random = randomNumBetween(min, max);
	while (random > r1Min && random < r1Max && random > r2Min && random < r1Max) {
		random = Math.random() * (max - min + 1) + min;
	}
	return random;
};
// checking for collisions between objects
module.exports.checkCollisionsWith = (items1, items2, type, socket, room, world) => {
	if (type !== undefined) {
		let ship1 = items1[1];
		let ship2 = items1[2];
		items1 = [ship1, ship2];
	}
	// loop through each item in one array, compare to each item in second array
	let a = items1.length - 1;
	let b;
	for (let a = 0; a < items1.length; a++) {
		b = items2.length - 1;
		for (let b = 0; b < items2.length; b++) {
			let item1 = items1[a];
			let item2 = items2[b];
			if (checkCollision(item1, item2)) {
				if (type === 'powerUps' && !item1.delete) {
					// powerUps - player and powerups
					// power up your ship, emit powered up event 
					item1.powerUp(item2);
					item2.destroy();
					world.powerUpCountdown();
					socket.in(room).emit('powered_up', { player: item1.id, type: item2.type });
				} else if (type === undefined) {
					// undefined - bullets and enemies
					// your bullets kill the enemies, destroy the bullet, add your score
					item1.destroy();
					item2.destroy(item1.id);
				} else if ((type === 'enemies' || type === 'enemyBullets') && !item1.invincible && !item1.delete) {
					// enemyBullets - player and enemy bullets
					// enemies - player and enemies
					// destroy the player, destroy the item (enemy or bullet), emit player died event
					item1.destroy();
					if (type === 'enemies') item2.destroy(item1.id);
					item2.destroy(item1.owner);
					socket.in(room).emit('player_died', { player: item1.id });
					world.respawnTimer(item1.id, socket, room);
				} else if (type === 'enemies' && item1.invincible === true) {
					item2.destroy();
				}
			}
		}	
	}
};

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
};