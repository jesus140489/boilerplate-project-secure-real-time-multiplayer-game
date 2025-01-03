const gameConfig = {
  title: 'Bone Race',
  controlInfo: 'Controls: WASD',
  gameWindowWidth: 640,
  gameWindowHeight: 480,
  padding: 8,
  infoFieldHeight: 50,
  get playField() {
    return {
      width: this.gameWindowWidth - 2 * this.padding,
      height: this.gameWindowHeight - this.padding - this.infoFieldHeight,
    };
  },
  avatar: {
    width: 40,
    height: 40,
    playerSrc: '/assets/player.png',
    opponentSrc: '/assets/opponent.png',
  },
  collectibleSprite: {
    width: 38,
    height: 18,
    srcs: ['/assets/bone1.png', '/assets/bone2.png', '/assets/bone3.png'],
  },
};

export default gameConfig;
