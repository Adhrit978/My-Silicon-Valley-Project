class Player {
  constructor(x, y, w, h, canW, canH) {
    this.image=loadImage("playerSub.png");
    this.explosionImage=loadImage("explosion.png");

    this.canW=canW;
    this.canH=canH;

    this.sprite=createSprite(x, y, w, h);
    this.sprite.addImage(this.image);
    this.sprite.scale=(this.canW*this.canH*0.00000055);

    this.launcher=new playerLauncher(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000035), (this.canW*this.canH*0.0001), (this.canW*this.canH*0.000037));

    this.life=200;
    
    this.gameFailed=false;
    this.gamePassed=false;

    this.missile;
    this.nMissiles=0;
    this.missiles=[];

    this.homingMissile;
    this.nHomingMissiles=0;
    this.homingMissiles=[];
  }

  handleLauncher() {
      Matter.Body.setPosition(this.launcher.body, {x:this.sprite.x+(this.canW*this.canH*0.00003), y:this.sprite.y-(this.canW*this.canH*0.000035)});
      this.launcher.display();
  }

  controls(wall1, wall2, wall3, wall4, wall5) {
    if (keyDown(RIGHT_ARROW)) {
        this.sprite.x+=(this.canW*this.canH*0.0000035);
    }
    
    if (keyDown(LEFT_ARROW)) {
        this.sprite.x-=(this.canW*this.canH*0.0000035);
    }
      
    if (keyDown(UP_ARROW)) {
        this.sprite.y-=(this.canW*this.canH*0.0000035);
    }
      
    if (keyDown(DOWN_ARROW)) {
        this.sprite.y+=(this.canW*this.canH*0.0000035);
    }

    this.sprite.bounceOff(wall1);
    this.sprite.bounceOff(wall2);
    this.sprite.bounceOff(wall3);
    this.sprite.bounceOff(wall4);
    this.sprite.bounceOff(wall5);
  }

  createMissiles() {
    if (this.nMissiles<65) {
      this.missile=new playerMissile(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000037), (this.canW*this.canH*0.00008), (this.canW*this.canH*0.000027), 0, this.canW, this.canH);
      this.missiles.push(this.missile);
      this.nMissiles+=1;
      this.missile.launch();
      missileLaunchingSound.play();
    }
  }

  handleMissiles() {
    if (this.nMissiles<65) {
        stroke("black");
        fill("black");
        if (this.nMissiles>=40) {
        stroke("orange");
        fill("orange");
        }
        if (this.nMissiles>=50) {
        stroke("red");
        fill("red");
        }
        textSize(this.canW*this.canH/43100);
        text(65-this.nMissiles+" missiles left", (this.canW*this.canH*0.000018), (this.canW*this.canH*0.000023));

        for (let i=0; i<this.missiles.length; i++) {
          this.missiles[i].display();
          if (this.missiles[i].body.position.x>=width||this.missiles[i].body.position.y>=height||this.missiles[i].body.position.x<=0||this.missiles[i].body.position.y<=0) {
            Matter.World.remove(world, this.missiles[i].body);
            this.missiles[i].sprite.destroy();
            this.missiles.splice(i, 1);
          }
        }
    }
    else {
        stroke("red");
        fill("red");
        textSize(this.canW*this.canH/46100);
        text("0 missiles left", (this.canW*this.canH*0.000018), (this.canW*this.canH*0.00002));
    }
  }

  createHomingMissiles() {
    if (this.nHomingMissiles<10) {
      this.homingMissile=new playerHomingMissile(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000037), (this.canW*this.canH*0.00014), (this.canW*this.canH*0.00003), 0, this.canW, this.canH);
      this.homingMissiles.push(this.homingMissile);
      this.nHomingMissiles+=1;
      missileLaunchingSound.play();
    }
  }

  handleHomingMissiles(target) {
    if (this.nHomingMissiles<10) {
        stroke("black");
        fill("black");
    
        if (this.nHomingMissiles>=3) {
          stroke("orange");
          fill("orange");
        }
    
        if (this.nHomingMissiles>=6) {
          stroke("red");
          fill("red");
        }
    
        textSize(this.canW*this.canH/43100);
        text(10-this.nHomingMissiles+" homing missiles left", (this.canW*this.canH*0.000018), (this.canW*this.canH*0.000048));
    
        for (let i=0; i<this.homingMissiles.length; i++) {
          this.homingMissiles[i].display();
          this.homingMissiles[i].findTarget(target);
        }
      }
      else {
        stroke("red");
        fill("red");
        textSize(this.canW*this.canH/43100);
        text("0 homing missiles left", (this.canW*this.canH*0.000018), (this.canW*this.canH*0.000048));
      }
  }

  handleMissileCollision(missilesarray) {
    for (let i=0; i<missilesarray.length; i++) {
      if (missilesarray[i]!=null) {
        var collidedWithSub=dist(missilesarray[i].body.position.x, missilesarray[i].body.position.y, this.x, this.y);
        var collidedWithLauncher=dist(missilesarray[i].body.position.x, missilesarray[i].body.position.y, this.launcher.body.position.x, this.launcher.body.position.y)
        if (collidedWithSub<=(this.canW*this.canH*0.00087)||collidedWithLauncher<=(canW*canH*0.00007)) {
          this.life-=10;
          var explosion=createSprite(missilesarray[i].body.position.x, missilesarray[i].body.position.y);
          explosion.addImage(this.explosionImage);
          explosion.scale=(this.canW*this.canH*0.00000025);
          explosion.lifetime=4;

          Matter.World.remove(world, missilesarray[i].body);
          missilesarray.splice(i, 1);

          explosionSound.play();
        }
      }
    }
  }

  handleLife() {
    noStroke();
    fill("red");
    rect((this.canW*this.canH*0.000019), (this.canW*this.canH*0.00006), 200*(this.canW*this.canH*0.000001357), (this.canW*this.canH*0.00002))
    fill("green");
    rect((this.canW*this.canH*0.000019), (this.canW*this.canH*0.00006), this.life*(this.canW*this.canH*0.000001357), (this.canW*this.canH*0.00002));
    stroke("black");
    noFill();
    rect((this.canW*this.canH*0.000019), (this.canW*this.canH*0.00006), 200*(this.canW*this.canH*0.000001357), (this.canW*this.canH*0.00002));

    if (this.life==0) {
      this.gameFailed=true;
      this.gameFail();
    }

    if (computer.life==0) {
      this.gamePassed=true;
      this.gamePass();
    }
  }

  gamePass() {
    swal(
      {
        title: `You win`,
        imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/smiley.jpg",
        imageSize: "222x222",
        confirmButtonText: 'Play again'
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
  }

  gameFail() {
    swal(
      {
        title: `You lose`,
        imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/sad.jpg",
        imageSize: "222x222",
        confirmButtonText: 'Play again'
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
  }

  gameDraw() {
    swal(
      {
        title: `You Draw`,
        imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/neutral.png",
        imageSize: "222x222",
        confirmButtonText: 'Play again'
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
  }
}