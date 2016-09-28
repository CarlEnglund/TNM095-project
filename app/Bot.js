const Vec = require('./Vec.js');

const COST = 0.001;

class Bot {
  constructor(position) {
    this.position = position;
    this.life = 1;
  }

  static Size() {
    return new Vec([6, 6]);
  }

  update() {
    this.move();
    // look around?
    // collect resources?
  }

  move() {
    if (this.resources > 0)
    this.position.add(this.movement);
    this.resources -= COST;
  }

  get movement() {
    return new Vec.Random({ minX: -1, minY: -1, maxX: 1, maxY: 1});
  }

  get size() {
    return Bot.Size();
  }

  get style() {
    return 'green';
  }

  set resources(resources) {
    this.life = resources;
    if (this.resources <= 0) console.error('DEAD!');
  }

  get resources() {
    return this.life;
  }
}

export default Bot;
