class Trigger extends Entity {
  constructor(gridX, gridY, texture) {
    super(gridX, gridY, new PIXI.Sprite(texture));
  }
}