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
    this.timer += delta;
    if (this.timer >= 3) {
      this.timer = 0;
      this.reveal = Math.min(this.message.length, this.reveal + 1);
      this.text.text = this.message.substring(0, this.reveal);
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
  constructor(container, gridX, gridY, texture, eventTree) {
    super(container, gridX, gridY, new PIXI.Sprite(texture));
    this.eventTree = eventTree;
    this.playing = false;
  }

  play(branch = 'main', index = 0) {
    this.branch = branch;
    this.index = index;
    this.eventTree[this.branch][this.index].play(this);
    this.playing = true;
  }

  done() {
    if (this.index < this.eventTree[this.branch].length - 1) {
      this.index++;
      this.eventTree[this.branch][this.index].play(this);
    } else this.playing = false;
  }

  update(delta) {
    if (this.playing) this.eventTree[this.branch][this.index].update(delta);
  }

  keyDown(key) {
    if (!this.playing && key == 'KeyZ') {
      if (player.gridX + (player.moveX > 0)?1:0 == this.gridX && player.gridY + (player.moveY > 0)?1:0 == this.gridY) {
        this.play();
      }
    } else if (this.playing) {
      this.eventTree[this.branch][this.index].keyDown(key);
    }
  }

  keyUp(key) {
    if (this.playing) {
      this.eventTree[this.branch][this.index].keyUp(key);
    }
  }
}