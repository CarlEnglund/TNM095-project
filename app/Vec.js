/**
 * 2D vector
 */
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
}

export default Vec;
