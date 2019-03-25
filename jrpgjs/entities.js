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
      this.sprite.x = Math.round(this.x);
      this.sprite.y = this.sprite.z = Math.round(this.y);

      this.zText = new PIXI.Text(`${this.sprite.z.toString(10)}\n${viewport.children.indexOf(this.sprite)}`, new PIXI.TextStyle({
        fontFamily: 'Raleway',
        fontSize: 12,
        fontWeight: 300,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 524
      }));

      this.zText.x = Math.round(this.x);
      this.zText.y = Math.round(this.y);
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
      this.sprite.x = Math.round(this.x);
      this.sprite.y = this.sprite.z = Math.round(this.y);
      if (this.zText) {
        this.zText.text = `${this.sprite.z.toString(10)}\n${viewport.children.indexOf(this.sprite)}`;
        this.zText.x = Math.round(this.x);
        this.zText.y = Math.round(this.y);
      } else {
        this.zText = new PIXI.Text(`${this.sprite.z.toString(10)}\n${viewport.children.indexOf(this.sprite)}`, new PIXI.TextStyle({
          fontFamily: 'Raleway',
          fontSize: 12,
          fontWeight: 300,
          fill: '#FFFFFF',
          wordWrap: true,
          wordWrapWidth: 524
        }));

        this.zText.x = Math.round(this.x);
        this.zText.y = Math.round(this.y);
        debugGraphics.addChild(this.zText);
      }
    }
  }

  addTo(container) {
    if (this.sprite) container.addChild(this.sprite);
  }

  remove() {
    if (this.sprite) this.sprite.parent.removeChild(this.sprite);
  }
}

class Player extends Entity {
  constructor(gridX, gridY, texture) {
    super(gridX, gridY, null);
    solid[gridY][gridX] = [false, false, false, false];

    this.desireX = this.targetX = gridX;
    this.desireY = this.targetY = gridY;

    this.animDown = [new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(0), Math.round(0), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4), Math.round(0), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 2), Math.round(0), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4 * 3), Math.round(0), Math.round(texture.width / 4), Math.round(texture.height / 4)))];
    this.animLeft = [new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(0), Math.round(texture.height / 4), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4), Math.round(texture.height / 4), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 2), Math.round(texture.height / 4), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4 * 3), Math.round(texture.height / 4), Math.round(texture.width / 4), Math.round(texture.height / 4)))];
    this.animRight = [new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(0), Math.round(texture.height / 2), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4), Math.round(texture.height / 2), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 2), Math.round(texture.height / 2), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4 * 3), Math.round(texture.height / 2), Math.round(texture.width / 4), Math.round(texture.height / 4)))];
    this.animUp = [new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(0), Math.round(texture.height / 4 * 3), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4), Math.round(texture.height / 4 * 3), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 2), Math.round(texture.height / 4 * 3), Math.round(texture.width / 4), Math.round(texture.height / 4))), new PIXI.Texture(texture, new PIXI.Rectangle(Math.round(texture.width / 4 * 3), Math.round(texture.height / 4 * 3), Math.round(texture.width / 4), Math.round(texture.height / 4)))];

    this.sprite = new PIXI.AnimatedSprite(this.animDown);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;

    this.sprite.x = Math.round(this.x);
    this.sprite.y = this.sprite.z = Math.round(this.y);

    this.speed = 0.05;
    this.movementKeys = [];
    this.paralyzed = false;
  }

  update(delta) {
    if (this.remX == 0 && this.remY == 0) {
      var animPrev = this.sprite.textures, framePrev = this.sprite.currentFrame;

      this.moveX = ((this.movementKeys.indexOf('ArrowRight') == 0)?this.speed:0) - ((this.movementKeys.indexOf('ArrowLeft') == 0)?this.speed:0);
      this.moveY = ((this.movementKeys.indexOf('ArrowDown') == 0)?this.speed:0) - ((this.movementKeys.indexOf('ArrowUp') == 0)?this.speed:0);
      
      this.desireX = this.gridX + Math.sign(this.moveX);
      this.desireY = this.gridY + Math.sign(this.moveY);

      solid[this.targetY][this.targetX] = map.solid[this.targetY][this.targetX];

      var directionMap = {'ArrowDown': 0, 'ArrowLeft': 1, 'ArrowRight': 2, 'ArrowUp': 3};
      if (this.desireX < 0 || this.desireY < 0 || this.desireX >= map.width || this.desireY >= map.height || solid[this.gridY][this.gridX][directionMap[this.movementKeys[0]]] || solid[this.gridY + Math.sign(this.moveY)][this.gridX + Math.sign(this.moveX)][3 - directionMap[this.movementKeys[0]]]) {
        this.moveX = 0;
        this.moveY = 0;
      }

      this.targetX = this.gridX + Math.sign(this.moveX);
      this.targetY = this.gridY + Math.sign(this.moveY);
      solid[this.targetY][this.targetX] = [true, true, true, true];

      var animMap = {'ArrowDown': this.animDown, 'ArrowLeft': this.animLeft, 'ArrowRight': this.animRight, 'ArrowUp': this.animUp};
      if (this.movementKeys.length > 0 && animMap[this.movementKeys[0]] != this.sprite.textures) {
        this.sprite.textures = animMap[this.movementKeys[0]];
      }

      if (this.moveX == 0 && this.moveY == 0) {
        this.sprite.gotoAndStop(0);
      } else if (this.sprite.textures != animPrev || !this.sprite.playing) {
        this.sprite.gotoAndPlay(framePrev + 1);
      }
    } else if (this.remX + this.moveX * delta < 0 || this.remX + this.moveX * delta > 1 || this.remY + this.moveY * delta < 0 || this.remY + this.moveY * delta > 1) {
      this.remX = Math.round(this.remX);
      this.remY = Math.round(this.remY);

      while (this.remX >= 1) {this.remX--; this.gridX++;}
      while (this.remX < 0) {this.remX++; this.gridX--;}
      while (this.remY >= 1) {this.remY--; this.gridY++;}
      while (this.remY < 0) {this.remY++; this.gridY--;}

      this.moveX = 0;
      this.moveY = 0;
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