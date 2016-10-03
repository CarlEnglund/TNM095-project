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
    if (this.resources <= 0) {
      return;
    }
    this.scan(world);
    this.move();
    this.collectResources(world);
    // collect resources?
  }

  move() {
    let movement;
    if (!this.canCarryMore || this.costToDestination(this.nestPosition) * 1.5 > this.resources) {
      console.log('home', 'i', this.inventory.length, this.memory.length);
      movement = this.goTowards(this.nestPosition);
    }
    else if (this.canCarryMore && this.hasMemory) {
      console.log('collecting', 'i', this.inventory.length, this.memory.length);
      movement = this.goTowards(this.bestMemory);
    }
    else {
      console.log('random', 'i', this.inventory.length, this.memory.length);
      movement = new Vec.Random({maxX: 1, maxY: 1, minX: -1, minY: -1});
    }
    this.position.add(movement);
    this.resources -= this.calculateCost(movement);
  }

  /**
   * scan the bot's surroundings for resources
   * @param world {World}
   */
  scan(world) {
    const resources = world.availableResources(this.position);
    if (resources.length === 0) {
      return;
    }
    // pluck positions
    let positions = resources.map(r => r.position);
    // filter out positions that the bot already remembers
    positions = positions.filter(p => !this.isRemembered(p));

    const newMemory = this.memory.concat(positions).sort((a, b) => {
      if (this.position.dist(a) < this.position.dist(b)) {
        return -1;
      } else {
        return 1;
      }
    });
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

    resources.forEach((r) => {
      if (this.canCarryMore) {
        r.transfer(world, this);
        this.removeFromMemory(r.position);
      }
    });
  }

  /**
   * remove pos from memory
   * @param pos {Vec}
   */
  removeFromMemory(pos) {
    const positions = this.memory.filter(v => v.equals(pos));
    positions.forEach((p) => {
      const index = this.memory.indexOf(p);
      this.memory.splice(index, 1);
    });
  }

  get canCarryMore() {
    return this.inventory.length < Bot.INVENTORY_LIMIT;
  }

  get hasMemory() {
    return this.memory.length > 0;
  }

  get bestMemory() {
    return this.memory[0] || new Vec();
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

  calculateCost(movement) {
    return Bot.CONSUMPTION * movement.length();
  }

  costToDestination(destination) {
    return this.calculateCost(destination.delta(this.position));
  }
}

Bot.MANHATTAN_SIGHT = 100;
Bot.MEMORY_LIMIT = 3;
Bot.INVENTORY_LIMIT = 10;
Bot.SPEED = 1;
Bot.CONSUMPTION = 0.001;
Bot.REACH_LENGTH = 2;

export default Bot;
