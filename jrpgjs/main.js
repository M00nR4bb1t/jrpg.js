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
PIXI.Loader.shared.add('knight', 'res/characters/knight.png')
                  .add('joe', 'res/characters/joe.png')
                  .add('darkdimension', 'res/tilesets/darkdimension.png')
                  .add('voice', 'res/se/voice.wav')
                  .add('nineslice', 'res/gui/nineslice.png')
                  .load(setup);

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

function zSort(a, b) {
  return a.z - b.z;
}

function setup() {
  setDebug(false);

  party = {
    default: 'knight',
    'knight': {
      texture: PIXI.Loader.shared.resources['knight'].texture
    }
  };

  tilesets = {
    'darkdimension': new Tileset(PIXI.Loader.shared.resources['darkdimension'].texture, {
      "65": [true,true,true,true],
      "66": [true,true,true,true],
      "88": [true,true,true,true],
      "89": [true,true,true,true],
      "90": [true,true,true,true],
      "91": [true,true,true,true],
      "92": [true,true,true,true],
      "93": [true,true,true,true],
      "94": [true,true,true,true],
      "95": [true,true,true,true],
      "117": [true,true,true,true],
      "118": [true,true,true,true],
      "119": [true,true,true,true],
      "120": [true,true,true,true],
      "121": [true,true,true,true],
      "122": [true,true,true,true],
      "123": [true,true,true,true],
      "124": [true,true,true,true],
      "146": [true,true,true,true],
      "147": [true,true,true,true],
      "148": [true,true,true,true],
      "149": [true,true,true,true],
      "150": [true,true,true,true],
      "151": [true,true,true,true],
      "152": [true,true,true,true],
      "153": [true,true,true,true],
      "178": [true,true,true,true],
      "179": [true,true,true,true],
      "180": [true,true,true,true],
      "181": [true,true,true,true],
      "182": [true,true,true,true],
      "207": [false,true,false,true],
      "208": [false,false,false,true],
      "209": [false,false,true,true],
      "236": [false,true,false,false],
      "238": [false,false,true,false],
      "265": [true,true,false,false],
      "266": [true,false,false,false],
      "267": [true,false,true,false],
      "294": [false,true,false,false],
      "296": [false,false,true,false],
      "297": [false,true,true,false],
      "323": [true,true,false,false],
      "324": [true,false,false,false],
      "325": [true,false,true,false],
      "326": [false,true,true,false],
      "381": [true,true,false,false],
      "382": [true,false,false,false],
      "383": [true,false,true,false]
    })
  };
  maps = {
    'darkdimension': new Tilemap(tilesets['darkdimension'], [
      [
        [468,495,497,466,437,529,526,470,528,528,529,497,523,437,437,468,530,528,525,495,470,440,529,441,523],
        [442,436,524,523,439,496,438,471,440,441,466,443,494,443,496,526,499,467,523,494,501,442,472,439,468],
        [501,438,437,523,436,465,524,524,467,495,496,498,472,471,498,465,528,500,496,465,499,436,497,469,465],
        [500,466,440,523,498,499,498,494,498,497,523,526,497,499,465,465,440,470,494,442,469,523,443,528,495],
        [441,496,523,466,439,500,441,468,501,468,436,469,436,466,438,436,437,528,500,524,440,440,523,437,466],
        [499,498,529,467,495,467,439,495,496,530,529,500,497,528,469,441,440,469,437,443,467,443,526,501,436],
        [441,529,528,472,523,470,529,527,497,494,494,528,529,499,530,438,530,528,465,530,501,437,495,465,471],
        [499,499,500,436,528,441,443,499,439,471,468,468,440,443,523,500,440,529,469,440,530,469,501,529,523],
        [496,471,499,440,499,442,440,437,526,468,529,470,525,523,500,437,469,525,437,498,468,437,440,467,468],
        [524,466,528,471,442,499,496,471,523,496,530,470,470,467,527,439,436,442,471,466,441,472,495,527,469],
        [494,525,467,495,495,526,499,494,437,467,470,466,524,466,468,530,465,501,501,442,494,442,523,494,528],
        [530,523,501,524,527,440,496,529,441,524,529,496,499,471,528,496,526,469,526,469,500,524,497,500,499],
        [442,439,470,436,443,467,440,472,436,494,529,525,470,501,440,524,440,496,471,465,438,439,526,523,467],
        [467,499,499,500,469,524,498,470,443,437,524,436,527,469,436,467,527,527,441,472,439,438,501,496,469],
        [495,465,526,529,529,529,472,523,472,494,500,498,465,495,526,526,442,467,497,526,436,443,472,500,530],
        [436,438,529,497,501,441,499,467,470,526,471,526,523,442,467,497,468,500,442,440,438,498,472,528,467],
        [529,438,528,500,529,498,528,470,497,494,441,472,499,494,523,439,527,500,466,528,530,468,465,443,470],
        [443,524,438,469,526,436,470,529,441,472,498,470,525,441,529,437,524,494,501,471,496,496,528,472,494],
        [500,526,470,442,468,496,525,465,494,523,496,437,470,467,499,436,472,530,438,440,465,442,466,530,501],
        [441,499,525,442,500,494,471,494,443,438,527,441,523,497,496,442,438,528,528,494,498,441,468,525,436],
        [529,528,465,497,494,525,436,499,529,469,440,501,525,499,524,497,526,501,469,471,499,495,439,498,496],
        [499,497,495,495,468,523,468,501,466,499,501,526,497,494,527,438,470,524,471,436,470,438,469,438,443],
        [525,524,501,529,526,465,436,528,437,443,494,528,468,523,471,468,496,465,466,441,524,467,528,438,494],
        [443,441,440,496,501,439,525,472,499,470,523,439,525,498,467,494,523,441,442,470,437,442,524,443,524],
        [442,443,441,437,468,499,436,529,441,467,468,498,466,440,436,527,466,524,441,441,499,526,496,523,443]
      ], [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,207,208,208,208,208,208,208,208,209,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,207,208,210,33,237,31,31,31,31,237,211,208,209,-1,-1,-1],
        [-1,-1,-1,-1,-1,207,208,208,208,210,33,237,237,31,31,31,31,31,237,237,237,211,209,-1,-1],
        [-1,-1,-1,207,208,210,32,31,31,237,237,31,31,31,237,31,31,33,237,237,237,237,238,-1,-1],
        [-1,-1,207,210,237,262,263,264,31,32,32,237,237,237,31,31,33,237,237,31,32,31,211,209,-1],
        [-1,207,210,31,262,350,292,351,264,262,263,263,264,237,31,31,237,237,237,31,237,31,31,238,-1],
        [-1,236,31,262,350,292,292,292,351,350,292,292,351,264,237,237,237,237,237,33,237,31,31,238,-1],
        [-1,236,31,291,292,292,292,292,292,292,292,292,292,293,31,31,237,237,31,237,31,33,32,238,-1],
        [-1,236,31,291,292,292,292,292,292,292,380,321,321,322,33,237,31,237,237,31,31,237,31,238,-1],
        [-1,236,31,320,379,292,292,292,292,380,322,31,237,237,32,237,31,237,237,31,33,31,237,238,-1],
        [-1,265,266,239,320,379,292,292,292,293,31,237,240,266,266,266,239,237,237,31,237,31,237,238,-1],
        [-1,294,295,236,31,291,292,292,292,293,237,240,267,295,295,295,265,239,237,237,237,31,31,238,-1],
        [-1,294,295,236,31,320,321,379,292,293,31,238,296,295,295,295,294,236,31,31,237,237,32,238,-1],
        [-1,294,295,265,266,266,239,320,321,322,240,267,296,295,295,295,294,236,237,33,237,33,32,238,-1],
        [-1,294,295,294,295,295,236,237,31,31,238,296,296,295,295,295,294,236,237,31,237,31,237,238,-1],
        [-1,294,295,294,295,295,265,266,266,266,267,296,296,295,295,295,294,236,31,31,31,237,32,238,-1],
        [-1,294,295,294,295,295,294,295,295,295,296,296,296,295,295,295,294,236,33,33,237,240,266,267,-1],
        [-1,294,295,294,295,295,294,295,295,295,296,296,296,295,295,295,294,236,33,33,237,238,295,296,-1],
        [-1,294,295,294,295,295,294,295,295,295,296,296,296,295,295,295,294,265,266,266,266,267,295,296,-1],
        [-1,294,295,294,295,295,294,295,295,295,296,296,296,295,295,295,294,294,295,295,295,296,295,296,-1],
        [-1,294,295,294,295,295,294,295,295,295,296,296,296,295,295,295,294,294,295,295,295,296,295,296,-1],
        [-1,294,295,294,295,295,294,295,295,295,296,296,296,295,295,295,294,294,295,295,295,296,295,296,-1]
      ], [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,207,208,208,208,208,208,209,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,236,31,237,237,237,31,238,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,236,237,31,237,31,237,238,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,236,237,31,31,237,237,238,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,90,-1,-1,265,266,239,237,31,31,238,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,92,-1,-1,65,66,-1,-1,-1,-1,294,295,265,266,266,268,267,-1,-1,-1],
        [-1,-1,-1,-1,93,-1,-1,-1,-1,94,95,-1,92,-1,-1,381,382,294,295,295,297,296,-1,-1,-1],
        [-1,-1,-1,-1,-1,65,66,-1,93,-1,-1,-1,-1,-1,-1,-1,-1,381,382,382,326,383,-1,-1,-1],
        [-1,-1,-1,-1,-1,94,95,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,92,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,180,-1,-1,-1],
        [-1,-1,-1,-1,-1,90,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,123,124,-1,177,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,152,153,-1,206,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,180,-1,-1,180,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,123,124,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,181,182,152,153,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,180,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      ]
    ], [
      new NPC(5, 5, PIXI.Loader.shared.resources['joe'].texture, new EventPlayer({
        'main': [
          new TextboxEvent('Why, hello there, young man!', '???', PIXI.Loader.shared.resources['voice'].sound),
          new TextboxEvent('The name\'s Joe! Nice to meet you!', 'Joe', PIXI.Loader.shared.resources['voice'].sound),
          new DelayEvent(180),
          new TextboxEvent('Well, I hope to see you around.', 'Joe', PIXI.Loader.shared.resources['voice'].sound)
        ]
      })),
      new Trigger(21, 15, null, [true, true, true, true], new EventPlayer({
        'main': [
          new TextboxEvent('A diamond crystal. It\'s floating..?', null, PIXI.Loader.shared.resources['voice'].sound),
          new SelectionEvent('Take it?', [{text: 'Yes', channel: 'take'}, {text: 'No', channel: 'dontTake'}], null, PIXI.Loader.shared.resources['voice'].sound)
        ],
        'take': [
          new DelayEvent(120),
          new TextboxEvent('You try to take the diamond crystal, but it doesn\'t budge.', null, PIXI.Loader.shared.resources['voice'].sound)
        ],
        'dontTake': [
          new TextboxEvent('The diamond crystal is glowing. It feels like it\'s pulling my hand towards it.', 'Knight', PIXI.Loader.shared.resources['voice'].sound),
          new SelectionEvent('Reach out and touch the crystal?', [{text: 'Yes', channel: 'touch'}, {text: 'No'}], null, PIXI.Loader.shared.resources['voice'].sound)
        ],
        'touch': [
          new MapChangeEvent('tproom', 8, 5, 0)
        ]
      }))
    ], 25, 25),
    'tproom': new Tilemap(tilesets['darkdimension'], [
      [
        [524,525,439,467,468,468,436,523,501,498,527,499,528,443,499,528,471],
        [530,440,527,466,466,501,466,467,442,465,524,528,470,468,470,494,494],
        [469,527,495,443,524,496,472,436,497,499,440,469,437,523,437,470,528],
        [468,468,529,495,443,528,497,500,468,529,468,523,527,500,472,499,466],
        [530,500,468,472,530,497,500,527,466,441,469,471,438,525,465,529,441],
        [523,526,525,467,523,501,439,443,439,467,523,499,441,500,442,471,469],
        [499,443,468,500,528,439,467,472,496,442,436,494,436,528,523,440,528],
        [443,439,442,494,525,437,524,498,465,438,529,465,526,494,440,440,472],
        [495,470,439,527,501,529,443,525,469,440,439,500,441,440,472,439,524],
        [525,494,470,530,523,467,530,498,530,466,467,494,498,529,465,524,470],
        [437,525,437,498,439,465,500,436,528,468,528,467,443,441,523,525,498],
        [494,442,525,441,465,443,523,466,468,443,442,529,472,526,465,494,470],
        [468,524,526,498,529,467,524,529,498,467,495,530,469,499,441,529,530]
      ], [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,213,214,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,242,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,271,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,300,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,329,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      ], [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,207,208,208,208,209,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,236,37,35,37,238,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,236,36,36,32,238,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,265,266,266,266,267,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,294,295,295,295,296,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,381,382,382,382,383,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      ], [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,177,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,206,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,365,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,177,-1,-1,394,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,206,-1,-1,423,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,452,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,480,481,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      ]
    ], [
      new Trigger(8, 4, null, [true, true, true, true], new EventPlayer({
        'main': [
          new TextboxEvent('I think this is a portal back to the dark dimension.', 'Knight', PIXI.Loader.shared.resources['voice'].sound),
          new SelectionEvent('Go through the portal?', [{text: 'Yes', channel: 'teleport'}, {text: 'No'}], null, PIXI.Loader.shared.resources['voice'].sound)
        ],
        'teleport': [
          new MapChangeEvent('darkdimension', 20, 15, 1)
        ]
      })),
      new Trigger(8, 7, null, [true, true, true, true], new EventPlayer({
        'main': [
          new TextboxEvent('I think this is a portal back home.', 'Knight', PIXI.Loader.shared.resources['voice'].sound),
          new SelectionEvent('Go through the portal?', [{text: 'Yes', channel: 'teleport'}, {text: 'No'}], null, PIXI.Loader.shared.resources['voice'].sound)
        ],
        'teleport': [
          new DelayEvent(120),
          new TextboxEvent('...I can\'t get the portal to activate.', 'Knight', PIXI.Loader.shared.resources['voice'].sound)
        ]
      }))
    ], 17, 13)
  };

  eventPlayers.push(new EventPlayer({
    'main': [
      new PictureEvent(PIXI.Loader.shared.resources['knight'].texture, 0, 0, viewportWidth, viewportHeight, true, 'titleBG'),
      new SelectionEvent(null, [{text: 'New Game', channel: 'newGame'}, {text: 'Load Game', channel: ''}, {text: 'Options', channel: ''}, {text: 'End Game', channel: ''}]),
    ], 
    'newGame': [
      new CodeEvent('app.stage.removeChild(variables.titleBG);'),
      new MapChangeEvent('darkdimension', 7, 11, 0)
    ]
  }));
  eventPlayers[0].play();

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