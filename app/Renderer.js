class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
  }

  /**
   * draw world's content
   * @param world [World]
   */
  draw(world) {
    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    world.drawables.forEach((drawable) => {
      // draw drawable
      const { style, size, position } = drawable;
      const drawPosition = {
        x: position.x - (size.x / 2),
        y: position.y - (size.y / 2),
      };
      ctx.fillStyle = style;
      ctx.fillRect(drawPosition.x, drawPosition.y, size.x, size.y);
    });
  }
}

export default Renderer;
