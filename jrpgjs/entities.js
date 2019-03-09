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
  constructor(x, y, texture) {
    super(x, y, null);

    this.animDown = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 0, 32, 48))];
    this.animLeft = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 48, 32, 48))];
    this.animRight = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 96, 32, 48))];
    this.animUp = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 144, 32, 48))];

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