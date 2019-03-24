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
    this.tileset = tileset;
    this.width = width;
    this.height = height;
    this.container = new PIXI.Container();
    
    this.solid = [];
    for (var y=0; y<height; y++) {
      this.solid.push([]);
      for (var x=0; x<width; x++) {
        this.solid[y].push([false, false, false, false]);
      }
    }

    for (var z=0; z<layers.length; z++) {
      for (var y=0; y<height; y++) {
        for (var x=0; x<width; x++) {
          var tile = layers[z][y][x];
          if (tile == -1) continue;
          var sprite = new PIXI.Sprite(this.tileset.textures[tile]);
          sprite.x = x * gridWidth;
          sprite.y = y * gridHeight;
          this.container.addChild(sprite);
          if (tileset.solidTiles[tile]) this.solid[y][x] = [this.solid[y][x][0] || tileset.solidTiles[tile][0], this.solid[y][x][1] || tileset.solidTiles[tile][1], this.solid[y][x][2] || tileset.solidTiles[tile][2], this.solid[y][x][3] || tileset.solidTiles[tile][3]];
        }
      }
    }

    this.brt = new PIXI.BaseRenderTexture(width * gridWidth, height * gridHeight, PIXI.SCALE_MODES.LINEAR, 1);
    this.rt = new PIXI.RenderTexture(this.brt);
    var sprite = new PIXI.Sprite(this.rt);
    sprite.z = 0;
    container.addChild(sprite);
    this.draw();
  }

  draw() {
    app.renderer.render(this.container, this.rt);
  }
}