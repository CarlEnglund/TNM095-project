const Vec = require('./Vec.js')
class Nest {
    constructor(position, width = 50, height = 50, resources = 1) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.resources = resources;
  }
  
  update() { 
   if(this.width > 0 && this.height > 0) 
     this.shrinkNest();
  }

  get style() {
    return 'red';
  }

  get size() {
    return new Vec([this.width, this.height]);  
  }
  
  growNest() {
    this.width++;
    this.height++;
  }
  
  shrinkNest() {
    this.width = this.width - 1/60;
    this.height = this.height - 1/60;
  }

  addResourceToNest() {
    this.resources++;
  }

  removeResourceFromNest() {
    this.resources--;
  }
}
export default Nest;

