const gridWidth = 32;
const gridHeight = 32;
const frameRate = 60;

let app = new PIXI.Application({width: 544, height: 416});
document.body.appendChild(app.view);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.addEventListener('resize', resize);
resize();
PIXI.Loader.shared.add('tremel', 'res/characters/tremel.png')
                  .add('joe', 'res/characters/joe.png')
                  .add('cafe', 'res/tilesets/cafe.png')
                  .add('voice', 'res/se/voice.wav')
                  .load(setup);

var player;
var tileset, tilemap;
var triggers = [];
var solid;

var debug = true;
var debugGraphics = new PIXI.Graphics();
debugGraphics.z = 1000;

function zSort(a, b) {
  return a.z - b.z;
}

function setup() {
  tileset = new Tileset(PIXI.Loader.shared.resources['cafe'].texture, [72]);
  tilemap = new Tilemap(app.stage, tileset, [[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]], 17, 13);
  solid = tilemap.solid;

  triggers.push(new NPC(app.stage, 5, 5, PIXI.Loader.shared.resources['joe'].texture, {
    'main':[
      new TextboxEvent('Why, hello there, young man!', '???', PIXI.Loader.shared.resources['voice'].sound),
      new TextboxEvent('The name\'s Joe! Nice to meet you!', 'Joe', PIXI.Loader.shared.resources['voice'].sound),
      new DelayEvent(180),
      new TextboxEvent('Well, I hope to see you around.', 'Joe', PIXI.Loader.shared.resources['voice'].sound)
    ]
  }));

  triggers.push(new Trigger(app.stage, 10, 5, new PIXI.Sprite(tileset.textures[72]), true, {
    'main':[
      new TextboxEvent('A tray of freshly-baked bread. Looks delicious!'),
      new SelectionEvent('Take one?', [{'text': 'Yes', 'channel': 'takeBread'}, {'text': 'No','channel': 'dontTakeBread'}])
    ],
    'takeBread':[
      new DelayEvent(120),
      new TextboxEvent('Actually, I probably shouldn\'t take this. Stealing is bad.', 'Tremel')
    ],
    'dontTakeBread':[
      new TextboxEvent('Yeah, stealing is bad.', 'Tremel')
    ]
  }));

  player = new Player(app.stage, 0, 0, PIXI.Loader.shared.resources['tremel'].texture);

  app.stage.addChild(debugGraphics);
  app.ticker.add(delta => update(delta));

  minFPS = app.ticker.FPS;
  this.fpsText = new PIXI.Text(`${app.ticker.FPS}\n${minFPS}`, new PIXI.TextStyle({
    fontFamily: 'Raleway',
    fontSize: 12,
    fontWeight: 300,
    fill: '#FFFFFF',
    wordWrap: true,
    wordWrapWidth: 524
  }));
  debugGraphics.addChild(this.fpsText);
}

function update(delta) {
  if (debug) debugGraphics.clear();

  player.update(delta);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].update(delta);
  }

  app.stage.children.sort(zSort);

  if (!debug) return;
  debugGraphics.beginFill(0xFF0000, 0.5);
  for (var y=0; y<solid.length; y++) {
    for (var x=0; x<solid[y].length; x++) {
      if (solid[y][x]) {
        debugGraphics.drawRect(x * gridWidth, y * gridHeight, gridWidth, gridHeight);
      }
    }
  }
  debugGraphics.endFill();

  if (app.ticker.FPS) {
    if (app.ticker.FPS < minFPS) minFPS = app.ticker.FPS;
    fpsText.text = `${app.ticker.FPS}\n${minFPS}`;
  }
}

function setDebug(x) {
  debug = debugGraphics.visible = x;
}

function keyDown(e) {
  player.keyDown(e.code);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].keyDown(e.code);
  }
}

function keyUp(e) {
  player.keyUp(e.code);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].keyUp(e.code);
  }
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