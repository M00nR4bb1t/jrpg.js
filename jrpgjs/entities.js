class Entity {
  constructor(gridX, gridY, sprite) {
    this.gridX = Math.floor(gridX);
    this.gridY = Math.floor(gridY);
    this.remX = gridX - this.gridX;
    this.remY = gridY - this.gridY;
    
    this.sprite = sprite;
    this.x = (this.gridX + this.remX) * gridWidth;
    this.y = (this.gridY + this.remY) * gridHeight;
    if (this.sprite) {
      this.sprite.x = this.x;
      this.sprite.y = this.y;
    }

    this.moveX = 0;
    this.moveY = 0;
  }

  update(delta) {
    this.remX += this.moveX * delta;
    while (this.remX >= 1) {this.remX--; this.gridX++;}
    while (this.remX < 0) {this.remX++; this.gridX--;}
    this.remY += this.moveY * delta;
    while (this.remY >= 1) {this.remY--; this.gridY++;}
    while (this.remY < 0) {this.remY++; this.gridY--;}

    this.x = (this.gridX + this.remX) * gridWidth;
    this.y = (this.gridY + this.remY) * gridHeight;
    if (this.sprite) {
      this.sprite.x = this.x;
      this.sprite.y = this.y;
    }
  }
}

class Player extends Entity {
  constructor(gridX, gridY, texture) {
    super(gridX, gridY, null);

    this.animDown = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 0, 32, 48))];
    this.animLeft = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 48, 32, 48))];
    this.animRight = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 96, 32, 48))];
    this.animUp = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 144, 32, 48))];

    this.sprite = new PIXI.AnimatedSprite(this.animDown);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;

    this.sprite.x = this.x;
    this.sprite.y = this.y;

    this.speed = 0.05;
    this.movementKeys = [];

    this.searching = false;
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

    if (this.searching) {
      for (var i=0; i<triggers.length; i++) {
        if (this.gridX + (this.moveX > 0)?1:0 == triggers[i].gridX && this.gridY + (this.moveY > 0)?1:0 == triggers[i].gridY) {
          triggers[i].play();
        }
      }
      this.searching = false;
    }

    super.update(delta);
    this.sprite.position.x += gridWidth / 2;
    this.sprite.position.y += gridHeight * 0.875;
  }

  keyDown(key) {
    if (key == 'ArrowLeft' || key == 'ArrowRight' || key == 'ArrowUp' || key == 'ArrowDown') {
      if (this.movementKeys.indexOf(key) != -1) return;
      this.movementKeys.unshift(key);
    } else if (key == 'KeyZ') {
      this.searching = true;
    }
  }

  keyUp(key) {
    if (key == 'ArrowLeft' || key == 'ArrowRight' || key == 'ArrowUp' || key == 'ArrowDown') {
      this.movementKeys = this.movementKeys.filter(function(value, index, arr){
        return value != key;
      });
    }
  }
}