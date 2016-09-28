const World = require('./World.js');

class Control {
  constructor(elementId = 'application', size = { w: 800, h: 600 }) {
    this.world = new World(size);
    this.canvas = document.createElement('canvas');
    this.canvas.width = size.w;
    this.canvas.height = size.h;

    const parent = document.getElementById(elementId);
    parent.appendChild(this.canvas);
  }

  start() {
    console.info('Starting simulation...')
    this.world.init();
    window.requestAnimationFrame(this.render.bind(this));
  }

  render() {
    // IT'S ALIVE
    this.world.update();

    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default Control;
