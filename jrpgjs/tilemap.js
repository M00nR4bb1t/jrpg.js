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
  constructor(tileset, layers, triggers, width, height) {
    this.tileset = tileset;
    this.triggers = triggers;
    this.width = width;
    this.height = height;
    this.graphics = new PIXI.Graphics();
    this.graphics.z = 0;
    
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
          this.graphics.beginTextureFill(this.tileset.textures[tile]);
          this.graphics.drawRect(x * gridWidth, y * gridHeight, gridWidth, gridHeight);
          this.graphics.endFill();
          if (tileset.solidTiles[tile]) this.solid[y][x] = [this.solid[y][x][0] || tileset.solidTiles[tile][0], this.solid[y][x][1] || tileset.solidTiles[tile][1], this.solid[y][x][2] || tileset.solidTiles[tile][2], this.solid[y][x][3] || tileset.solidTiles[tile][3]];
        }
      }
    }
  }

  addTo(container) {
    container.addChild(this.graphics);
  }

  remove() {
    this.graphics.parent.removeChild(this.graphics);
  }
}