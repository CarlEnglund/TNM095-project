/* global window, document */

const World = require('./World.js');
const Renderer = require('./Renderer.js');
const Gui = require('./Gui.js');

require("../css/application.scss");

class Control {
  constructor(elementId = 'application', size = { w: 800, h: 600 }) {
    this.world = new World(size);
    this.canvas = document.createElement('canvas');
    this.canvas.width = size.w;
    this.canvas.height = size.h;
    this.gui = new Gui();

    const parent = document.getElementById(elementId);
    parent.appendChild(this.canvas);

    this.renderer = new Renderer(this.canvas);
  }

  start() {
    console.info('Starting simulation...');
    this.world.init();
    this.world.addDebugInfo(this.gui);
    window.requestAnimationFrame(this.render.bind(this));
  }

  render() {
    // IT'S ALIVE
    this.renderer.draw(this.world);
    this.world.update();
    this.gui.update(this.world);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default Control;
