const Resource = require('./Resource.js');
const Nest = require('./Nest.js')
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
    this.createRandomResources();
    this.bots.push(new Bot(new Vec()));
  }

  update() {
    this.nests.forEach(nest => nest.update());
    this.bots.forEach(bot => bot.update());
  }

  createRandomResources(amount = 100) {
    const bounds = { x: this.boundaries.w, y: this.boundaries.h };
    while (--amount) {
      this.resources.push(new Resource(Vec.Random(bounds)));
    }
    this.nests.push(new Nest(Vec.Random(bounds)));
}

  createRandomResources(amount = 100) {
    const bounds = {maxX: this.boundaries.w, maxY: this.boundaries.h, minX: 0, minY: 0};
    while (--amount) {
      this.resources.push(new Resource(Vec.Random(bounds)));
    }
  }

  get drawables() {
    return this.bots.concat(this.nests).concat(this.resources);
  }
}

export default World;
