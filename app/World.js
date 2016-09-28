const Resource = require('./Resource.js');
const Nest = require('./Nest.js')
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
    this.nests[0].update()
  }

  createRandomResources(amount = 100) {
        const bounds = { x: this.boundaries.w, y: this.boundaries.h };
        while (--amount) {
          this.resources.push(new Resource(Vec.Random(bounds)));
        }
        this.nests.push(new Nest(Vec.Random(bounds)));
    }

    get drawables() {
      return this.bots.concat(this.nests).concat(this.resources);
  }
}

export default World;
