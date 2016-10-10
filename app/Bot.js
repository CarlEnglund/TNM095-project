const Vec = require('./Vec.js');
const Path = require('./Path.js');

class Bot {
  constructor(position, nest) {
    this.position = position;
    this.life = 1;
    this.memory = [];
    this.inventory = [];
    this.nest = nest;
    this.strategy = '';
    this.currentPath = new Path(this.position);
    this.angle = 100 * Math.PI / 180;
  }

  static size() {
    return new Vec([6, 6]);
  }

  /**
   * run a cycle of this bot's life
   * @param world {World}
   */
  update(world) {
    if (this.resources <= 0) {
      return;
    }
    this.scan(world);
    this.findPath(this.capacity);
    this.move();
    this.collectResources(world);
    //TODO: We should know when the bot is in the nest in a better way..
    if (this.costToDestination(this.nest.position) < 0.02 && this.inventory.length) {
      this.inventory.forEach((r) => {
        r.resourceLevel -= 1 / 10;
        r.transfer(this, this.nest);
        this.life += 1 / 10;
      });
    }
  }

  move() {
    let movement;
    if (!this.canCarryMore || this.costToDestination(this.nest.position) > this.resources) {
      movement = this.goTowards(this.nest.position);
      this.strategy = 'home';
    }
    else if (this.canCarryMore && this.pathMove) {
      movement = this.goTowards(this.pathMove);
      this.strategy = 'collect';
    }
    else {
      this.angle -= Math.PI / 200;
      movement = this.goTowards(new Vec([this.nestPosition.x + (Math.cos(this.angle) * 500), this.nestPosition.y + (Math.sin(this.angle) * 500)]));
      this.strategy = 'search';
    }
    this.position.add(movement);
    this.resources -= Bot.calculateCost(movement);
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
        this.removePosFromMemory(r.position);
      }
    });

    // TODO: clean this up
    // remove position from memory if there is no resource closest at the position
    if (resources.length === 0 && this.hasMemory && this.position.dist(this.bestMemory) < Bot.REACH_LENGTH) {
      this.removeRefFromMemory(this.memory[0]);
    }
  }

  /**
   * remove pos from memory by searching through this.memory for similar positions
   * @param pos {Vec}
   */
  removePosFromMemory(pos) {
    const positions = this.memory.filter(v => v.equals(pos));
    positions.forEach(this.removeRefFromMemory.bind(this));
  }

  /**
   * remove pos from this.memory, pos is a reference to an entry in this.memory
   * @param pos
   */
  removeRefFromMemory(pos) {
    const index = this.memory.indexOf(pos);
    this.memory.splice(index, 1);
  }

  get canCarryMore() {
    return this.capacity > 0;
  }

  get hasMemory() {
    return this.memory.length > 0;
  }

  get bestMemory() {
    return this.memory[0] || new Vec();
  }

  get pathMove() {
    return this.currentPath.firstPoint;
  }

  get size() {
    return Bot.size();
  }

  get style() {
    return 'green';
  }

  get capacity() {
    return Bot.INVENTORY_LIMIT - this.memory.length;
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

  static calculateCost(movement) {
    return Bot.CONSUMPTION * movement.length();
  }

  costToDestination(destination) {
    return Bot.calculateCost(destination.delta(this.position));
  }

  findPath(steps = Bot.PATH_STEPS) {
    if (this.pathMove && this.pathMove.dist(this.position) > Bot.REACH_LENGTH) {
      return;
    }

    let paths = [];
    this.memory.forEach((point) => {
      // create path, add this point as the first
      const path = new Path(this.position);
      path.addPoint(point);

      // add `steps` points from memory to the path
      let count = 0;
      this.memory.filter(p => p !== point).forEach((p) => {
        if (count++ < steps) {
          path.addPoint(p);
        }
      });

      paths.push(path);
    });

    // sort by result
    paths = paths.sort((a, b) => a.result - b.result);

    /*console.log('memory', this.memory.length,
      'path length: ', ((this.currentPath || {}).points || {}).length,
      'cost', (this.currentPath || {}).result);*/

    // set current path if this the found path is better that
    this.currentPath = paths[0] || new Path(this.position);
  }

  /**
   * get drawable line points for this
   */
  drawLines() {
    const lines = [this.position];
    const pathLines = this.currentPath.points;
    return lines.concat(pathLines);
  }

  get info() {
    return {
      position: this.position.roundedString,
      strategy: this.strategy,
      life: this.life || 0,
      memory: this.memory.length || 0,
      inventory: this.inventory.length || 0,
      pathCost: this.currentPath.cost || 0,
      pathLenght: this.currentPath.points.length || 0,
      pathResult: this.currentPath.result || 0,
      angle: this.angle
    };
  }
}

Bot.MANHATTAN_SIGHT = 100;
Bot.MEMORY_LIMIT = 10;
Bot.INVENTORY_LIMIT = 10;
Bot.SPEED = 1;
Bot.CONSUMPTION = 0.001;
Bot.REACH_LENGTH = 2;
Bot.PATH_STEPS = 3;

export default Bot;
