/**
 * 2D vector
 */

const EPSILON = 1e-10;

class Vec {
  /**
   * construct the coords, either by sending in an array of length 2 or an object {x: 0, y: 0}
   * @param coords [Object|Array]
   */
  constructor(coords = [0, 0]) {
    if (Array.isArray(coords)) {
      this.coords = coords;
    } else {
      this.coords = [coords.x, coords.y];
    }
  }

  /**
   * generate a random position with x and y as maximum values
   * @param y [Number]
   * @returns {Vec}
   * @constructor
   */
  static Random({ minX, minY, maxX, maxY }) {
    minX = minX || 0;
    minY = minY || 0;
    maxX = maxX || 1;
    maxY = maxY || 1;
    const coords = {
      x: (Math.random() * (maxX - minX)) + minX,
      y: (Math.random() * (maxY - minY)) + minY,
    };
    return new Vec(coords);
  }

  Copy() {
    return new Vec([this.x, this.y]);
  }

  get x() {
    return this.coords[0];
  }

  get y() {
    return this.coords[1];
  }

  set x(x) {
    this.coords[0] = x;
  }

  set y(y) {
    this.coords[1] = y;
  }

  /**
   * add content of `vec` to `this`
   * @param vec [Vec]
   */
  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }

  length() {
    return this.dist(new Vec());
  }

  /**
   * calculate the euclidean distance from `this` to `vec`
   * @param vec
   * @returns {number}
   */
  dist(vec) {
    return Math.sqrt(Math.pow(this.x + vec.x, 2) + Math.pow(this.y + vec.y, 2));
  }

  /**
   * calculate the manhattan distance from `this` to `vec`
   * @param vec {Vec}
   * @returns {number}
   */
  manhattan(vec) {
    return Math.abs(vec.x - this.x) + Math.abs(vec.y - this.y);
  }

  equals(vec) {
    return this.dist(vec) < EPSILON;
  }
}

export default Vec;
