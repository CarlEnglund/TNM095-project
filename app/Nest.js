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
    if (this.width > 0 && this.height > 0 && this.resources.length) {
      this.shrinkNest();
    }
    if (this.resources.length) {
      setTimeout(this.createBots.bind(world, this), 5000);
    }
    console.log(this.resources.length)
  }

  get style() {
    return 'red';
  }

  createBots(nest) {
    console.log(nest)
    this.createBots(nest.position, nest);
    nest.resources.pop();
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
    setTimeout(this.removeResourceFromNest.bind(this), 5000);
  }

  addResourceToNest() {
    this.resources++;
  }

  removeResourceFromNest() {
    console.log(this)
    this.resources.pop();
  }

  addResource(resource) {
    this.resources.push(resource);
    this.growNest();
  }
}
export default Nest;

