const gridWidth = 32;
const gridHeight = 32;
const frameRate = 60;

let app = new PIXI.Application({width: 544, height: 416});
document.body.appendChild(app.view);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.addEventListener('resize', resize);
resize();
PIXI.loader.add('res/sprites/sprites.json').load(setup);

var player;

function setup() {
  player = new Player(0, 0, PIXI.loader.resources['res/sprites/sprites.json'].spritesheet, 'tremel');
  app.stage.addChild(player.sprite);

  app.ticker.add(delta => update(delta));
}

function update(delta) {
  player.update(delta);
}

function keyDown(e) {
  player.keyDown(e.code);
}

function keyUp(e) {
  player.keyUp(e.code);
}

function resize() {
  var windowRatio = window.innerWidth/window.innerHeight;
  var targetRatio = 17/13;
  if (windowRatio < targetRatio) {
    app.renderer.view.style.width = '100vw';
    app.renderer.view.style.height = 'auto';
  } else if (windowRatio > targetRatio) {
    app.renderer.view.style.width = 'auto';
    app.renderer.view.style.height = '100vh';
  }
}