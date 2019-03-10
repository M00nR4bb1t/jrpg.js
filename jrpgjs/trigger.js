class Event {
  constructor(trigger) {
    this.trigger = trigger;
  }

  play() {
    //
  }
}

class TextboxEvent extends Event {
  constructor(trigger, message) {
    super(trigger);
    this.message = message;
  }

  play() {
    alert(this.message);
    this.trigger.done();
  }
}

class Trigger extends Entity {
  constructor(gridX, gridY, texture) {
    super(gridX, gridY, new PIXI.Sprite(texture));
    this.eventTree = {'main':[new TextboxEvent(this, 'I\'m just a patch of grass, nothing special about me.'), new TextboxEvent(this, '...Seriously, there\'s nothing to look at here.'), new TextboxEvent(this, 'Pl-please, go away...')]};
  }

  play(branch = 'main', index = 0) {
    this.branch = branch;
    this.index = index;
    this.eventTree[this.branch][this.index].play(this);
  }

  done() {
    if (this.index < this.eventTree[this.branch].length - 1) {
      this.index++;
      this.eventTree[this.branch][this.index].play(this);
    }
  }
}