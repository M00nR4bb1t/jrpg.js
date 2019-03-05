class Entity {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.gridX = Math.floor(x / gridWidth);
    this.gridY = Math.floor(y / gridHeight);
    this.remX = x % gridWidth / gridWidth;
    this.remY = y % gridHeight / gridHeight;

    this.sprite = sprite;

    this.moveX = 0;
    this.moveY = 0;
  }

  update(delta) {
    this.remX += this.moveX * delta;
    while (this.remX > 1) {this.remX--; this.gridX++;}
    while (this.remX < 0) {this.remX++; this.gridX--;}
    this.remY += this.moveY * delta;
    while (this.remY > 1) {this.remY--; this.gridY++;}
    while (this.remY < 0) {this.remY++; this.gridY--;}

    this.x = (this.gridX + this.remX) * gridWidth;
    this.y = (this.gridY + this.remY) * gridHeight;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
}

class Player extends Entity {
  constructor(x, y, spriteSheet, name) {
    super(x, y, null);

    this.animDown = [spriteSheet.textures[name + '_01.png'], spriteSheet.textures[name + '_02.png'], spriteSheet.textures[name + '_03.png'], spriteSheet.textures[name + '_04.png']];
    this.animLeft = [spriteSheet.textures[name + '_05.png'], spriteSheet.textures[name + '_06.png'], spriteSheet.textures[name + '_07.png'], spriteSheet.textures[name + '_08.png']];
    this.animRight = [spriteSheet.textures[name + '_09.png'], spriteSheet.textures[name + '_10.png'], spriteSheet.textures[name + '_11.png'], spriteSheet.textures[name + '_12.png']];
    this.animUp = [spriteSheet.textures[name + '_13.png'], spriteSheet.textures[name + '_14.png'], spriteSheet.textures[name + '_15.png'], spriteSheet.textures[name + '_16.png']];

    this.sprite = new PIXI.AnimatedSprite(this.animDown);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;

    this.speed = 0.05;
    this.movementKeys = [];
  }

  update(delta) {
    if (Math.abs(Math.round(this.remX) - this.remX) < this.speed && Math.abs(Math.round(this.remY) - this.remY) < this.speed) {
      var moveXPrev = this.moveX, moveYPrev = this.moveY, framePrev = this.sprite.currentFrame;
      this.remX = Math.round(this.remX);
      this.remY = Math.round(this.remY);
      this.moveX = ((this.movementKeys.indexOf('ArrowRight') == 0)?this.speed:0) - ((this.movementKeys.indexOf('ArrowLeft') == 0)?this.speed:0);
      this.moveY = ((this.movementKeys.indexOf('ArrowDown') == 0)?this.speed:0) - ((this.movementKeys.indexOf('ArrowUp') == 0)?this.speed:0);
      
      var animKey = {'ArrowDown': this.animDown, 'ArrowLeft': this.animLeft, 'ArrowRight': this.animRight, 'ArrowUp': this.animUp};
      if (this.movementKeys.length > 0 && animKey[this.movementKeys[0]] != this.sprite.textures) {
        this.sprite.textures = animKey[this.movementKeys[0]];
      }

      if (this.moveX == 0 && this.moveY == 0) {
        this.sprite.gotoAndStop(0);
      } else if (this.moveX != moveXPrev || this.moveY != moveYPrev) {
        this.sprite.gotoAndPlay(framePrev + 1);
      }
    }

    super.update(delta);
    this.sprite.position.x += gridWidth / 2;
    this.sprite.position.y += gridHeight * 0.875;
  }

  keyDown(key) {
    if (this.movementKeys.indexOf(key) != -1) return;
    this.movementKeys.unshift(key);
  }

  keyUp(key) {
    this.movementKeys = this.movementKeys.filter(function(value, index, arr){
      return value != key;
    });
  }
}