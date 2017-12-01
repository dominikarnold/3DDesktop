class Visitor {
  visitGroupNode(node) {
  }

  visitPhongBoxNode(node) {
  }

  visitTextureBoxNode(node) {
  }

  visitPhongSphereNode (node) {

  }

  visitPhongPyramidNode (node) {

  }

  visitLightNode (node) {
  }

  visitTexturePyramidNode (node) {

  }

  visitCameraNode (node) {

  }
    visitMeshNode(node){

    }
}

class RasterVisitor extends Visitor {
    constructor(gl, rootNode) {
        super();
        this.root = rootNode;
        this.gl = gl;
        this.phongShader = new Shader(gl, "phongvs", "phongfs");
        this.textureShader = new Shader(gl, "texturevs", "texturefs");

        // TODO
        //?
        this.transformations = [Matrix.identity()];
    }

    draw() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.lookat = Matrix.lookat(
            this.camera.eye,
            this.camera.center,
            this.camera.up);
        this.projection = Matrix.perspective(
            this.camera.fovy,
            this.camera.aspect,
            this.camera.near,
            this.camera.far
        );

        this.root.accept(this);
    }

    visitGroupNode(node) {
        var newMatrix = this.transformations[this.transformations.length - 1].mul(node.matrix);
        this.transformations.push(newMatrix);

        for (var i = 0; i < node.childs.length; i++) {
            node.childs[i].accept(this);
        }
        this.transformations.pop(); // entfernt seine transformation sobald diese Ebene im Baum durchlaufen ist
    }

    visitCameraNode(node) {
        var mat = this.transformations[this.transformations.length-1];
        this.camera.eye= mat.mul(node.eye);
        this.camera.center= mat.mul(node.center);
        this.camera.up = node.up;
        this.camera.fovy = node.fovy;
        this.camera.aspect = node.aspect;
        this.camera.near = node.near;
        this.camera.far = node.far;
    }

    visitLightNode (node) {


        // this.phongShader.uniform3fv(gl.getUniformLocation(this.phongShader, "lightPos"), vec3(node.lightPos));

      //  this.phongShader.getUniformVec3("lightPos").set(new Vector (node.lightPos.x,node.lightPos.y,node.lightPos.z));
      //  this.phongShader.getUniformVec3("lightInt").set(node.valueOf());

        this.phongShader.use();
        this.phongShader.getUniformMatrix("P").set(this.projection);
        this.phongShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        mat = this.transformations[this.transformations.length - 1];
        this.phongShader.getUniformMatrix("M").set(mat);

        // Set the normal matrix
        this.phongShader.getUniformMatrix("N").set(this.lookat.mul(mat).invert().transpose());

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.vertexBuffer) {
            this.createSphereBuffer(node, node.latitudeBands, node.longtitudeBands, node.radius);

        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind color buffer and normal buffer to
        // their attributes in the shader
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.colorBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_color"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.normalBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_normal"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.indexBuffer);

        this.gl.drawElements(gl.TRIANGLES, node.elements, gl.UNSIGNED_SHORT, 0);
    }



    visitPhongBoxNode(node) {
        this.phongShader.use();
        this.phongShader.getUniformMatrix("P").set(this.projection);
        this.phongShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        // TODO
        //?
        mat = this.transformations[this.transformations.length - 1];
        this.phongShader.getUniformMatrix("M").set(mat);

        // Set the normal matrix
        // TODO //neu M,V,P da --> N setzen
        //?
        this.phongShader.getUniformMatrix("N").set(this.lookat.mul(mat).invert().transpose());

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.vertexBuffer) {
            this.createCubeVertexBuffer(node);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind color buffer and normal buffer to
        // their attributes in the shader
        // TODO //bekannt auf dimensionen der vektoren achten
        //?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.colorBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_color"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.normalBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_normal"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, node.elements);
    }

    visitPhongPyramidNode(node){
        this.phongShader.use();
        this.phongShader.getUniformMatrix("P").set(this.projection);
        this.phongShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        // TODO
        //?
        mat = this.transformations[this.transformations.length - 1];
        this.phongShader.getUniformMatrix("M").set(mat);

        // Set the normal matrix
        // TODO //neu M,V,P da --> N setzen
        //?
        this.phongShader.getUniformMatrix("N").set(this.lookat.mul(mat).invert().transpose());

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.vertexBuffer) {
            this.createPyramidVertexBuffer(node);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind color buffer and normal buffer to
        // their attributes in the shader
        // TODO //bekannt auf dimensionen der vektoren achten
        //?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.colorBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_color"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.normalBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_normal"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, node.elements);

    }
    visitPhongSphereNode(node) {
        this.phongShader.use();
        this.phongShader.getUniformMatrix("P").set(this.projection);
        this.phongShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        mat = this.transformations[this.transformations.length - 1];
        this.phongShader.getUniformMatrix("M").set(mat);

        // Set the normal matrix
        this.phongShader.getUniformMatrix("N").set(this.lookat.mul(mat).invert().transpose());

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.vertexBuffer) {
            this.createSphereBuffer(node, node.latitudeBands, node.longtitudeBands, node.radius);

        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind color buffer and normal buffer to
        // their attributes in the shader
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.colorBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_color"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.normalBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_normal"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.indexBuffer);

        this.gl.drawElements(gl.TRIANGLES, node.elements, gl.UNSIGNED_SHORT, 0);
    }

    visitTextureBoxNode(node) {
        this.textureShader.use();
        this.textureShader.getUniformMatrix("P").set(this.projection);
        this.textureShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        // TODO
        mat = this.transformations[this.transformations.length - 1];
        this.textureShader.getUniformMatrix("M").set(mat);

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.texture) {
            this.createCubeVertexBuffer(node);
            this.createTextureBuffers(node);
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind the texture coordinates in node.texCoords
        // to their attribute in the shader
        // TODO //uv zeug übertragen
        //?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.texCoords);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_texCoord"), 2, this.gl.FLOAT, false, 0, 0);


        this.gl.activeTexture(gl.TEXTURE0);
        this.gl.bindTexture(gl.TEXTURE_2D, node.texture);
        this.textureShader.getUniformInt("sampler").set(0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, node.elements);
    }


    visitTexturePyramidNode(node) {
        this.textureShader.use();
        this.textureShader.getUniformMatrix("P").set(this.projection);
        this.textureShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        // TODO
        mat = this.transformations[this.transformations.length - 1];
        this.textureShader.getUniformMatrix("M").set(mat);

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.texture) {
            this.createPyramidVertexBuffer(node);
            this.createTextureBuffers(node);
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind the texture coordinates in node.texCoords
        // to their attribute in the shader
        // TODO //uv zeug übertragen
        //?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.texCoords);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_texCoord"), 2, this.gl.FLOAT, false, 0, 0);


        this.gl.activeTexture(gl.TEXTURE0);
        this.gl.bindTexture(gl.TEXTURE_2D, node.texture);
        this.textureShader.getUniformInt("sampler").set(0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, node.elements);
    }

    visitTextureSphereNode(node) {
        this.textureShader.use();
        this.textureShader.getUniformMatrix("P").set(this.projection);
        this.textureShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        // TODO
        mat = this.transformations[this.transformations.length - 1];
        this.textureShader.getUniformMatrix("M").set(mat);

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.texture) {
            this.createSphereBuffer(node, node.latitudeBands, node.longtitudeBands, node.radius);
            this.createTextureBuffers(node);
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind the texture coordinates in node.texCoords
        // to their attribute in the shader
        // TODO //uv zeug übertragen
        //?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.texCoords);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_texCoord"), 2, this.gl.FLOAT, false, 0, 0);


        this.gl.activeTexture(gl.TEXTURE0);
        this.gl.bindTexture(gl.TEXTURE_2D, node.texture);

        this.textureShader.getUniformInt("sampler").set(0);

        this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.indexBuffer);

        this.gl.drawElements(gl.TRIANGLES, node.elements, gl.UNSIGNED_SHORT, 0);
    }

    createTextureBuffers(node) {
        let gl = this.gl;
        let cubeTexture = gl.createTexture();
        let cubeImage = new Image();
        cubeImage.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, cubeTexture); // textur an grafikarte binden
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImage); //welches bild, welcher Farbmodus
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //filterung, verhalten der textur am rand
            gl.bindTexture(gl.TEXTURE_2D, null); //textur auf null setzten, im moment nicht verwenden
        };
        cubeImage.src = node.imageSrc;
        node.texture = cubeTexture;

        let uv = [ //name uv hat keine bedeutung , texturkoordinaten, welcher teil der textur wird wo auf den polygonen angezeigt , jeder uv wert hat 2 koordinaten
            // front
            0, 0, 1, 0, 1, 1,
            1, 1, 0, 1, 0, 0,
            // back
            0, 0, 1, 0, 1, 1,
            1, 1, 0, 1, 0, 0,
            // right
            0, 0, 1, 0, 1, 1,
            1, 1, 0, 1, 0, 0,
            // top
            0, 0, 1, 0, 1, 1,
            1, 1, 0, 1, 0, 0,
            // left
            0, 0, 1, 0, 1, 1,
            1, 1, 0, 1, 0, 0,
            // bottom
            0, 0, 1, 0, 1, 1,
            1, 1, 0, 1, 0, 0,
        ];
        let uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv),
            gl.STATIC_DRAW);
        node.texCoords = uvBuffer;
    }



    createCubeVertexBuffer(node) {
        //
        //     6 ------- 7
        //   / |       / |
        //  3 ------- 2  |
        //  |  |      |  |
        //  |  5 -----|- 4
        //  | /       | /
        //  0 ------- 1
        //
        let vertices = [
            // front
            -1, -1, 1, 1, -1, 1, 1, 1, 1, //3 Eckpunkte (jeweils 3 Koordinaten) für farbwerte vertices array kopieren und für -1 immer 0 einsetzen.
            1, 1, 1, -1, 1, 1, -1, -1, 1,
            // back
            1, -1, -1, -1, -1, -1, -1, 1, -1,
            -1, 1, -1, 1, 1, -1, 1, -1, -1,
            // right
            1, -1, 1, 1, -1, -1, 1, 1, -1,
            1, 1, -1, 1, 1, 1, 1, -1, 1,
            // top
            -1, 1, 1, 1, 1, 1, 1, 1, -1,
            1, 1, -1, -1, 1, -1, -1, 1, 1,
            // left
            -1, -1, -1, -1, -1, 1, -1, 1, 1,
            -1, 1, 1, -1, 1, -1, -1, -1, -1,
            // bottom
            -1, -1, -1, 1, -1, -1, 1, -1, 1,
            1, -1, 1, -1, -1, 1, -1, -1, -1
        ];

        let normals = [
            // front
            0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, 0, 1, 0, 0, 1, 0, 0, 1,
            // back
            0, 0, -1, 0, 0, -1, 0, 0, -1,
            0, 0, -1, 0, 0, -1, 0, 0, -1,
            // right
            1, 0, 0, 1, 0, 0, 1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0,
            // top
            0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0,
            // left
            -1, 0, 0, -1, 0, 0, -1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0,
            // bottom
            0, -1, 0, 0, -1, 0, 0, -1, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0
        ];
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        node.vertexBuffer = vertexBuffer;
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        node.normalBuffer = normalBuffer;
        node.elements = vertices.length / 3;

        // Color buffer

        let colors = [
            // front
            0, 0, 1, 1, 0, 1, 1, 1, 1, //3 Eckpunkte (jeweils 3 Koordinaten) für farbwerte vertices array kopieren und für -1 immer 0 einsetzen.
            1, 1, 1, 0, 1, 1, 0, 0, 1,
            // back
            1, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 1, 0, 1, 1, 0, 1, 0, 0,
            // right
            1, 0, 1, 1, 0, 0, 1, 1, 0,
            1, 1, 0, 1, 1, 1, 1, 0, 1,
            // top
            0, 1, 1, 1, 1, 1, 1, 1, 0,
            1, 1, 0, 0, 1, 0, 0, 1, 1,
            // left
            0, 0, 0, 0, 0, 1, 0, 1, 1,
            0, 1, 1, 0, 1, 0, 0, 0, 0,
            // bottom
            0, 0, 0, 1, 0, 0, 1, 0, 1,
            1, 0, 1, 0, 0, 1, 0, 0, 0
        ];
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        node.colorBuffer = colorBuffer;
    }

    createPyramidVertexBuffer(node) {
        //
        //     6 ------- 7
        //   / |       / |
        //  3 ------- 2  |
        //  |  |      |  |
        //  |  5 -----|- 4
        //  | /       | /
        //  0 ------- 1
        //
        let vertices = [
            // front
            0, 1, 0,   //3 Eckpunkte (jeweils 3 Koordinaten) für farbwerte vertices array kopieren und für -1 immer 0 einsetzen.
            -1, -1, 1,
            1, -1, 1,

            // back
            0, 1, 0,
            1, -1, 1,
            1, -1, -1,

            // right
            0, 1, 0,
            1, -1, -1,
            -1, -1, -1,


            // top
            0, 1, 0,
            -1, -1, -1,
            -1, -1, 1,

            // bottom
            -1, -1, -1, 1, -1, -1, 1, -1,  1,
            1, -1,  1, -1, -1,  1, -1, -1, -1,

        ];

        let normals = [
            // front
            0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, 0, 1, 0, 0, 1, 0, 0, 1,
            // back
            0, 0, -1, 0, 0, -1, 0, 0, -1,
            0, 0, -1, 0, 0, -1, 0, 0, -1,
            // right
            1, 0, 0, 1, 0, 0, 1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0,
            // top
            0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0,
            // left
            -1, 0, 0, -1, 0, 0, -1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0,
            // bottom
            0, -1, 0, 0, -1, 0, 0, -1, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0

        ];
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        node.vertexBuffer = vertexBuffer;
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        node.normalBuffer = normalBuffer;
        node.elements = vertices.length / 3;

        // Color buffer

        let colors = [
            // front
            0, 1, 0,   //3 Eckpunkte (jeweils 3 Koordinaten) für farbwerte vertices array kopieren und für -1 immer 0 einsetzen.
            0, 0, 1,
            1, 0, 1,

            // back
            0, 1, 0,
            1, 0, 1,
            1, 0, 0,

            // right
            0, 1, 0,
            1, 0, 0,
            0, 0, 0,


            // top
            0, 1, 0,
            0, 0, 0,
            0, 0, 1,

            // bottom
            0, 0, 0, 1, 0, 0, 1, 0,  1,
            1, 0,  1, 0, 0,  1, 0, 0, 0,


        ];
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        node.colorBuffer = colorBuffer;
    }

    createSphereBuffer(node, latitudeBands, longitudeBands, radius) {
        var sphereVertexPositionBuffer;
        var sphereVertexNormalBuffer;
        var sphereVertexIndexBuffer;
        var sphereVertexTextureCoordBuffer;
        //var latitudeBands = 30;
        //var longitudeBands = 30;
        //var radius = 2;
        var vertexPositionData = [];
        var normalData = [];
        var textureCoordData = [];
        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);
                normalData.push(x);
                normalData.push(y);
                normalData.push(z);
                vertexPositionData.push(radius * x);
                vertexPositionData.push(radius * y);
                vertexPositionData.push(radius * z);
            }
        }
        var indexData = [];
        for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);
                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }
        sphereVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
        node.normalBuffer = sphereVertexNormalBuffer;
        sphereVertexNormalBuffer.itemSize = 3;
        sphereVertexNormalBuffer.numItems = normalData.length / 3;

        sphereVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
        node.texCoords = sphereVertexTextureCoordBuffer;
        sphereVertexTextureCoordBuffer.itemSize = 2;
        sphereVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

        sphereVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
        node.vertexBuffer = sphereVertexPositionBuffer;
        sphereVertexPositionBuffer.itemSize = 3;
        sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;

        sphereVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
        node.indexBuffer = sphereVertexIndexBuffer;
        sphereVertexIndexBuffer.itemSize = 1;
        sphereVertexIndexBuffer.numItems = indexData.length;
        node.elements = indexData.length;

        var colorData = vertexPositionData;
        for (var i = 0; i < colorData.length; i++) {
            if (colorData[i] === -1) {
                colorData [i] = 0;
            }
        }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
        node.colorBuffer = colorBuffer;
    }

    visitMeshNode(node) {
        this.textureShader.use();
        this.textureShader.getUniformMatrix("P").set(this.projection);
        this.textureShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        // TODO
        mat = this.transformations[this.transformations.length - 1];
        this.textureShader.getUniformMatrix("M").set(mat);



        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.texture) {
            //  this.createCubeVertexBuffer(node);
            this.createTextureBuffers(node);
            this.createMeshVertexBuffer(node);

        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind the texture coordinates in node.texCoords
        // to their attribute in the shader
        // TODO //uv zeug übertragen
        //?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.texCoords);
        this.gl.vertexAttribPointer(this.textureShader.getAttributeLocation("a_texCoord"), 2, this.gl.FLOAT, false, 0, 0);


        this.gl.activeTexture(gl.TEXTURE0);
        this.gl.bindTexture(gl.TEXTURE_2D, node.texture);
        this.textureShader.getUniformInt("sampler").set(0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, node.elements);

    }

    createMeshVertexBuffer(node) {


        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
        node.vertexBuffer = vertexBuffer;
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norm), gl.STATIC_DRAW);
        node.normalBuffer = normalBuffer;
        node.elements = vertex.length / 3;

        // Color buffer

        let colors = [
            // front
            0, 1, 0,   //3 Eckpunkte (jeweils 3 Koordinaten) für farbwerte vertices array kopieren und für -1 immer 0 einsetzen.
            0, 0, 1,
            1, 0, 1,

            // back
            0, 1, 0,
            1, 0, 1,
            1, 0, 0,

            // right
            0, 1, 0,
            1, 0, 0,
            0, 0, 0,


            // top
            0, 1, 0,
            0, 0, 0,
            0, 0, 1,

            // bottom
            0, 0, 0, 1, 0, 0, 1, 0, 1,
            1, 0, 1, 0, 0, 1, 0, 0, 0,


        ];

        // var colorData = vertex;
        // for (var i = 0; i < colorData.length; i++) {
        //     if (colorData[i] === -1) {
        //         colorData [i] = 0;
        //     }
        // }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        node.colorBuffer = colorBuffer;



    }
    createTextureMeshBuffers(node) {

        let gl = this.gl;
        let cubeTexture = gl.createTexture();
        let cubeImage = new Image();
        cubeImage.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, cubeTexture); // textur an grafikarte binden
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImage); //welches bild, welcher Farbmodus
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //filterung, verhalten der textur am rand
            gl.bindTexture(gl.TEXTURE_2D, null); //textur auf null setzten, im moment nicht verwenden
        };
        cubeImage.src = node.imageSrc;
        node.texture = cubeTexture;


         let uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv),
            gl.STATIC_DRAW);
        node.texCoords = uvBuffer;
    }

    visitPhongMeshNode(node){
        this.phongShader.use();
        this.phongShader.getUniformMatrix("P").set(this.projection);
        this.phongShader.getUniformMatrix("V").set(this.lookat);

        var mat = Matrix.identity();
        // Calculate the model matrix for the box
        // TODO
        //?
        mat = this.transformations[this.transformations.length - 1];
        this.phongShader.getUniformMatrix("M").set(mat);

        // Set the normal matrix
        // TODO //neu M,V,P da --> N setzen
        //?
        this.phongShader.getUniformMatrix("N").set(this.lookat.mul(mat).invert().transpose());

        // Could be done in a separate visitor
        // that only runs once after the scene graph
        // is initialised or changes occur
        if (!node.vertexBuffer) {
            this.createMeshVertexBuffer(node);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_position"), 3, this.gl.FLOAT, false, 0, 0);

        // Bind color buffer and normal buffer to
        // their attributes in the shader
        // TODO //bekannt auf dimensionen der vektoren achten
        //?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.colorBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_color"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.normalBuffer);
        this.gl.vertexAttribPointer(this.phongShader.getAttributeLocation("a_normal"), 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, node.elements);
    }


}
