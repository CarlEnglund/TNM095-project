const dat = require('dat.gui/build/dat.gui.js');
const Bot = require('./Bot.js');
const Renderer = require('./Renderer.js');
const Control = require('./Control.js');

class Gui {
  constructor() {
    this.gui = this.setupDat();
    this.debugInfo = this.setupDebugInfo();
    this.infoObjects = [];
  }

  setupDat() {
    const gui = new dat.GUI();
    const params = {
      sight: Bot.MANHATTAN_SIGHT,
      memory: Bot.MEMORY_LIMIT,
      speed: Bot.SPEED,
      inventory: Bot.INVENTORY_LIMIT,
      reach: Bot.REACH_LENGTH,
      consumption: Bot.CONSUMPTION,
      lines: Renderer.DRAW_LINES,
      clickAction: Control.default.ON_CLICK,
    };

    const controlFolder = gui.addFolder('Control');
    controlFolder.open();

    const guiLines = controlFolder.add(params, 'lines').listen();
    const guiClick = controlFolder.add(params, 'clickAction', ['none', 'resource', 'nest']).listen();

    guiLines.onChange((value) => { Renderer.DRAW_LINES = value; });
    guiClick.onChange((value) => { Control.default.ON_CLICK = value; });

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

    return gui;
  }

  setupDebugInfo() {
    const debugInfo = this.gui.addFolder('Debug info');
    debugInfo.open();
    return debugInfo;
  }

  addInfo(object) {
    const name = `${object.constructor.name} (#${Math.floor(Math.random() * 10000)})`;
    const folder = this.debugInfo.addFolder(name);
    this.infoObjects.push({ folder, object });
    const { info } = object;
    Object.keys(info).forEach(param => folder.add(info, param));
  }

  update(world) {
    this.infoObjects.forEach((entry) => {
      const { folder } = entry;
      const { info } = entry.object;
      for (var i in folder.__controllers) {
        const param = folder.__controllers[i];
        param.setValue(info[param.property]);
      }
    });

    const knownObjects = this.infoObjects.map(o => o.object);
    const infoObjects = world.nests.concat(world.bots);
    infoObjects.filter(b => !knownObjects.includes(b)).forEach(b => this.addInfo(b));
  }
}
export default Gui;
