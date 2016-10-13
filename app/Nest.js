const Vec = require('./Vec.js');
const Resource = require('./Resource.js');

class Nest {
  constructor(position, color) {
    this.position = position;
    this.resources = [new Resource(new Vec(), 10)];
    this.timeout = [];
    this.creationAvailable = true;
    this.nestCreationAvailable = true;
    this.color = color;
  }

  update(world) {
    if (this.resources.length) {
      this.consumeResource();
      // setTimeout(this.createBots.bind(world, this), 5000);
    }

    if (this.canCreateBot) {
      this.startBotCreation(world);
    }

    /* if (this.canCreateNest) {
      this.startNestCreation(world);
    } */
  }

  get style() {
    return this.color;
  }

  get canCreateBot() {
    const resources = this.availableResources;
    const margin = 6 * Nest.BOT_COST;
    return this.creationAvailable && resources > margin;
  }

  get canCreateNest() {
    const resources = this.availableResources;
    const margin = 6 * Nest.NEST_COST;
    return this.nestCreationAvailable && resources > margin;
  }

  /**
   * start creating a bot
   * @param world {World}
   */
  startBotCreation(world) {
    this.creationAvailable = false;
    setTimeout(this.createBot.bind(this, world), this.creationTime);
  }

  startNestCreation(world) {
    this.nestCreationAvailable = false;
    setTimeout(this.createNest.bind(this, world), Nest.NEST_CREATION_TIME);
  }

  createBot(world) {
    const consumed = this.consumeResource(Nest.BOT_COST);
    if (consumed !== Nest.BOT_COST) {
      console.warn('Failed creating a bot, only consumed', consumed, 'resources. Expected', Nest.BOT_COST);
      this.lastResource.resourceLevel += consumed;
      return;
    }
    world.createBots(this, this.color);
    this.creationAvailable = true;
  }

  createNest(world) {
    console.log('Creating Nest!!!');
    const consumed = this.consumeResource(Nest.NEST_COST);
    if (consumed !== Nest.NEST_COST) {
      console.warn('Failed creating a Nest, only consumed', consumed, 'resources. Expected', Nest.NEST_COST);
      this.lastResource.resourceLevel += consumed;
      return;
    }

    world.createNest(this);
    this.nestCreationAvailable = true;

  }
  get size() {
    const size = this.availableResources;
    return new Vec([size, size]);
  }

  removeResourceFromNest() {
    this.resources.pop();
  }

  addResource(resource) {
    this.resources.push(resource);
  }

  get info () {
    return {
      position: `(${Math.round(this.position.x)}, ${Math.round(this.position.y)})`,
      resources: this.resources.length,
      resourceLevel: this.availableResources,
      status: this.creationAvailable ? 'creating' : 'idle',
    };
  }

  get availableResources() {
    return this.resources.reduce((prev, r) => prev + r.resourceLevel, 0);
  }

  /**
   * consume resources from this nest's inventory
   * @param amount {number} how much to consume
   * @returns {number} what actually was consumed, 0 if `amount` isn't available
   */
  consumeResource(amount = Nest.COMSUMPTION) {
    if (this.availableResources < amount) return 0;

    // see that the last resource has enough amount
    const levelDiff = this.lastResource.resourceLevel - amount;
    if (levelDiff > 0) {
      this.lastResource.resourceLevel -= amount;
      return amount;
    } else {
      // pop last resource, call this method again to consume the rest of the wanted resources
      this.resources.pop();
      const leftOvers = Math.abs(levelDiff);
      return (amount - leftOvers) + this.consumeResource(leftOvers);
    }
  }

  get lastResource() {
    return this.resources[this.resources.length - 1];
  }

  refuel(bot) {
    const consumed = this.consumeResource(this.refuelAmount);
    if (consumed !== this.refuelAmount) {
      this.lastResource.resourceLevel += consumed;
      return;
    }

    bot.life += consumed;
  }

  get refuelAmount() {
    return this.botRefuelingAmont || Nest.BOT_REFUEL;
  }

  get creationTime() {
    return this.botCreationTime || Nest.BOT_CREATION_TIME;
  }
}

Nest.COMSUMPTION = 0.005;
Nest.BOT_COST = 6;
Nest.NEST_COST = 10;
Nest.BOT_CREATION_TIME = 5000;
Nest.BOT_REFUEL = 1;
Nest.NEST_CREATION_TIME = 10000;


export default Nest;
