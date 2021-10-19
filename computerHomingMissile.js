class computerHomingMissile {
    constructor(x, y, w, h, angle, canW, canH) { 
        var options={
            friction: 1.0,
            restitution: 0.8
        }

        this.canW=canW;
        this.canH=canH;

        this.width=w;
        this.height=h;
        this.image=loadImage("computerHomingMissile.png");
        this.launched=false;

        this.body=Bodies.rectangle(x, y, this.width, this.height, options);
        Matter.Body.setAngle(this.body, angle);

        World.add(world, this.body);
    }

    display() {
        var pos=this.body.position;
        var angle=this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, 0, this.width, this.height);
        pop();
    }

    findTarget(target) {
        this.launched=true;

        var pos=this.body.position;

        if (pos.x!=target.x) {
            if (pos.x<target.x) {
                Matter.Body.setVelocity(this.body, {x:+(this.canW*this.canH*0.00004), y:this.body.velocity.y});
            }
            else {
                Matter.Body.setVelocity(this.body, {x:-(this.canW*this.canH*0.00004), y:this.body.velocity.y});
            }
        }
        else {
            Matter.Body.setVelocity(this.body, {x:0, y:this.body.velocity.y});
        }

        if (pos.y!=target.y) {
            if (pos.y<target.y) {
                Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:+(this.canW*this.canH*0.00002)});
            }
            else {
                Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-(this.canW*this.canH*0.00002)});
            }
        }
        else {
            Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:0});
        }
    }
}