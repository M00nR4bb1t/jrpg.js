class Event {
  play(trigger) {
    this.trigger = trigger;
  }

  update(delta) {
    //
  }

  keyDown(key) {
    //
  }

  keyUp(key) {
    //
  }
}

class TextboxEvent extends Event {
  constructor(message, name='') {
    super();
    this.container = new PIXI.Container();
    this.message = message;
    
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x555555, 0.5);
    graphics.drawRect(0, 250, 544, 166);
    graphics.endFill();
    this.container.addChild(graphics);

    if (name != '') {
      var nameText = new PIXI.Text(name, new PIXI.TextStyle({
        fontFamily: 'Raleway',
        fontSize: 18,
        fontWeight: 600,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 524
      }));
      nameText.x = 10;
      nameText.y = 260;
      this.container.addChild(nameText);
    }

    this.text = new PIXI.Text('', new PIXI.TextStyle({
      fontFamily: 'Raleway',
      fontSize: 18,
      fontWeight: 200,
      fill: '#FFFFFF',
      wordWrap: true,
      wordWrapWidth: 524
    }));
    this.text.x = 10;
    this.text.y = 280;
    this.container.addChild(this.text);
    
    this.container.visible = false;
    app.stage.addChild(this.container);
  }

  play(trigger) {
    super.play(trigger);
    
    this.container.visible = true;
    this.reveal = 0;
    this.timer = 0;
    this.text.text = '';
  }

  update(delta) {
    if (this.reveal == this.message.length) return;
    this.timer += delta;
    if (this.timer >= 3) {
      this.timer = 0;

      this.reveal ++;
      this.text.text = this.message.substring(0, this.reveal);

      var charAt = this.message.charAt(this.reveal - 1);
      if (charAt != ' ' &&
          charAt != '-') {
        PIXI.Loader.shared.resources['res/se/voice.wav'].sound.play();
      }
    }
  }

  keyDown(key) {
    if (key == 'KeyZ') {
      if (this.reveal == this.message.length) {
        this.container.visible = false;
        this.trigger.done();
      } else {
        this.reveal = this.message.length;
        this.text.text = this.message.substring(0, this.reveal);
      }
    }
  }
}

class SelectionEvent extends Event {
  constructor(message, options, name='', selection=0) {
    super();
    this.container = new PIXI.Container();
    this.message = message;
    this.options = options;
    
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);

    if (name != '') {
      var nameText = new PIXI.Text(name, new PIXI.TextStyle({
        fontFamily: 'Raleway',
        fontSize: 18,
        fontWeight: 600,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 524
      }));
      nameText.x = 10;
      nameText.y = 260;
      this.container.addChild(nameText);
    }

    this.text = new PIXI.Text('', new PIXI.TextStyle({
      fontFamily: 'Raleway',
      fontSize: 18,
      fontWeight: 200,
      fill: '#FFFFFF',
      wordWrap: true,
      wordWrapWidth: 524
    }));
    this.text.x = 10;
    this.text.y = 280;
    this.container.addChild(this.text);

    var optionTextStyle = new PIXI.TextStyle({
      fontFamily: 'Raleway',
      fontSize: 16,
      fontWeight: 200,
      fill: '#FFFFFF',
      wordWrap: true,
      wordWrapWidth: 524
    });

    var temp;
    for (var i=0; i<options.length; i++) {
      temp = new PIXI.Text(options[i].text, optionTextStyle);
      temp.x = 408;
      temp.y = 252 + 24 * (i - options.length);
      this.container.addChild(temp);
    }
    
    this.container.visible = false;
    app.stage.addChild(this.container);
  }

  play(trigger) {
    super.play(trigger);
    
    this.reveal = 0;
    this.timer = 0;
    this.selection = 0;
    this.text.text = '';
    
    this.redraw();
    this.container.visible = true;
  }

  update(delta) {
    if (this.reveal == this.message.length) return;
    this.timer += delta;
    if (this.timer >= 3) {
      this.timer = 0;

      this.reveal ++;
      this.text.text = this.message.substring(0, this.reveal);

      var charAt = this.message.charAt(this.reveal - 1);
      if (charAt != ' ' &&
          charAt != '-') {
        PIXI.Loader.shared.resources['res/se/voice.wav'].sound.play();
      }
    }
  }

  redraw() {
    this.graphics.clear();
    this.graphics.beginFill(0x555555, 0.5);
    this.graphics.drawRect(0, 250, 544, 166);
    for (var i=0; i<this.options.length; i++) {
      if (i == this.selection) continue;
      this.graphics.drawRect(400, 250 + 24 * (i - this.options.length), 144, 22);
    }
    this.graphics.endFill();

    this.graphics.beginFill(0x888888, 0.5);
    this.graphics.drawRect(400, 250 + 24 * (this.selection - this.options.length), 144, 22);
    this.graphics.endFill();
  }

  keyDown(key) {
    if (key == 'KeyZ') {
      if (this.reveal == this.message.length) {
        this.container.visible = false;
        this.trigger.goto(this.options[this.selection].channel);
      } else {
        this.reveal = this.message.length;
        this.text.text = this.message.substring(0, this.reveal);
      }
    } else if (key == 'ArrowUp') {
      this.selection --;
      while (this.selection < 0) {
        this.selection = this.options.length + this.selection;
      }
      this.redraw();
    } else if (key == 'ArrowDown') {
      this.selection = (this.selection + 1) % this.options.length;
      this.redraw();
    }
  }
}

