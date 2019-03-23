class Entity {
  constructor(container, gridX, gridY, sprite) {
    this.gridX = Math.floor(gridX);
    this.gridY = Math.floor(gridY);
    this.remX = gridX - this.gridX;
    this.remY = gridY - this.gridY;
    
    this.sprite = sprite;
    this.x = (this.gridX + this.remX) * gridWidth;
    this.y = (this.gridY + this.remY) * gridHeight;
    if (this.sprite) {
      this.sprite.x = this.x;
      this.sprite.y = this.sprite.z = this.y;
      container.addChild(this.sprite);

      this.zText = new PIXI.Text(`${this.sprite.z.toString(10)}\n${app.stage.children.indexOf(this.sprite)}`, new PIXI.TextStyle({
        fontFamily: 'Raleway',
        fontSize: 12,
        fontWeight: 300,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 524
      }));

      this.zText.x = this.x;
      this.zText.y = this.y;
      debugGraphics.addChild(this.zText);
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
      this.sprite.y = this.sprite.z = this.y;
      if (this.zText) {
        this.zText.text = `${this.sprite.z.toString(10)}\n${app.stage.children.indexOf(this.sprite)}`;
        this.zText.x = this.x;
        this.zText.y = this.y;
      } else {
        this.zText = new PIXI.Text(`${this.sprite.z.toString(10)}\n${app.stage.children.indexOf(this.sprite)}`, new PIXI.TextStyle({
          fontFamily: 'Raleway',
          fontSize: 12,
          fontWeight: 300,
          fill: '#FFFFFF',
          wordWrap: true,
          wordWrapWidth: 524
        }));

        this.zText.x = this.x;
        this.zText.y = this.y;
        debugGraphics.addChild(this.zText);
      }
    }
  }
}

class Player extends Entity {
  constructor(container, gridX, gridY, texture) {
    super(container, gridX, gridY, null);

    this.desireX = 0;
    this.desireY = 0;

    this.animDown = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0, texture.width * 0.25, texture.height * 0.25))];
    this.animLeft = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25))];
    this.animRight = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25))];
    this.animUp = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25))];

    this.sprite = new PIXI.AnimatedSprite(this.animDown);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;

    this.sprite.x = this.x;
    this.sprite.y = this.sprite.z = this.y;
    container.addChild(this.sprite);

    this.speed = 0.05;
    this.movementKeys = [];
    this.paralyzed = false;
  }

  update(delta) {
    if (Math.abs(Math.round(this.remX) - this.remX) < this.speed && Math.abs(Math.round(this.remY) - this.remY) < this.speed) {
      var moveXPrev = this.moveX, moveYPrev = this.moveY, framePrev = this.sprite.currentFrame;
      this.remX = Math.round(this.remX);
      this.remY = Math.round(this.remY);

      while (this.remX >= 1) {this.remX--; this.gridX++;}
      while (this.remX < 0) {this.remX++; this.gridX--;}
      while (this.remY >= 1) {this.remY--; this.gridY++;}
      while (this.remY < 0) {this.remY++; this.gridY--;}

      this.moveX = ((this.movementKeys.indexOf('ArrowRight') == 0)?this.speed:0) - ((this.movementKeys.indexOf('ArrowLeft') == 0)?this.speed:0);
      this.moveY = ((this.movementKeys.indexOf('ArrowDown') == 0)?this.speed:0) - ((this.movementKeys.indexOf('ArrowUp') == 0)?this.speed:0);
      
      this.desireX = this.gridX + Math.sign(this.moveX);
      this.desireY = this.gridY + Math.sign(this.moveY);

      if (this.desireX < 0 || this.desireY < 0 || this.desireX >= tilemap.width || this.desireY >= tilemap.height || solid[this.gridY + Math.sign(this.moveY)][this.gridX + Math.sign(this.moveX)]) {
        this.moveX = 0;
        this.moveY = 0;
      }

      solid[this.gridY][this.gridX] = false;
      solid[this.gridY + Math.sign(this.moveY)][this.gridX + Math.sign(this.moveX)] = true;

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

    if (debug) {
      debugGraphics.beginFill(0x0000FF, 0.5);
      debugGraphics.drawCircle(this.desireX * gridWidth + gridWidth / 2, this.desireY * gridHeight + gridHeight / 2, gridWidth / 4);
      debugGraphics.endFill();
    }

    super.update(delta);
    this.sprite.position.x += gridWidth / 2;
    this.sprite.position.y += gridHeight * 0.875;
  }

  paralyze() {
    this.movementKeys = [];
    this.paralyzed = true;
  }

  unparalyze() {
    this.paralyzed = false;
  }

  keyDown(key) {
    if (this.paralyzed) return;
    if (key == 'ArrowLeft' || key == 'ArrowRight' || key == 'ArrowUp' || key == 'ArrowDown') {
      if (this.movementKeys.indexOf(key) != -1) return;
      this.movementKeys.unshift(key);
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