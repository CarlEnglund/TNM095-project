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

      if (Renderer.DRAW_LINES && drawable.drawLines) {

        const lines = drawable.drawLines();
        if (lines.length > 0) {
          const firstPos = lines.splice(0, 1)[0];
          ctx.beginPath();
          ctx.moveTo(firstPos.x, firstPos.y);
          lines.forEach(v => ctx.lineTo(v.x, v.y));
          ctx.stroke();
        }
      }
    });
  }
}

Renderer.DRAW_LINES = true;
Renderer.RESOURCE_ON_CLICK = false;

export default Renderer;
