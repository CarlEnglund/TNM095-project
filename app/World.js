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
    this.createBots(basePosition, this.nests[0]);
  }

  update() {
    this.nests.forEach(nest => nest.update(this));
    this.bots.forEach(bot => bot.update(this));
    // add random resources
  }

  createRandomResources(bounds, amount = 100) {
    while (amount--) {
      this.resources.push(new Resource(Vec.Random(bounds)));
    }
  }

  createBots(basePosition, nest, amount = 1) {
    while (amount--) {
      const botPos = basePosition.Copy();
      botPos.add(Vec.Random({minX: -3, minY: -3, maxX: 3, maxY: 3}));
      this.bots.push(new Bot(botPos, basePosition, nest));
    }
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
}

export default World;