class DelayEvent extends Event {
  constructor(time) {
    super();
    this.time = time;
  }

  play(trigger) {
    super.play(trigger);
    this.timer = 0;
  }

  update(delta) {
    this.timer += delta;
    if (this.timer >= this.time) {
      this.trigger.done();
    }
  }
}

class Trigger extends Entity {
  constructor(container, gridX, gridY, sprite, eventStream) {
    super(container, gridX, gridY, sprite);
    this.eventStream = eventStream;
    this.playing = false;
  }

  play(channel = 'main', index = 0) {
    this.channel = channel;
    this.index = index;
    this.eventStream[this.channel][this.index].play(this);
    this.playing = true;
  }

  done() {
    if (this.index < this.eventStream[this.channel].length - 1) {
      this.index++;
      this.eventStream[this.channel][this.index].play(this);
    } else {
      this.playing = false;
      player.unparalyze();
    }
  }

  goto(channel) {
    this.play(channel);
  }

  update(delta) {
    if (this.playing) this.eventStream[this.channel][this.index].update(delta);
    super.update(delta);
  }

  keyDown(key) {
    if (!this.playing && key == 'KeyZ') {
      if (player.gridX + ((player.moveX > 0)?1:0) == this.gridX && player.gridY + ((player.moveY > 0)?1:0) == this.gridY) {
        player.paralyze();
        this.play();
      }
    } else if (this.playing) {
      this.eventStream[this.channel][this.index].keyDown(key);
    }
  }

  keyUp(key) {
    if (this.playing) {
      this.eventStream[this.channel][this.index].keyUp(key);
    }
  }
}

class NPC extends Trigger {
  constructor(container, gridX, gridY, texture, eventStream) {
    super(container, gridX, gridY, null, eventStream);
    solid[this.gridY][this.gridX] = true;

    this.targetX = 0;
    this.targetY = 0;

    this.animDown = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 0, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 0, 32, 48))];
    this.animLeft = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 48, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 48, 32, 48))];
    this.animRight = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 96, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 96, 32, 48))];
    this.animUp = [new PIXI.Texture(texture, new PIXI.Rectangle(0, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(32, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(64, 144, 32, 48)), new PIXI.Texture(texture, new PIXI.Rectangle(96, 144, 32, 48))];

    this.sprite = new PIXI.AnimatedSprite(this.animDown);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    container.addChild(this.sprite);

    this.speed = 0.01;
  }

  update(delta) {
    if (Math.abs(Math.round(this.remX) - this.remX) < this.speed && Math.abs(Math.round(this.remY) - this.remY) < this.speed) {
      this.remX = Math.round(this.remX);
      this.remY = Math.round(this.remY);

      while (this.remX >= 1) {this.remX--; this.gridX++;}
      while (this.remX < 0) {this.remX++; this.gridX--;}
      while (this.remY >= 1) {this.remY--; this.gridY++;}
      while (this.remY < 0) {this.remY++; this.gridY--;}
      
      if (this.playing) {
        this.moveX = 0;
        this.moveY = 0;

        if (player.gridX < this.gridX) this.sprite.textures = this.animLeft;
        else if (player.gridX > this.gridX) this.sprite.textures = this.animRight;
        else if (player.gridY < this.gridY) this.sprite.textures = this.animUp;
        else this.sprite.textures = this.animDown;

        this.sprite.gotoAndStop(0);
      } else {
        var moveXPrev = this.moveX, moveYPrev = this.moveY, framePrev = this.sprite.currentFrame;
        var direction = Math.choose(0, 1, 2, 3); // Right, Left, Down, Up

        this.moveX = ((direction == 0)?this.speed:0) - ((direction == 1)?this.speed:0);
        this.moveY = ((direction == 2)?this.speed:0) - ((direction == 3)?this.speed:0);

        if (this.gridX + this.moveX < 0 || this.gridY + this.moveY < 0 || solid[this.gridY + Math.sign(this.moveY)][this.gridX + Math.sign(this.moveX)]) {
          this.moveX = 0;
          this.moveY = 0;
        }

        var animKey = {2: this.animDown, 1: this.animLeft, 0: this.animRight, 3: this.animUp};
        if (animKey[direction] != this.sprite.textures) {
          this.sprite.textures = animKey[direction];
        }

        if (this.moveX == 0 && this.moveY == 0) {
          this.sprite.gotoAndStop(0);
        } else if (this.moveX != moveXPrev || this.moveY != moveYPrev) {
          this.sprite.gotoAndPlay(framePrev + 1);
        }
      }

      solid[this.gridY][this.gridX] = false;
      solid[this.gridY + Math.sign(this.moveY)][this.gridX + Math.sign(this.moveX)] = true;
    }

    super.update(delta);
    this.sprite.position.x += gridWidth / 2;
    this.sprite.position.y += gridHeight * 0.875;
  }

  keyDown(key) {
    if (!this.playing && key == 'KeyZ') {
      if (player.desireX == this.gridX + ((this.moveX > 0)?1:0) && player.desireY == this.gridY + ((this.moveY > 0)?1:0)) {
        player.paralyze();
        this.play();
      }
    } else if (this.playing) {
      this.eventStream[this.channel][this.index].keyDown(key);
    }
  }
}