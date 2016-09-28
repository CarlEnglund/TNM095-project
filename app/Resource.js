const Vec = require('./Vec.js');

const FADE = 0.0001;

class Resource {
  constructor(position, lifetime = 1, level = 1) {
    this.position = position;
    this.resourceLevel = level;
    this.lifetime = lifetime;
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
}

export default Resource;
