const dat = require('dat.gui/build/dat.gui.js');
const Bot = require('./Bot.js');

class Gui {
  constructor() {
    const gui = new dat.GUI();
    const params = {
      speed: Bot.SPEED,
      reach: Bot.REACH_LENGTH,
      sight: Bot.MANHATTAN_SIGHT,
      inventory: Bot.INVENTORY_LIMIT,
    };
    const Folder = gui.addFolder('Bot Parameters');

    const guiSpeed = Folder.add(params, 'speed').min(0).max(5).step(0.1).listen();
    const guiReach = Folder.add(params, 'reach').min(1).max(50).step(1).listen();
    const guiSight = Folder.add(params, 'sight').min(1).max(500).step(1).listen();
    const guiInventory = Folder.add(params, 'inventory').min(0).max(50).step(1).listen();
    Folder.open();

    guiSpeed.onChange((value) => { Bot.SPEED = value; });
    guiReach.onChange((value) => { Bot.REACH_LENGTH = value; });
    guiSight.onChange((value) => { Bot.MANHATTAN_SIGHT = value; });
    guiInventory.onChange((value) => { Bot.INVENTORY_LIMIT = value; });
  }
}
export default Gui;
