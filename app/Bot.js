const Vec = require('./Vec.js');

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
    this.move();
    // collect resources?
  }

  move() {
    if (this.resources <= 0) {
      return;
    }
    const movement = this.goTowards(this.basePosition);
    this.position.add(movement);
    this.resources -= Bot.CONSUMPTION * movement.length();
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

  /**
   * go to position pos
   * @param pos {Vec}
   */
  goTowards(pos) {
    const dx = pos.y - this.position.y;
    const dy = pos.x - this.position.x;
    const angle = Math.atan2(dx, dy);
    // Sin is y angle, Cos is x angle
    return new Vec([Math.cos(angle) * Bot.SPEED, Math.sin(angle) * Bot.SPEED]);
  }
}

Bot.MANHATTAN_SIGHT = 10;
Bot.MEMORY_LIMIT = 3;
Bot.SPEED = 1;
Bot.CONSUMPTION = 0.001;

export default Bot;
