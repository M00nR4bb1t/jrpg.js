const viewportWidth = 544;
const viewportHeight = 416;
const gridWidth = 32;
const gridHeight = 32;
const frameRate = 60;

let app = new PIXI.Application({width: viewportWidth, height: viewportHeight});
document.body.appendChild(app.view);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.addEventListener('resize', resize);
resize();

var player, party = {};
var maps = {}, tilesets = {}, map;
var triggers = [];
var solid = [];

var variables = {};

var eventPlayers = []; // TODO: Per-map EventPlayers. EventPlayer Event. Load in MapChangeEvent.

var viewport = new PIXI.Container();
app.stage.addChild(viewport);

var debug = true;
var debugGraphics = new PIXI.Graphics();
debugGraphics.z = Number.MAX_VALUE;
viewport.addChild(debugGraphics);

load();

function zSort(a, b) {
  return a.z - b.z;
}

function setup() {
  setDebug(false);

  party = data.party;

  for (var i=0; i<data.tilesets.length; i++) {
    tilesets[data.tilesets[i].name] = new Tileset(data.tilesets[i].texture, data.tilesets[i].solidInfo);
  }

  var Events = {
    'Textbox': TextboxEvent,
    'Selection': SelectionEvent,
    'Delay': DelayEvent,
    'MapChange': MapChangeEvent,
    'Sound': SoundEvent,
    'Picture': PictureEvent,
    'SetVariable': SetVariableEvent,
    'Code': CodeEvent,
    'Conditional': ConditionalEvent
  };
  
  for (var i=0; i<data.maps.length; i++) {
    var mapTriggers = [];
    for (var j=0; j<data.maps[i].triggers.length; j++) {
      var eventStream = {};
      for (var k=0; k<Object.keys(data.maps[i].triggers[j].eventStream).length; k++) {
        var key = Object.keys(data.maps[i].triggers[j].eventStream)[k];
        eventStream[key] = [];
        for (var l=0; l<data.maps[i].triggers[j].eventStream[key].length; l++) {
          eventStream[key].push(new Events[data.maps[i].triggers[j].eventStream[key][l].type](...data.maps[i].triggers[j].eventStream[key][l].arguments));
        }
      }

      if (data.maps[i].triggers[j].type == 'Trigger') mapTriggers.push(new Trigger(data.maps[i].triggers[j].x, data.maps[i].triggers[j].y, data.maps[i].triggers[j].texture, data.maps[i].triggers[j].solidInfo, new EventPlayer(eventStream)));
      else if (data.maps[i].triggers[j].type = 'NPC') mapTriggers.push(new NPC(data.maps[i].triggers[j].x, data.maps[i].triggers[j].y, data.maps[i].triggers[j].texture, new EventPlayer(eventStream)));
    }
    maps[data.maps[i].name] = new Tilemap(tilesets[data.maps[i].tileset], data.maps[i].mapData, mapTriggers, data.maps[i].width, data.maps[i].height)
  }

  ready();

  minFPS = app.ticker.FPS;
  fpsText = new PIXI.Text(`${app.ticker.FPS}\n${minFPS}`, new PIXI.TextStyle({
    fontFamily: 'Raleway',
    fontSize: 12,
    fontWeight: 300,
    fill: '#FFFFFF',
    wordWrap: true,
    wordWrapWidth: 524
  }));
  debugGraphics.addChild(fpsText);

  app.ticker.add(delta => update(delta));
}

function update(delta) {
  if (debug) debugGraphics.clear();

  if (player) player.update(delta);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].update(delta);
  }
  for (var i=0; i<eventPlayers.length; i++) {
    eventPlayers[i].update(delta);
  }

  if (player) {
    viewport.x = Math.round(Math.clamp(viewportWidth / 2 - player.x - gridWidth / 2, -(map.width * gridWidth - viewportWidth), 0));
    viewport.y = Math.round(Math.clamp(viewportHeight / 2 - player.y - gridHeight / 2, -(map.height * gridHeight - viewportHeight), 0));
  }

  viewport.children.sort(zSort);

  if (!debug) return;
  debugGraphics.beginFill(0xFF0000, 0.5);
  for (var y=0; y<solid.length; y++) {
    for (var x=0; x<solid[y].length; x++) {
      if (solid[y][x][0]) debugGraphics.drawRect(x * gridWidth, (y + 0.9) * gridHeight, gridWidth, gridHeight * 0.1);
      if (solid[y][x][1]) debugGraphics.drawRect(x * gridWidth, y * gridHeight, gridWidth * 0.1, gridHeight);
      if (solid[y][x][2]) debugGraphics.drawRect((x + 0.9) * gridWidth, y * gridHeight, gridWidth * 0.1, gridHeight);
      if (solid[y][x][3]) debugGraphics.drawRect(x * gridWidth, y * gridHeight, gridWidth, gridHeight * 0.1);
    }
  }
  debugGraphics.endFill();

  if (app.ticker.FPS < minFPS) minFPS = app.ticker.FPS;
  fpsText.text = `${app.ticker.FPS}\n${minFPS}`;
  fpsText.x = -viewport.x;
  fpsText.y = -viewport.y;
}

function setDebug(x) {
  debug = debugGraphics.visible = x;
}

function keyDown(e) {
  if (player) player.keyDown(e.code);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].keyDown(e.code);
  }
  for (var i=0; i<eventPlayers.length; i++) {
    eventPlayers[i].keyDown(e.code);
  }
}

function keyUp(e) {
  if (player) player.keyUp(e.code);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].keyUp(e.code);
  }
  for (var i=0; i<eventPlayers.length; i++) {
    eventPlayers[i].keyUp(e.code);
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