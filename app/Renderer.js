class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
  }

  /**
   * draw world's content
   * @param world [World]
   */
  draw(world) {
    const ctx = this.canvas.getContext("2d");

    world.drawables.forEach(drawable => {
      // draw drawable
      const { style, size, position } = drawable;
      ctx.fillStyle = style;
      ctx.fillRect(position.x, position.y, size.x, size.y);
    });
  }
}

export default Renderer;
