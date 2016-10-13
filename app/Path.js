const Bot = require('./Bot.js');

class Path {
  /**
   * @param start {Vec} the starting point of the path
   */
  constructor(start) {
    if (!start) {
      throw new Error('Missing start point.');
    }

    this.cost = 0;
    this.points = [];
    this.start = start;
  }

  /**
   * add point to path
   * @param p {Vec}
   */
  addPoint(p) {
    // For some reason, Bot.default must be used here instead of just Bot.
    this.cost += Bot.default.calculateCost(p.delta(this.lastPoint));
    this.points.push(p.Copy());
  }

  get lastPoint() {
    return this.points[this.points.length - 1] || this.start;
  }

  get firstPoint() {
    return this.points[0];
  }

  /**
   * calculate cost per gained resource
   * @returns {number}
   */
  get result() {
    return (this.cost / this.points.length) || 0;
  }
}

export default Path;
