const Vec = require('./Vec.js');

class Nest {
  constructor(position, width = 50, height = 50, resources = 1) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.resources = [];
    this.timeout = [];
  }

  update(world) {
    if (this.width > 0 && this.height > 0) {
      this.shrinkNest();
    }
    if (this.resources.length) {
      setTimeout(this.createBots.bind(world), 5000);
    }
  }

  get style() {
    return 'red';
  }
  createBots() {
    const botPos = this.nests[0].position.Copy();
    botPos.add(Vec.Random({minX: -3, minY: -3, maxX: 3, maxY: 3}));
    this.createBots(botPos, this.nests[0].position, this.nests[0]);
    this.nests[0].resources.pop();
    // Hacky way to clear timeouts, see http://stackoverflow.com/questions/3141064/how-to-stop-all-timeouts-and-intervals-using-javascript
    // Third answer.
    console.log('Created bot')
    let highestTimeoutId = setTimeout(';');
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }
  get size() {
    return new Vec([this.width, this.height]);
  }

  growNest() {
    this.width++;
    this.height++;
  }

  shrinkNest() {
    this.width -= (1/60);
    this.height -= (1/60);
  }

  addResourceToNest() {
    this.resources++;
  }

  removeResourceFromNest() {
    this.resources--;
  }

  addResource(resource) {
    this.resources.push(resource);
    this.growNest();
  }
}
export default Nest;

