import gameConfig from './gameConfig.mjs';

const playFieldOffsetLeft = gameConfig.padding;
const playFieldOffsetTop = gameConfig.infoFieldHeight;

const collectibleSprite = gameConfig.collectibleSprite;
const spriteWidth = collectibleSprite.width;
const spriteHeight = collectibleSprite.height;

class Collectible {
  constructor({ x, y, value = 1, id, spriteSrcIndex = 0 }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.spriteSrcIndex = spriteSrcIndex;
  }

  setState({ x, y, value = 1, id, spriteSrcIndex }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.spriteSrcIndex = spriteSrcIndex;
  }

  draw(ctx, sprites) {
    const x = this.x + playFieldOffsetLeft;
    const y = this.y + playFieldOffsetTop;
    const image = sprites[this.spriteSrcIndex];
    ctx.drawImage(image, x, y, spriteWidth, spriteHeight);
  }
}

export default Collectible;