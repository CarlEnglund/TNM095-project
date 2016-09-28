const Vec = require('./Vec.js');

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

  }

  get style() {
    return 'blue';
  }

  get size() {
    return Resource.size();
  }
}

export default Resource;
