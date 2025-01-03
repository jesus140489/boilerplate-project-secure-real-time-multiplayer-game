import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import drawUI from './drawUI.mjs';
import generateStartPos from './utils/generateStartPos.mjs';
import drawDropShadow from './utils/drawDropShadow.mjs';
import gameConfig from './gameConfig.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');
const canvasWidth = (canvas.width = gameConfig.gameWindowWidth);
const canvasHeight = (canvas.height = gameConfig.gameWindowHeight);

let player;
let playerRank = 'Rank:   /  ';
const currentOpponents = [];
let currentCollectible;
let isEmittingCollision = false;

// Pre-load sprites
const loadSprite = (src) => {
  const sprite = new Image();
  sprite.src = src;
  return sprite;
};
const playerAvatar = loadSprite(gameConfig.avatar.playerSrc);
const opponentAvatar = loadSprite(gameConfig.avatar.opponentSrc);
const collectibleSprites = gameConfig.collectibleSprite.srcs.map((src) => {
  return loadSprite(src);
});

// When socket is connected
socket.on('connect', () => {
  // ...instantiate a player object
  const { x, y } = generateStartPos(gameConfig.playField, gameConfig.avatar);
  player = new Player({ x, y, id: socket.id });

  // ...notify server player joins the game
  socket.emit('joinGame', player);
});

// Collectible item from server
socket.on('collectible', (collectible) => {
  // If collectible item already exists
  if (currentCollectible) {
    // ...update its state
    currentCollectible.setState(collectible);
    // Reset the isEmittingCollision to false, so we
    // can notify server when player collides with the
    // new collectible item
    isEmittingCollision = false;
  }
  // Otherwise instantiate a new collectible item object
  else {
    currentCollectible = new Collectible(collectible);
  }
});

// Player scored
socket.on('scored', (newScore) => {
  player.score = newScore;
  playerRank = player.calculateRank([player, ...currentOpponents]);
});

// Get current opponents
socket.on('currentOpponents', (opponents) => {
  opponents.forEach((opponent) => {
    currentOpponents.push(new Player(opponent));
  });

  playerRank = player.calculateRank([player, ...currentOpponents]);
});

// New opponent joined the game
socket.on('newOpponent', (opponent) => {
  currentOpponents.push(new Player(opponent));
  playerRank = player.calculateRank([player, ...currentOpponents]);
});

// Listen for opponent's state change
socket.on('opponentStateChange', ({ x, y, score, id, dir }) => {
  const opponent = currentOpponents.find((opponent) => opponent.id === id);
  opponent.x = x;
  opponent.y = y;
  opponent.score = score;
  opponent.dir = dir;
  playerRank = player.calculateRank([player, ...currentOpponents]);
});

// Opponent leaves
socket.on('opponentLeave', (id) => {
  const opponentIndex = currentOpponents.findIndex(
    (opponent) => opponent.id === id
  );
  currentOpponents.splice(opponentIndex, 1);
  playerRank = player.calculateRank([player, ...currentOpponents]);
});

// User moves his/her avatar
document.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
      player.dir = 'up';
      break;
    case 's':
      player.dir = 'down';
      break;
    case 'a':
      player.dir = 'left';
      break;
    case 'd':
      player.dir = 'right';
      break;
    default:
    // do nothing
  }
  socket.emit('playerStateChange', player);
});

// User stops moving his/her avatar
document.addEventListener('keyup', ({ key }) => {
  if (player && (key === 'w' || key === 's' || key === 'a' || key === 'd')) {
    player.dir = null;
    socket.emit('playerStateChange', player);
  }
});

// Render the game on to canvas
function renderGame() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw game UI
  drawUI(ctx, playerRank);

  // Draw collectible
  if (currentCollectible) {
    currentCollectible.draw(ctx, collectibleSprites);
  }

  // Draw player's avatar
  if (player) {
    player.draw(ctx, playerAvatar);
  }

  // Draw each opponent's avatar
  for (const opponent of currentOpponents) {
    opponent.draw(ctx, opponentAvatar);
  }

  // Draw drop shadow to all sprites on current canvas
  drawDropShadow(ctx);

  // Check collision between player's avatar and collectible item
  if (player && currentCollectible) {
    // If they collide, notify server once
    if (player.collision(currentCollectible) && !isEmittingCollision) {
      socket.emit('playerCollideWithCollectible', player);
      // We already notified server, so we don't need to notify again
      isEmittingCollision = true;
    }
  }

  requestAnimationFrame(renderGame);
}
requestAnimationFrame(renderGame);