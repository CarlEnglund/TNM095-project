class Resource {
  constructor(world, position, lifetime, level = 1) {
    this.position = position;
    this.resourceLevel = level;
    this.lifetime = lifetime;
    this.ctx = world.context;
  }
  
  update() {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.fillStyle = "Blue";
    this.ctx.fillRect(this.postion.x, this.postion.y, 20, 20);
    this.ctx.restore();
  }

  getPosition() {
   return this.position;
  }
}

export default Resource;
