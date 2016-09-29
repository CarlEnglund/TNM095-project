const Vec = require('./Vec.js');

class Bot {
  constructor(position, nestPosition) {
    this.position = position;
    this.nestPosition = nestPosition;
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
    this.collectResources(world);
    // collect resources?
  }

  move() {
    if (this.resources <= 0) {
      return;
    }
    const movement = this.goTowards(this.nestPosition);
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

  collectResources(world) {
    const resources = world.availableResources(this.position, Bot.REACH_LENGTH);
    if (resources.length == 0) return;

    resources.forEach((r) => {
      if (this.canCarryMore) {
        r.transfer(world, this);
      }
    });
  }

  get canCarryMore() {
    return this.inventory.length < Bot.INVENTORY_LIMIT;
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

  removeResource(resource) {
    const index = this.inventory.indexOf(resource);
    this.inventory.splice(index, 1);
  }

  addResource(resource) {
    this.inventory.push(resource);
  }
}

Bot.MANHATTAN_SIGHT = 10;
Bot.MEMORY_LIMIT = 3;
Bot.INVENTORY_LIMIT = 3;
Bot.SPEED = 1;
Bot.CONSUMPTION = 0.001;
Bot.REACH_LENGTH = 2;

export default Bot;
