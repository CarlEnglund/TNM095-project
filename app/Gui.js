const dat = require('dat.gui/build/dat.gui.js');
const Bot = require('./Bot.js');
const Renderer = require('./Renderer.js');

class Gui {
  constructor() {
    const gui = new dat.GUI();
    const params = {
      sight: Bot.MANHATTAN_SIGHT,
      memory: Bot.MEMORY_LIMIT,
      speed: Bot.SPEED,
      inventory: Bot.INVENTORY_LIMIT,
      reach: Bot.REACH_LENGTH,
      consumption: Bot.CONSUMPTION,
      lines: Renderer.DRAW_LINES,
    };

    const botFolder = gui.addFolder('Bot Parameters');
    botFolder.open();

    const guiSight = botFolder.add(params, 'sight').min(1).max(500).step(1).listen();
    const guiMemory = botFolder.add(params, 'memory').min(0).max(50).step(1).listen();
    const guiSpeed = botFolder.add(params, 'speed').min(0).max(5).step(0.1).listen();
    const guiInventory = botFolder.add(params, 'inventory').min(0).max(50).step(1).listen();
    const guiReach = botFolder.add(params, 'reach').min(1).max(50).step(1).listen();
    const guiConsumption = botFolder.add(params, 'consumption').min(0).max(0.01).step(0.000001).listen();

    guiSight.onChange((value) => { Bot.MANHATTAN_SIGHT = value; });
    guiMemory.onChange((value) => { Bot.MEMORY_LIMIT = value; });
    guiSpeed.onChange((value) => { Bot.SPEED = value; });
    guiInventory.onChange((value) => { Bot.INVENTORY_LIMIT = value; });
    guiReach.onChange((value) => { Bot.REACH_LENGTH = value; });
    guiConsumption.onChange((value) => { Bot.CONSUMPTION = value; });

    const rendererFolder = gui.addFolder('Renderer');
    rendererFolder.open();

    const guiLines = rendererFolder.add(params, 'lines').listen();

    guiLines.onChange((value) => { Renderer.DRAW_LINES = value; });
  }
}
export default Gui;
