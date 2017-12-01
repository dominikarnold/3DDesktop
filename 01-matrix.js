class Matrix {
  /**
   * Constructor of the matrix. Expects an array in row-major layout. Saves the data as column major internally.
   * @param  {Array.<Number>} mat Matrix values row major
   */
  constructor(mat){
    this.data = new Float32Array(16);
    for(var row = 0; row < 4; row++) {
      for(var col = 0; col < 4; col++) {
        this.data[row*4+col] = mat[col*4+row];
      }
    }
  }

  /**
   * Returns the value of the matrix at position row, col
   * @param  {Number} row The value's row
   * @param  {Number} col The value's column
   * @return {Number}     The requested value
   */
  getVal(row, col) {
    return this.data[col*4+row];
  }

  /**
   * Sets the value of the matrix at position row, col
   * @param {Number} row The value's row
   * @param {Number} val The value to set to
   * @param {Number} col The value's column
   */
  setVal(row, col, val) {
    this.data[col*4+row] = val;
  }

  /**
   * Returns a matrix that represents a translation
   * @param  {Vector} translation The translation vector that shall be expressed by the matrix
   * @return {Matrix}             The resulting translation matrix
   */
  static translation(translation) {
    return new Matrix([
    1, 0, 0, translation.x,
    0, 1, 0, translation.y,
    0, 0, 1, translation.z,
    0, 0, 0, 1
  ]);
  }

  /**
   * Returns a matrix that represents a rotation. The rotation axis is either the x, y or z axis (either x, y, z is 1).
   * @param  {Vector} axis  The axis to rotate around
   * @param  {Number} angle The angle to rotate
   * @return {Matrix}       The resulting rotation matrix
   */
  static rotation(axis, angle) {
    if(axis.x > 0 ) {
    return new Matrix([
      1, 0, 0, 0,
      0, Math.cos(angle), -(Math.sin(angle)), 0,
      0, Math.sin(angle), Math.cos(angle), 0,
      0, 0, 0, 1
    ])
  } else if(axis.y > 0) {
    return new Matrix([
      Math.cos(angle), 0, Math.sin(angle), 0,
      0, 1, 0, 0,
      -(Math.sin(angle)), 0, Math.cos(angle), 0,
      0, 0, 0, 1
    ])
  } else if(axis.z > 0) {
    return new Matrix([
      Math.cos(angle), -(Math.sin(angle)), 0, 0,
      Math.sin(angle), Math.cos(angle), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }
}

  /**
   * Returns a matrix that represents a scaling
   * @param  {Vector} scale The amount to scale in each direction
   * @return {Matrix}       The resulting scaling matrix
   */
  static scaling(scale) {
    return new Matrix([
      scale.x, 0, 0, 0,
      0, scale.y, 0, 0,
      0, 0, scale.z, 0,
      0, 0, 0, 1
    ])
  }

  /**
   * Constructs a lookat matrix
   * @param  {Vector} eye    The position of the viewer
   * @param  {Vector} center The position to look at
   * @param  {Vector} up     The up direction
   * @return {Matrix}        The resulting lookat matrix
   */
  static lookat(eye, center, up) {
    var F = center.sub(eye);
  var f = F.normalised();
  var UP = up.normalised();
  var s = f.cross(up);
  var S = s.normalised();
  var u = S.cross(f);

  var lookat = new Matrix([
    s.x, s.y, s.z, 0,
    u.x, u.y, u.z, 0,
    (-f.x), (-f.y), (-f.z), 0,
    0, 0, 0, 1
  ]);

  var eyeNegativ = eye.mul(-1);

  var glTranslated = Matrix.translation(eyeNegativ);
  return lookat.mul(glTranslated);
  }

  /**
   * Constructs a new matrix that represents a projection normalisation transformation
   * @param  {Number} left   Camera-space left value of lower near point
   * @param  {Number} right  Camera-space right value of upper right far point
   * @param  {Number} bottom Camera-space bottom value of lower lower near point
   * @param  {Number} top    Camera-space top value of upper right far point
   * @param  {Number} near   Camera-space near value of lower lower near point
   * @param  {Number} far    Camera-space far value of upper right far point
   * @return {Matrix}        The rotation matrix
   */
  static frustrum(left, right, bottom, top, near, far) {
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = (far+near)/(far-near);
    var D = (far*2*near)/(far-near);


    return new Matrix([
      (near*2)/(right-left), 0, A, 0,
      0, (near*2)/(top-bottom), B, 0,
      0, 0, C, D,
      0, 0, -1, 0
    ]);
  }

  /**
   * Constructs a new matrix that represents a projection normalisation transformation.
   * @param  {Number} fovy   Field of view in y-direction
   * @param  {Number} aspect Aspect ratio between width and height
   * @param  {Number} near   Camera-space distance to near plane
   * @param  {Number} far    Camera-space distance to far plane
   * @return {Matrix}        The resulting matrix
   */
  static perspective(fovy, aspect, near, far) {
    var f = (1/Math.tan(fovy))/2;
  return new Matrix([
    f/aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near+far)/(near-far), (2*far*near)/(near-far),
    0, 0, -1, 0
  ]);
  }

  /**
   * Returns the identity matrix
   * @return {Matrix} A new identity matrix
   */
  static identity() {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * Matrix multiplication
   * @param  {Matrix|Vector} other The matrix or vector to multiplicate with
   * @return {Matrix|Vector}       The result of the multiplication this*other
   */
   mul(other) {
     if(other instanceof Matrix) {
       var mulMat = new Matrix([
         1, 0, 0, 0,
         0, 1, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1
       ]);
       //iteriere durch Row
       for (var i = 0; i < 4; i++){
         //iteriere durch Col
         for (var j = 0; j < 4; j++){
           var val = 0;

           for (var k = 0; k < 4; k++){
             val += this.getVal(i,k) * other.getVal(k,j);


           }
           mulMat.setVal(i,j,val);
         }

       }
       return mulMat;
     } else { // other is vector
       var otherVec = other.valueOf();
       var values = [0,0,0,0];

       for (var i = 0; i < 4; i++){

         for (var k = 0; k< 4; k++){
           values[i] += this.getVal(i,k)* otherVec[k];

         }
       }
       return new Vector(values[0], values[1], values[2],values[3]);
     }
   }

  /**
   * Returns the transpose of this matrix
   * @return {Matrix} A new matrix that is the transposed of this
   */
  transpose() {
    //über die Diagonale spiegeln, mit loops, colum und row coordinate vertauschen
    //inverse einzeltransformationen verechnen (gehört nicht hierhin)
    var t = Matrix.identity();
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        t.setVal(i, j, this.getVal(j, i));
      }
    }
    return t;
  }

  /**
   * Debug print to console
   */
  print() {
    for(var row = 0; row < 4; row++) {
      console.log("> " + this.getVal(row, 0) +
        "\t" + this.getVal(row, 1) +
        "\t" + this.getVal(row, 2) +
        "\t" + this.getVal(row, 3)
      );
    }
  }

  /**
   * Returns a new matrix that is the inverse of this matrix
   * @return {Matrix} The inverse matrix
   */
  invert() {
    let mat = this.data;
    let dst = new Float32Array(16);//ret.getValues();
    let tmp = new Float32Array(12);

    /* temparray for pairs */
    let src = new Float32Array(16);//new float[16];

    /* array of transpose source matrix */
    let det;

    /* determinant */
    /*
     * transpose matrix
     */
    for (let i = 0; i < 4; i++) {
      src[i] = mat[i * 4];
      src[i + 4] = mat[i * 4 + 1];
      src[i + 8] = mat[i * 4 + 2];
      src[i + 12] = mat[i * 4 + 3];
    }

    /* calculate pairs for first 8 elements (cofactors) */
    tmp[0] = src[10] * src[15];
    tmp[1] = src[11] * src[14];
    tmp[2] = src[9] * src[15];
    tmp[3] = src[11] * src[13];
    tmp[4] = src[9] * src[14];
    tmp[5] = src[10] * src[13];
    tmp[6] = src[8] * src[15];
    tmp[7] = src[11] * src[12];
    tmp[8] = src[8] * src[14];
    tmp[9] = src[10] * src[12];
    tmp[10] = src[8] * src[13];
    tmp[11] = src[9] * src[12];

    /* calculate first 8 elements (cofactors) */
    dst[0] = tmp[0] * src[5] + tmp[3] * src[6] + tmp[4] * src[7];
    dst[0] -= tmp[1] * src[5] + tmp[2] * src[6] + tmp[5] * src[7];
    dst[1] = tmp[1] * src[4] + tmp[6] * src[6] + tmp[9] * src[7];
    dst[1] -= tmp[0] * src[4] + tmp[7] * src[6] + tmp[8] * src[7];
    dst[2] = tmp[2] * src[4] + tmp[7] * src[5] + tmp[10] * src[7];
    dst[2] -= tmp[3] * src[4] + tmp[6] * src[5] + tmp[11] * src[7];
    dst[3] = tmp[5] * src[4] + tmp[8] * src[5] + tmp[11] * src[6];
    dst[3] -= tmp[4] * src[4] + tmp[9] * src[5] + tmp[10] * src[6];
    dst[4] = tmp[1] * src[1] + tmp[2] * src[2] + tmp[5] * src[3];
    dst[4] -= tmp[0] * src[1] + tmp[3] * src[2] + tmp[4] * src[3];
    dst[5] = tmp[0] * src[0] + tmp[7] * src[2] + tmp[8] * src[3];
    dst[5] -= tmp[1] * src[0] + tmp[6] * src[2] + tmp[9] * src[3];
    dst[6] = tmp[3] * src[0] + tmp[6] * src[1] + tmp[11] * src[3];
    dst[6] -= tmp[2] * src[0] + tmp[7] * src[1] + tmp[10] * src[3];
    dst[7] = tmp[4] * src[0] + tmp[9] * src[1] + tmp[10] * src[2];
    dst[7] -= tmp[5] * src[0] + tmp[8] * src[1] + tmp[11] * src[2];

    /* calculate pairs for second 8 elements (cofactors) */
    tmp[0] = src[2] * src[7];
    tmp[1] = src[3] * src[6];
    tmp[2] = src[1] * src[7];
    tmp[3] = src[3] * src[5];
    tmp[4] = src[1] * src[6];
    tmp[5] = src[2] * src[5];
    tmp[6] = src[0] * src[7];
    tmp[7] = src[3] * src[4];
    tmp[8] = src[0] * src[6];
    tmp[9] = src[2] * src[4];
    tmp[10] = src[0] * src[5];
    tmp[11] = src[1] * src[4];

    /* calculate second 8 elements (cofactors) */
    dst[8] = tmp[0] * src[13] + tmp[3] * src[14] + tmp[4] * src[15];
    dst[8] -= tmp[1] * src[13] + tmp[2] * src[14] + tmp[5] * src[15];
    dst[9] = tmp[1] * src[12] + tmp[6] * src[14] + tmp[9] * src[15];
    dst[9] -= tmp[0] * src[12] + tmp[7] * src[14] + tmp[8] * src[15];
    dst[10] = tmp[2] * src[12] + tmp[7] * src[13] + tmp[10] * src[15];
    dst[10] -= tmp[3] * src[12] + tmp[6] * src[13] + tmp[11] * src[15];
    dst[11] = tmp[5] * src[12] + tmp[8] * src[13] + tmp[11] * src[14];
    dst[11] -= tmp[4] * src[12] + tmp[9] * src[13] + tmp[10] * src[14];
    dst[12] = tmp[2] * src[10] + tmp[5] * src[11] + tmp[1] * src[9];
    dst[12] -= tmp[4] * src[11] + tmp[0] * src[9] + tmp[3] * src[10];
    dst[13] = tmp[8] * src[11] + tmp[0] * src[8] + tmp[7] * src[10];
    dst[13] -= tmp[6] * src[10] + tmp[9] * src[11] + tmp[1] * src[8];
    dst[14] = tmp[6] * src[9] + tmp[11] * src[11] + tmp[3] * src[8];
    dst[14] -= tmp[10] * src[11] + tmp[2] * src[8] + tmp[7] * src[9];
    dst[15] = tmp[10] * src[10] + tmp[4] * src[8] + tmp[9] * src[9];
    dst[15] -= tmp[8] * src[9] + tmp[11] * src[10] + tmp[5] * src[8];

    /* calculate determinant */
    det = src[0] * dst[0] + src[1] * dst[1] + src[2] * dst[2] + src[3] * dst[3];

    if (det == 0.0) {
      throw new Error("singular matrix is not invertible");
    }

    /* calculate matrix inverse */
    det = 1 / det;

    for (let j = 0; j < 16; j++) {
      dst[j] *= det;
    }

    let ret = Matrix.identity();
    ret.data = dst;
    return ret;
  }
}
