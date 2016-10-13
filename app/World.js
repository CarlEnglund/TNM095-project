const Resource = require('./Resource.js');
const Nest = require('./Nest.js');
const Vec = require('./Vec.js');
const Bot = require('./Bot.js');

class World {
  /**
   * construct a world with boundaries
   * @param boundaries [Object] { w, h }
  */ 
  constructor(boundaries) {
    this.boundaries = boundaries;
    this.bots = [];
    this.nests = [];
    this.resources = [];
  }

  init() {
    console.info('Adding things to world...');
    const bounds = { maxX: this.boundaries.w, maxY: this.boundaries.h };
    const firstBasePosition = new Vec([(this.boundaries.w / 2) - 100, (this.boundaries.h / 2)]);
    const secondBasePosition = new Vec([(this.boundaries.w / 2) + 100, (this.boundaries.h / 2)]);
    this.createRandomResources(bounds);
    this.nests.push(new Nest(firstBasePosition, 'green'));
    this.nests.push(new Nest(secondBasePosition, 'red'));
    this.createBots(this.nests[0], 'green');
    this.createBots(this.nests[1], 'red');
  }

  update() {
    this.nests.forEach(nest => nest.update(this));
    this.bots.forEach(bot => bot.update(this));

    if (this.resources.length === 0) {
      console.log('Game over!')
      console.log('Green Nest size is: ', this.nests[0].position.x, ' ', this.nests[0].position.y);
      console.log('Red Nest size is: ', this.nests[1].position.x, ' ', this.nests[1].position.y);
    }
  }

  /**
   * create a resource at position
   * @param position {Vec}
   */
  addResourceOnClick(position) {
    this.resources.push(new Resource(position));
  }

  /**
   * create a nest at position
   * @param position {Vec}
   */
  addNestOnClick(position) {
    const nest = new Nest(position);
    this.createBots(nest);
    this.nests.push(nest, 'green');
  }

  createRandomResources(bounds, amount = 100) {
    while (amount--) {
      this.resources.push(new Resource(Vec.Random(bounds)));
    }
  }

  createBots(nest, style,amount = 1) {
    while (amount--) {
      const botPos = nest.position.Copy();
      botPos.add(Vec.Random({minX: -3, minY: -3, maxX: 3, maxY: 3}));
      this.bots.push(new Bot(botPos, nest, style));
    }
  }

  createNest() {
    const bounds = { maxX: this.boundaries.w, maxY: this.boundaries.h };
    let basePosition = new Vec.Random(bounds);
    this.nests.push(new Nest(basePosition, 'green'));
  }

  get drawables() {
    return this.bots.concat(this.nests).concat(this.resources);
  }

  /**
   * get resources close enough to `pos`
   * @param pos {Vec}
   * @param distanceLimit {Number} how long the difference may be
   */
  availableResources(pos, distanceLimit = Bot.MANHATTAN_SIGHT) {
    return this.resources.filter(r => r.position.manhattan(pos) < distanceLimit);
  }

  removeResource(resource) {
    const index = this.resources.indexOf(resource);
    this.resources.splice(index, 1);
  }

  addResource(resource) {
    this.resources.push(resource);
  }

  /**
   * add debug info from world to gui
   * @param gui {Gui}
   */
  addDebugInfo(gui) {
    gui.addInfo(this);
  }

  get info() {
    return {
      resources: this.resources.length,
      bots: this.bots.length,
      livingBots: this.bots.filter(b => b.life > 0).length,
      nests: this.nests.length,
    };
  }
}

export default World;
