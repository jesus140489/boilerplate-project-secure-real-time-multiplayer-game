import gameConfig from './gameConfig.mjs';

const playField = gameConfig.playField;
const playFieldWidth = playField.width;
const playFieldHeight = playField.height;
const playFieldOffsetLeft = gameConfig.padding;
const playFieldOffsetTop = gameConfig.infoFieldHeight;

const avatar = gameConfig.avatar;
const avatarWidth = avatar.width;
const avatarHeight = avatar.height;

const collectibleSprite = gameConfig.collectibleSprite;
const collectibleSpriteWidth = collectibleSprite.width;
const collectibleSpriteHeight = collectibleSprite.height;

class Player {
  constructor({ x, y, score = 0, id }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.speed = 5;
    this.dir = null;
  }

  draw(ctx, image) {
    // If user hits one of the control key,
    // update player's position every frame
    if (this.dir) {
      this.movePlayer(this.dir, this.speed);
    }

    const x = this.x + playFieldOffsetLeft;
    const y = this.y + playFieldOffsetTop;
    ctx.drawImage(image, x, y, avatarWidth, avatarHeight);
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
        this.y = this.y - speed >= 0 ? this.y - speed : 0;
        break;
      case 'down':
        this.y =
          this.y + speed <= playFieldHeight - avatarHeight
            ? this.y + speed
            : playFieldHeight - avatarHeight;
        break;
      case 'right':
        this.x =
          this.x + speed <= playFieldWidth - avatarWidth
            ? this.x + speed
            : playFieldWidth - avatarWidth;
        break;
      case 'left':
        this.x = this.x - speed >= 0 ? this.x - speed : 0;
      default:
        this.x = this.x;
        this.y = this.y;
    }
  }

  collision(collectible) {
    // Get top left coordinate of player's avatar
    // bounding rectangle
    const l1 = {
      x: this.x,
      y: this.y,
    };
    // Get bottom right coordinate of player's avatar
    // bounding rectangle
    const r1 = {
      x: this.x + avatarWidth,
      y: this.y + avatarHeight,
    };

    // Get top left coordinate of collectible item's sprite
    // bounding rectangle
    const l2 = {
      x: collectible.x,
      y: collectible.y,
    };
    // Get bottom right coordinate of collectible item's sprite
    // bounding rectangle
    const r2 = {
      x: collectible.x + collectibleSpriteWidth,
      y: collectible.y + collectibleSpriteHeight,
    };

    // If one rectangle is on left side of other
    if (l1.x >= r2.x || l2.x >= r1.x) {
      return false;
    }

    // If one rectangle is above other
    if (r1.y <= l2.y || r2.y <= l1.y) {
      return false;
    }

    return true;
  }

  calculateRank(players) {
    const numOfPlayers = players.length;
    let rank;

    if (this.score === 0) {
      rank = numOfPlayers;
    } else {
      const sortedPlayers = players.sort(
        (playerA, playerB) => playerB.score - playerA.score
      );
      rank = sortedPlayers.findIndex((player) => player.id === this.id) + 1;
    }
    return `Rank: ${rank} / ${numOfPlayers}`;
  }
}

export default Player;