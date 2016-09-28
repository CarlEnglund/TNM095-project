const Resource = require('./Resource.js');
const Vec = require('./Vec.js');

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
  }

  update() {
    // updating world
  }

  createRandomResources(amount = 100) {
    const bounds = { x: this.boundaries.w, y: this.boundaries.h };
    while (--amount) {
      this.resources.push(new Resource(Vec.Random(bounds)));
    }
  }
}

export default World;
