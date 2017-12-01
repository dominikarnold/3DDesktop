class Node {
  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {visitor} visitor The visitor
   */
  accept(visitor)  {
  }
}

class GroupNode extends Node {
  /**
   * Constructor
   * @param  {Matrix} mat A matrix describing the node's transformation
   */
  constructor(mat) {
    super();
    this.matrix = mat;
    this.childs = []; // saves all childNodes
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {visitor} visitor The visitor
   */
  accept(visitor)  {
    visitor.visitGroupNode(this);
  }

  /**
   * Adds a child node
   * @param {Node} childNode The child node to add
   */
  add(childNode) {
    this.childs.push(childNode);
  }
}

class PhongBoxNode extends Node {
  /**
   * Creates a new Sphere with center and radius
   * @param  {Vector} center The center of the Sphere
   * @param  {number} radius The radius of the Sphere
   */
  constructor() {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {visitor} visitor The visitor
   */
  accept(visitor) {
    visitor.visitPhongBoxNode(this);
  }
}

class PhongSphereNode extends Node {
    /**
     * Creates a new Sphere with center and radius
     * @param  {Vector} center The center of the Sphere
     * @param  {number} radius The radius of the Sphere
     */
    constructor(latitudeBands, longtitudeBands, radius) {
        super();
        this.latitudeBands= latitudeBands;
        this.longtitudeBands =longtitudeBands;
        this.radius = radius;
    }

    /**
     * Accepts a visitor according to the visitor pattern
     * @param  {visitor} visitor The visitor
     */
    accept(visitor) {
        visitor.visitPhongSphereNode(this);
    }
}

class PhongPyramidNode extends Node {
    /**
     * Creates a new Sphere with center and radius
     * @param  {Vector} center The center of the Sphere
     * @param  {number} radius The radius of the Sphere
     */
    constructor() {
        super();
    }

    /**
     * Accepts a visitor according to the visitor pattern
     * @param  {visitor} visitor The visitor
     */
    accept(visitor) {
        visitor.visitPhongPyramidNode(this);
    }
}

class TextureBoxNode extends Node {
  /**
   * Creates a new Sphere with center and radius
   * @param  {Vector} center The center of the Sphere
   * @param  {number} radius The radius of the Sphere
   */
  constructor(imageSrc) {
    super();
    this.imageSrc = imageSrc; //bildquellle 
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {visitor} visitor The visitor
   */
  accept(visitor) {
    visitor.visitTextureBoxNode(this);
  }
}

class TexturePyramidNode extends Node {
    /**
     * Creates a new Sphere with center and radius
     * @param  {Vector} center The center of the Sphere
     * @param  {number} radius The radius of the Sphere
     */
    constructor(imageSrc) {
        super();
        this.imageSrc = imageSrc; //bildquellle
    }

    /**
     * Accepts a visitor according to the visitor pattern
     * @param  {visitor} visitor The visitor
     */
    accept(visitor) {
        visitor.visitTexturePyramidNode(this);
    }
}

class TextureSphereNode extends Node {
    /**
     * Creates a new Sphere with center and radius
     * @param  {Vector} center The center of the Sphere
     * @param  {number} radius The radius of the Sphere
     */
    constructor(latitudeBands, longtitudeBands, radius, imageSrc) {
        super();
        this.latitudeBands= latitudeBands;
        this.longtitudeBands =longtitudeBands;
        this.radius = radius;
        this.imageSrc = imageSrc;
    }

    /**
     * Accepts a visitor according to the visitor pattern
     * @param  {visitor} visitor The visitor
     */
    accept(visitor) {
        visitor.visitTextureSphereNode(this);
    }
}

class CameraNode extends Node {
    constructor(eye,center,up,fovy,aspect,near,far) {
        super();
        this.eye = eye;
        this.center = center;
        this.up = up;
        this.fovy =fovy;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        // this.lookat = Matrix.lookat(
        //     this.eye,
        //     this.center,
        //     this.up);
        // this.projection = Matrix.perspective(
        //     this.fovy,
        //     this.aspect,
        //     this.near,
        //     this.far
        // );
    }

    accept(visitor) {
        visitor.visitCameraNode(this);
    }


}

// class LightNode extends Node {
//     constructor (lightPos, lightInt) {
//         super();
//         this.lightPos = lightPos;
//         this.lightInt = lightInt;
//     }
//
//     accept(visitor) {
//         visitor.visitLightNode(this);
//     }
// }

class MeshNode extends Node{

    constructor (fIndex, fVert, fNorm, fUV, imageSrc) {
        super();
        this.fIndex = fIndex;
        this.fVert = fVert;
        this.fNorm = fNorm;
        this.fUV = fUV;
        this.imageSrc = imageSrc;

    }

    accept(visitor) {
        visitor.visitMeshNode(this);
    }
}

class PhongMeshNode extends Node{
    constructor() {
        super();
    }

    /**
     * Accepts a visitor according to the visitor pattern
     * @param  {visitor} visitor The visitor
     */
    accept(visitor) {
        visitor.visitPhongMeshNode(this);
    }
}


