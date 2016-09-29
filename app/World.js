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
    const basePosition = new Vec.Random(bounds);
    this.createRandomResources(bounds);
    this.nests.push(new Nest(basePosition));
    this.createBots(bounds, 2, basePosition);
  }

  update() {
    this.nests.forEach(nest => nest.update());
    this.bots.forEach(bot => bot.update());
  }

  createRandomResources(bounds, amount = 100) {
    while (--amount) {
      this.resources.push(new Resource(Vec.Random(bounds)));
    }
  }

  createBots(bounds, amount = 10, basePosition) {
    while (--amount) {
      this.bots.push(new Bot((new Vec.Random(bounds)), basePosition));
    }
  }

  get drawables() {
    return this.bots.concat(this.nests).concat(this.resources);
  }
}

export default World;
