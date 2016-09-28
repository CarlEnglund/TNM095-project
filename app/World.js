class World {
  constructor(elementId = 'application') {
    const parent = document.getElementById(elementId);
    this.element = document.createElement('canvas');
    parent.appendChild(this.element);
  }

  init() {
    console.log('booting world');
  }
}

export default World;
