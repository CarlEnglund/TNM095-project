const Vec = require('./Vec.js');

const COST = 0.001;

class Bot {
  constructor(position, basePosition) {
    this.position = position;
    this.basePosition = basePosition;
    this.life = 1;
  }

  static size() {
    return new Vec([6, 6]);
  }

  update() {
    //this.move();
    this.goHome();
    // look around?
    // collect resources?
  }

  move() {
    if (this.resources <= 0) {
      return;
    }
    this.position.add(this.movement);
    this.resources -= COST;
  }

  get movement() {
    return new Vec.Random({ minX: -1, minY: -1, maxX: 1, maxY: 1 });
  }

  get size() {
    return Bot.size();
  }

  get style() {
    return 'green';
  }

  set resources(resources) {
    this.life = resources;
    if (this.resources <= 0) {
      console.error('DEAD!');
    }
  }

  get resources() {
    return this.life;
  }

  goHome() {
    const dx = ((this.basePosition.y + 25) - this.position.y);
    const dy = ((this.basePosition.x + 25) - this.position.x);
    const dist = Math.abs(Math.sqrt(dx * dx + dy * dy));
    const Angle = Math.atan2(dx, dy);
    const perFrameDistance = 1;
    // Sin is x angle Cos is y angle
    const Sin = Math.sin(Angle) * perFrameDistance;
    const Cos = Math.cos(Angle) * perFrameDistance;
    if (dist > 1) {
      this.position.x += Cos;
      this.position.y += Sin;
    }
  }
}

export default Bot;
