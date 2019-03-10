class Tilemap {
  constructor(tileset, layers, width, height) {
    this.graphics = new PIXI.Graphics();
    this.tileset = tileset;
    this.container = new PIXI.Container();
    
    var temp;
    for (var z=0; z<layers.length; z++) {
      for (var y=0; y<layers[z].length; y++) {
        for (var x=0; x<layers[z][y].length; x++) {
          temp = new PIXI.Sprite(this.tileset[layers[z][y][x]]);
          temp.x = x * gridWidth;
          temp.y = y * gridHeight;
          this.container.addChild(temp);
        }
      }
    }

    this.brt = new PIXI.BaseRenderTexture(width * gridWidth, height * gridHeight, PIXI.SCALE_MODES.LINEAR, 1);
    this.rt = new PIXI.RenderTexture(this.brt);
    this.sprite = new PIXI.Sprite(this.rt);
    this.draw();
  }

  static getTileset(texture) {
    var tileset = [];
    for (var j=0; j<texture.height / gridHeight; j++) {
      for (var i=0; i<texture.width / gridWidth; i++) {
        tileset.push(new PIXI.Texture(texture, new PIXI.Rectangle(i * gridWidth, j * gridHeight, gridWidth, gridHeight)));
      }
    }
    return tileset;
  }

  draw() {
    app.renderer.render(this.container, this.rt);
  }
}