class Computer {
  constructor(x, y, w, h, canW, canH) {
    this.image=loadImage("computerSub.png");
    this.explosionImage=loadImage("explosion.png");

    this.canW=canW;
    this.canH=canH;

    this.sprite=createSprite(x, y, w, h);
    this.sprite.addImage(this.image);
    this.sprite.scale=(this.canW*this.canH*0.00000055);

    this.launcher=new computerLauncher(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000035), (this.canW*this.canH*0.0001), (this.canW*this.canH*0.000037));

    this.life=300;

    this.missile;
    this.nMissiles=0;
    this.missiles=[];
    this.obstacleMissiles=[];

    this.homingMissile;
    this.nHomingMissiles=0;
    this.homingMissiles=[];
  }

  handleLauncher() {
    Matter.Body.setPosition(this.launcher.body, {x:this.sprite.x-(this.canW*this.canH*0.000025), y:this.sprite.y-(this.canW*this.canH*0.000033)});
    this.launcher.display();
  }

  controls(wall1, wall2, wall3, wall4, wall5) {
    this.sprite.bounceOff(wall1);
    this.sprite.bounceOff(wall2);
    this.sprite.bounceOff(wall3);
    this.sprite.bounceOff(wall4);
    this.sprite.bounceOff(wall5);

    var velocityXArray=[(this.canW*this.canH*0.0000036), (this.canW*this.canH*0.0000051), (this.canW*this.canH*0.0000065)];
    var velocityYArray=[(this.canW*this.canH*0.0000080), (this.canW*this.canH*0.0000095), (this.canW*this.canH*0.0000109)];
    var velocityX=random(velocityXArray);
    var velocityY=random(velocityYArray);
    for (let i=0; i<player.missiles.length; i++) {
      if (player.missiles[i].body.position.y<this.sprite.y+(this.canW*this.canH*0.00007)&&player.missiles[i].body.position.y>this.sprite.y-(this.canW*this.canH*0.00008)&&player.missiles[i].body.position.x>this.sprite.x-(this.canW*this.canH*0.00060)&&player.missiles[i].body.position.x<this.sprite.x+(this.canW*this.canH*0.00015)) {
        if (player.nMissiles%3==0) {
          this.sprite.velocityX=-velocityX;
          this.sprite.velocityY=velocityY;
        }
        else {
          this.sprite.velocityX=velocityX;
          this.sprite.velocityY=-velocityY;
        }
      }
      if (player.missiles[i]==null) {
        this.sprite.velocityX=0;
        this.sprite.velocityY=0;
      }
    }

    if (player.sprite.y<this.sprite.y-(this.canW*this.canH*0.00008)&&player.sprite.y>this.sprite.y-(this.canW*this.canH*0.00013)) {
      this.createMissiles();
    }

    if (this.life<=100) {
      this.createHomingMissiles();
      if(this.nHomingMissiles>=15) {
        missileLaunchingSound.stop();
      }
    }

    if (player.nMissiles>=65&&player.nHomingMissiles>=10) {
      this.createHomingMissiles();
      if(this.nHomingMissiles>=15) {
        missileLaunchingSound.stop();
      }
    }

    if (this.nMissiles>=85) {
      this.createHomingMissiles();
      if(this.nHomingMissiles>=15) {
        missileLaunchingSound.stop();
      }
    }
  }

  createMissiles() {
    if (this.nMissiles<=85) {
      this.missile=new computerMissile(this.launcher.body.position.x, this.launcher.body.position.y, (this.canW*this.canH*0.000073), (this.canW*this.canH*0.000022), 0, this.canW, this.canH);
      if (this.nMissiles%2==0) {
        this.obstacleMissiles.push(this.missile);
      }
      else {
        this.missiles.push(this.missile);
      }
      this.nMissiles+=1;
      this.missile.launch();
      missileLaunchingSound.play();
    }
  }

  handleMissiles() {
    if (this.nMissiles<85) {
      stroke("black");
      fill("black");
      if (this.nMissiles>=50) {
        stroke("orange");
        fill("orange");
      }
      if (this.nMissiles>=60) {
        stroke("red");
        fill("red");
      }
      textSize(this.canW*this.canH/43100);
      text(85-this.nMissiles+" missiles left", width-(this.canW*this.canH*0.000183), (this.canW*this.canH*0.000023));
  
      for (let i=0; i<this.missiles.length; i++) {
        this.missiles[i].display();
        if (this.missiles[i].body.position.x>=width||this.missiles[i].body.position.y>=height||this.missiles[i].body.position.x<=0||this.missiles[i].body.position.y<=0) {
          Matter.World.remove(world, this.missiles[i].body);
          this.missiles.splice(i, 1);
        }
      }
      for (let i=0; i<this.obstacleMissiles.length; i++) {
        this.obstacleMissiles[i].display();
        if (this.obstacleMissiles[i].body.position.x>=width||this.obstacleMissiles[i].body.position.y>=height||this.obstacleMissiles[i].body.position.x<=0||this.obstacleMissiles[i].body.position.y<=0) {
          Matter.World.remove(world, this.obstacleMissiles[i].body);
          this.obstacleMissiles.splice(i, 1);
        }
      }
    }
    else {
      fill("red");
      stroke("red");
      textSize(this.canW*this.canH/43100);
      text("0 missiles left", width-(this.canW*this.canH*0.000183), (this.canW*this.canH*0.000023));
      for (let i=0; i<this.missiles.length; i++) {
        Matter.World.remove(world, this.missiles[i].body);
        this.missiles.splice(i, 1);
      }
      for (let i=0; i<this.obstacleMissiles.length; i++) {
        Matter.World.remove(world, this.obstacleMissiles[i].body);
        this.obstacleMissiles.splice(i, 1);
      }
    }
  }

  createHomingMissiles() {
    if (this.homingMissiles<=15) {
      this.homingMissile=new computerHomingMissile(this.launcher.body.position.x, this.launcher.body.position.y, (this.canW*this.canH*0.000073), (this.canW*this.canH*0.000022), 0, this.canW, this.canH);
      this.homingMissiles.push(this.homingMissile);
      this.nHomingMissiles+=1;
      missileLaunchingSound.play();
    }
  }

  handleHomingMissiles(target) {
      if (this.nHomingMissiles<15) {
        stroke("black");
        fill("black");
    
        if (this.nHomingMissiles>=5) {
          stroke("orange");
          fill("orange");
        }
    
        if (this.nHomingMissiles>=10) {
          stroke("red");
          fill("red");
        }
        
        textSize(this.canW*this.canH/43100);
        text(15-this.nHomingMissiles+" homing missiles left", width-(this.canW*this.canH*0.00026), (this.canW*this.canH*0.000048));
    
        for (let i=0; i<this.homingMissiles.length; i++) {
          this.homingMissiles[i].display();
          this.homingMissiles[i].findTarget(target);
        }
      }
      else {
        stroke("red");
        fill("red");
        textSize(this.canW*this.canH/43100);
        text("0 homing missiles left", width-(this.canW*this.canH*0.00026), (this.canW*this.canH*0.000048));
      
        for (let i=0; i<this.homingMissiles.length; i++) {
          Matter.World.remove(world, this.homingMissiles[i].body);
          this.homingMissiles.splice(i, 1);
        }
      }
  }

  handleMissileCollision(missilesArray) {
    for (let i=0; i<missilesArray.length; i++) {
      if (missilesArray[i]!=null) {
        var collidedWithSub=dist(missilesArray[i].body.position.x, missilesArray[i].body.position.y, this.x, this.y);
        var collidedWithLauncher=dist(missilesArray[i].body.position.x, missilesArray[i].body.position.y, this.launcher.body.position.x, this.launcher.body.position.y)
        if (collidedWithSub<=(this.canW*this.canH*0.00087)||collidedWithLauncher<(canW*canH*0.00007)) {
          explosionSound.play();

          this.life-=10;

          var explosion=createSprite(missilesArray[i].body.position.x, missilesArray[i].body.position.y, 10, 10);
          explosion.addImage(this.explosionImage);
          explosion.scale=(this.canW*this.canH*0.00000025);
          explosion.lifetime=4;

          Matter.World.remove(world, missilesArray[i].body);
          missilesArray[i].sprite.destroy();
          missilesArray.splice(i, 1);
        }
      }
    }
  }

  handleLife() {
    stroke("red");
    fill("red");
    rect(width-(this.canW*this.canH*0.00044), (this.canW*this.canH*0.00006), 300*(this.canW*this.canH*0.000001357), (this.canW*this.canH*0.000023));
    stroke("green");
    fill("green");
    rect(width-(this.canW*this.canH*0.00044), (this.canW*this.canH*0.00006), this.life*(this.canW*this.canH*0.000001357), (this.canW*this.canH*0.000023));
    stroke("black");
    noFill();
    rect(width-(this.canW*this.canH*0.00044), (this.canW*this.canH*0.00006), 300*(this.canW*this.canH*0.000001357), (this.canW*this.canH*0.000023));
  }
}