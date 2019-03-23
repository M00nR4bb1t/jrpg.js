class Tileset {
  constructor(texture, solidTiles) {
    this.textures = [];
    this.solidTiles = solidTiles;
    for (var j=0; j<texture.height / gridHeight; j++) {
      for (var i=0; i<texture.width / gridWidth; i++) {
        this.textures.push(new PIXI.Texture(texture, new PIXI.Rectangle(i * gridWidth, j * gridHeight, gridWidth, gridHeight)));
      }
    }
  }
}

class Tilemap {
  constructor(container, tileset, layers, width, height) {
    this.graphics = new PIXI.Graphics();
    this.tileset = tileset;
    this.width = width;
    this.height = height;
    this.container = new PIXI.Container();
    
    this.solid = [];
    for (var y=0; y<height; y++) {
      this.solid.push([]);
      for (var x=0; x<width; x++) {
        this.solid[y].push(false);
      }
    }

    for (var z=0; z<layers.length; z++) {
      for (var y=0; y<height; y++) {
        for (var x=0; x<width; x++) {
          var tile = layers[z][y][x];
          var sprite = new PIXI.Sprite(this.tileset.textures[tile]);
          sprite.x = x * gridWidth;
          sprite.y = y * gridHeight;
          this.container.addChild(sprite);
          this.solid[y][x] = (this.tileset.solidTiles.indexOf(tile) != -1) || this.solid[y][x];
        }
      }
    }

    this.brt = new PIXI.BaseRenderTexture(width * gridWidth, height * gridHeight, PIXI.SCALE_MODES.LINEAR, 1);
    this.rt = new PIXI.RenderTexture(this.brt);
    container.addChild(new PIXI.Sprite(this.rt));
    this.draw();
  }

  draw() {
    app.renderer.render(this.container, this.rt);
  }
}