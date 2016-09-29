const Vec = require('./Vec.js');

const COST = 0.001;

class Bot {
  constructor(position, basePosition) {
    this.position = position;
    this.basePosition = basePosition;
    this.life = 1;
    this.memory = [];
    this.inventory = [];
  }

  static size() {
    return new Vec([6, 6]);
  }

  /**
   *
   * @param world {World}
   */
  update(world) {
    this.scan(world);
    //this.move();
    // TODO: make this decision in `.move()`
    this.goHome();
    // collect resources?
  }

  move() {
    if (this.resources <= 0) {
      return;
    }
    this.position.add(this.movement);
    this.resources -= COST;
  }

  /**
   * scan the bot's surroundings for resources
   * @param world {World}
   */
  scan(world) {
    const resources = world.availableResources(this.position);
    // pluck positions
    let positions = resources.map(r => r.position);
    // filter out positions that the bot already remembers
    positions = positions.filter(p => !this.isRemembered(p));

    let newMemory = this.memory.concat(positions);
    newMemory = newMemory.sort(p => this.position.dist(p));
    // copy the MEMORY_LIMIT best choices
    this.memory = newMemory.slice(0, Bot.MEMORY_LIMIT).map(p => p.Copy());
  }

  /**
   * see if `pos` is in the bot's memory
   * @param pos
   * @returns {boolean}
   */
  isRemembered(pos) {
    return this.memory.some(memoryPosition => memoryPosition.equals(pos));
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
    // Sin is x angle, Cos is y angle
    const Sin = Math.sin(Angle) * Bot.SPEED;
    const Cos = Math.cos(Angle) * Bot.SPEED;
    if (dist > 1) {
      this.position.x += Cos;
      this.position.y += Sin;
    }
  }
}

Bot.MANHATTAN_SIGHT = 10;
Bot.MEMORY_LIMIT = 3;
Bot.SPEED = 1;

export default Bot;
