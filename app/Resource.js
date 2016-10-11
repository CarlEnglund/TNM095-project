const Vec = require('./Vec.js');

const FADE = 0.0001;

class Resource {
  constructor(position, level = Resource.DEFAULT_LEVEL) {
    this.position = position;
    this.resourceLevel = level;
  }

  static size() {
    return new Vec([2, 2]);
  }

  update() {
    this.resourceLevel -= FADE;
  }

  get style() {
    return 'blue';
  }

  get size() {
    return Resource.size();
  }

  transfer(from, to) {
    from.removeResource(this);
    to.addResource(this);
  }
}

Resource.DEFAULT_LEVEL = 3;

export default Resource;
