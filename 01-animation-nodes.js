class AnimationNode {
  constructor(groupNode) {
    this.groupNode = groupNode;
    this.active = false;
    this.direction ="";
    this.jumping="";
    this.delete ="";
    this.pulsate = false;
    this.pulsateToggle = 0;


  }

  toggleActive(direction) {
    this.active = !this.active;
    this.direction = direction;
  }

  toggleJumping(bool){
      this.jumping=bool;
  }

  togglePulsate(){

      if(this.pulsateToggle===0){
          this.pulsate = true;
          this.pulsateToggle++;
      }else if(this.pulsateToggle === 1){
          this.pulsate = false;
          this.pulsateToggle--;
      }

  }
    click(x, y){
        if(this.pulsate === true){

        }
    }

}



class RotationNode extends AnimationNode {
    constructor(groupNode, axis) {
        super(groupNode);
        this.angle = 0;
        this.axis = axis;
        this.amt = 0.00005;
    }

    simulate(deltaT) {
        // change the matrix of the attached
        if (this.active) {
            for (var i = 0; i < deltaT; i++) {
                switch (this.direction) {
                    case "right" :
                        this.axis = new Vector(0, 0, 1);
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle + i * this.amt));
                        //rotationNodeSave = rotationNodeSave.mul( this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle + i * this.amt)));
                        break;
                    case "left" :
                        this.axis = new Vector(0, 0, 1);
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle - i * this.amt));
                        //rotationNodeSave =  rotationNodeSave.mul(this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle - i * this.amt)));
                        break;
                    case "up" :
                        this.axis = new Vector(1, 0, 0);
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle + i * this.amt));
                        //rotationNodeSave = rotationNodeSave.mul((Matrix.rotation(this.axis, this.angle + i * this.amt)));
                        break;
                    case "down" :
                        this.axis = new Vector(1, 0, 0);
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle - i * this.amt));
                        //rotationNodeSave = rotationNodeSave.mul((Matrix.rotation(this.axis, this.angle - i * this.amt)));
                        break;
                }
            }
        }
    }
}


    class TranslationNode extends AnimationNode {
    constructor(groupNode, axis) {
        super(groupNode);
        this.amt = 0.01;
    }

    simulate(deltaT) {
        // change the matrix of the attached

        if(this.translateDown === true){
            this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, this.amt, 0)));
        }
        if(this.translateUp === true){
            this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, -this.amt, 0)));
        }
        if(this.translateRight === true){
            this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(this.amt, 0, 0)));
        }
        if(this.translateLeft === true){
            this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(-this.amt, 0, 0)));
        }


        // group node to reflect a rotation
        // TODO
    }

}


class RotateCameraNode extends AnimationNode {
    constructor(groupNode, axis) {
        super(groupNode);
        this.axis=axis;
        this.angle = 0;
        this.amtRotation = 0.0002;
        this.amtTranslation = 0.001;
        this.amtMove =0.001;
    }

    simulate(deltaT) {
        // change the matrix of the attached


            for (var i = 0; i < deltaT; i++) {

                if (this.rotateCameraLeft === true) {

                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(i*-this.amtTranslation, 0, 0)));
                    this.axis = new Vector(0, 1, 0);
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle - i * this.amtRotation));


                }
                if (this.rotateCameraRight === true) {

                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(i*this.amtTranslation, 0, 0)));
                    this.axis = new Vector(0, 1, 0);
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle + i * this.amtRotation));


                }
                if (this.rotateCameraDown === true) {

                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, i*this.amtTranslation, 0)));
                    this.axis = new Vector(1, 0, 0);
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle - i * this.amtRotation));


                }
                if (this.rotateCameraUp === true) {

                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, -i*this.amtTranslation, 0)));
                    this.axis = new Vector(1, 0, 0);
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(this.axis, this.angle + i * this.amtRotation));


                }

                if(this.translateFar === true){
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, 0, i* this.amtTranslation)));
                }
                if(this.translateNear === true){
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, 0, i*-this.amtTranslation)));
                }

            }

    }

}


class JumpNode extends AnimationNode {
    constructor(groupNode, axis) {
        super(groupNode);
        this.counter=0;
        this.amt=0.8;
    }

    simulate(deltaT) {
        // change the matrix of the attached


        for (var i = 0; i < deltaT; i++) {

            switch (this.jumping) {
                case "true" :
                    //jumps up quickly in the first frames
                    if (this.counter <= 375) {
                        this.axis = new Vector(0, 0, 1);
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, 0.01 * this.amt, 0)));
                        this.counter++;
                    }
                    //slows down
                    if (this.counter <= 562.5) {
                        this.axis = new Vector(0, 0, 1);
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, 0.005 * this.amt, 0)));
                        this.counter++;
                        //slows down even more
                    }
                    if (this.counter <= 750) {
                        this.axis = new Vector(0, 0, 1);
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, 0.0025 * this.amt, 0)));
                        this.counter++;
                        //falls down in constant speed
                    } else if (this.counter >= 750 && this.counter <= 1500) {
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, -0.0045 * this.amt, 0)));
                        this.counter++;
                        //deactivates jumping animation after 2000 deltaT steps
                    } else {
                        this.jumping = "";
                        this.active = false;
                        this.counter = 0;
                    }

                    break;
            }
        }

    }
}
    class DeleteNode extends AnimationNode {
    constructor(groupNode) {
        super(groupNode);
    }

    simulate(deltaT) {
        // change the matrix of the attached
        if (this.delete) {
            for (var i = 0; i < deltaT; i++) {
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.rotation(new Vector (0,1,0), i * 0.001));
                        this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.translation(new Vector(0, i * 0.001, 0))) ;
                         this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.scaling(new Vector (0.997, 0.997, 0.997)));
                }

            }
        }
    }



    class PulsateNode extends AnimationNode {
        constructor(groupNode) {
            super(groupNode);
            this.counterPos = 0;
            this.counterNeg =0;
            this.amt=1.007;
            this.growth=0;
        }

        simulate(deltaT) {



            // change the matrix of the attached
            if (this.pulsate === true) {

            if (this.counterPos<40){
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.scaling(new Vector (this.amt,this.amt,this.amt)));
                    this.counterPos++;
                    this.growth++;
            }
                   else if (this.counterNeg<40) {
                this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.scaling(new Vector (1/this.amt,1/this.amt,1/this.amt)));
                this.counterNeg++;
                this.growth--;
                }
                else {
                this.counterPos = 0;
                this.counterNeg = 0;


            }


            }
            if(this.pulsate === false){
                if
                (this.growth<0) {
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.scaling(new Vector (this.amt,this.amt,this.amt)));
                    this.growth++;
                }else if (this.growth>0){
                    this.groupNode.matrix = this.groupNode.matrix.mul(Matrix.scaling(new Vector (1/this.amt,1/this.amt,1/this.amt)));
                    this.growth--;
                }else{
                    this.counterPos = 0;
                    this.counterNeg = 0;
                }
            }
        }
    }


