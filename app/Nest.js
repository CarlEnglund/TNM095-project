class Nest {
  constructor(world, position, width, height, resources) {
    this.postion = position;
    this.width = width;
    this.height = height;
    this.resources = resources;
    this.ctx = world.context;
  }
  
  update() {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.fillStyle = "Red";
    this.ctx.fillRect(this.positon.x, this.position.y, this.width, this.height);
    this.ctx.restore();
  }

  getPostion() {
    return this.position;
  }

  growNest() {
    this.width++;
    this.height++;
  }
  
  shrinkNest() {
    this.width--;
    this.height--;
  }

  addResourceToNest() {
    this.resources++;
  }

  removeResourceFromNest() {
    this.resources--;
  }
}
export default Nest;

