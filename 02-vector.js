class Vector {
  /**
   * Create a vector
   * @param  {number} x The x component
   * @param  {number} y The y component
   * @param  {number} z The z component
   * @param  {number} w The w component
   * @return {number}   The resulting vector
   */
  constructor(x, y, z, w) {
    this.data = [x, y, z, w];
  }

  /**
   * Returns the x component of the vector
   * @return {number} The x component of the vector
   */
  get x() {
    return this.data[0];
  }

  /**
   * Sets the x component of the vector to val
   * @param  {number} val The new value
   */
  set x(val) {
    this.data[0] = val;
  }

  /**
   * Returns the first component of the vector
   * @return {number} The first component of the vector
   */
  get r() {
    return this.data[0];
  }

  /**
   * Sets the first component of the vector to val
   * @param  {number} val The new value
   */
  set r(val) {
    this.data[0] = val;
  }

  /**
   * Returns the y component of the vector
   * @return {number} The y component of the vector
   */
  get y() {
    return this.data[1];
  }

  /**
   * Sets the y component of the vector to val
   * @param  {number} val The new value
   */
  set y(val) {
    this.data[1] = val;
  }

  /**
   * Returns the second component of the vector
   * @return {number} The second component of the vector
   */
  get g() {
    return this.data[1];
  }

  /**
   * Sets the second component of the vector to val
   * @param  {number} val The new value
   */
  set g(val) {
    this.data[1] = val;
  }

  /**
   * Returns the z component of the vector
   * @return {number} The z component of the vector
   */
  get z() {
    return this.data[2];
  }

  /**
   * Sets the z component of the vector to val
   * @param  {number} val The new value
   */
  set z(val) {
    this.data[2] = val;
  }

  /**
   * Returns the third component of the vector
   * @return {number} The third component of the vector
   */
  get b() {
    return this.data[2];
  }

  /**
   * Sets the third component of the vector to val
   * @param  {number} val The new value
   */
  set b(val) {
    this.data[2] = val;
  }

  /**
   * Returns the w component of the vector
   * @return {number} The w component of the vector
   */
  get w() {
    return this.data[3];
  }

  /**
   * Sets the w component of the vector to val
   * @param  {number} val The new value
   */
  set w(val) {
    this.data[3] = val;
  }

  /**
   * Returns the fourth component of the vector
   * @return {number} The fourth component of the vector
   */
  get a() {
    return this.data[3];
  }

  /**
   * Sets the fourth component of the vector to val
   * @param  {number} val The new value
   */
  set a(val) {
    this.data[3] = val;
  }

  /**
   * Creates a new vector with the vector added
   * @param {Vector} other The vector to add
   */
  add(other) {
    if(other instanceof Vector) {
      var xAdd = this.x + other.x;
      var yAdd = this.y + other.y;
      var zAdd = this.z + other.z;
      var wAdd = this.w + other.w;

      return new Vector(xAdd, yAdd, zAdd, wAdd);

    } else {
      var xAdd = this.x + other;
      var yAdd = this.y + other;
      var zAdd = this.z + other;
      var wAdd = this.w + other;

      return new Vector(xAdd, yAdd, zAdd, wAdd);
    }
  }

  /**
   * Creates a new vector with the vector subtracted
   * @param {Vector} other The vector to subtract
   */
  sub(other) {
    if(other instanceof Vector) {
      var xAdd = this.x - other.x;
      var yAdd = this.y - other.y;
      var zAdd = this.z - other.z;
      var wAdd = this.w - other.w;

      return new Vector(xAdd, yAdd, zAdd, wAdd);

    } else {
      var xAdd = this.x - other;
      var yAdd = this.y - other;
      var zAdd = this.z - other;
      var wAdd = this.w - other;

      return new Vector(xAdd, yAdd, zAdd, wAdd);
    }
  }

  /**
   * Creates a new vector with the scalar multiplied
   * @param {number} other The scalar to multiply
   */
  mul(other) {
    if(other instanceof Vector) {
      var xAdd = this.x * other.x;
      var yAdd = this.y * other.y;
      var zAdd = this.z * other.z;
      var wAdd = this.w * other.w;

      return new Vector(xAdd, yAdd, zAdd, wAdd);

    } else {
      var xAdd = this.x * other;
      var yAdd = this.y * other;
      var zAdd = this.z * other;
      var wAdd = this.w * other;

      return new Vector(xAdd, yAdd, zAdd, wAdd);
    }
  }

  /**
   * Creates a new vector with the scalar divided
   * @param {number} other The scalar to divide
   */
  div(other) {
    if(other instanceof Vector) {
      var xAdd = this.x / other.x;
      var yAdd = this.y / other.y;
      var zAdd = this.z / other.z;
      var wAdd = this.w / other.w;

      return new Vector(xAdd, yAdd, zAdd, wAdd);

    } else {
      var xAdd = this.x / other;
      var yAdd = this.y / other;
      var zAdd = this.z / other;
      var wAdd = this.w / other;

      return new Vector(xAdd, yAdd, zAdd, wAdd);
    }
  }

  /**
   * Dot product
   * @param {Vector} other The vector to calculate the dot product with
   */
  dot(other) {
    // var ary2 = new Vector(other.x, other.y, other.z, other.w);
    //
    // // if (this.data.length != ary2.length) {
    // //   throw "can't find dot product: arrays have different lengths";
    // // }
    // var dotprod = 0;
    // for (var i = 0; i < this.data.length; i++) {
    //   dotprod += this.data[i] * ary2[i];
    // }
    // return dotprod;

    var sum = 0;
        var v = other.valueOf();
        for (var i = 0; i < 3; i++) {
            sum = sum + v[i] * this.data[i];
        }
        return sum;
  }

  /**
   * Cross product
   * @param {Vector} other The vector to calculate the cross product with
   */
  cross(other) {
  var  x = this.y * other.z - this.z * other.y;
  var  y = this.z * other.x - this.x * other.z;
  var  z = this.x * other.y - this.y * other.x;

    return new Vector(x, y, z, 0);
  }

  /**
   * Returns an array representation of the vector
   * @return {Array} An array representation.
   */
  valueOf() {
    return this.data;
  }

  /**
   * Creates a new vector by normalising the vector
   * @return {Vector} A vector with length 1
   */
  normalised() {
    return this.div(this.length);
  }

  /**
   * Compares the vector to another
   * @param  {Vector} other The vector to compare to.
   * @return {Boolean}       True if the vectors carry equal numbers. The fourth element may be both equivalent to undefined to still return true.
   */
  equals(other) {
    return (
      Math.abs(this.x - other.x) <= Number.EPSILON &&
      Math.abs(this.y - other.y) <= Number.EPSILON &&
      Math.abs(this.z - other.z) <= Number.EPSILON &&
      ((!this.w && !other.w) || Math.abs(this.w - other.w) <= Number.EPSILON)
    );
  }

  /**
   * Calculates the length of the vector
   * @return {number} Length of the vector
   */
  get length() {
    return Math.sqrt(this.dot(this));
  }
}
