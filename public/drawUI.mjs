import gameConfig from './gameConfig.mjs';

const {
  title,
  controlInfo,
  gameWindowWidth,
  padding,
  infoFieldHeight,
  playField,
} = gameConfig;

export default function drawUI(ctx, playerRank) {
  // Play field border
  ctx.beginPath();
  ctx.rect(padding, infoFieldHeight, playField.width, playField.height);
  ctx.strokeStyle = '#a8a8ac';
  ctx.stroke();
  ctx.closePath();

  // Game info text y position
  const infoTextPosY = infoFieldHeight / 1.5;

  // Game control
  ctx.fillStyle = '#ffffff';
  ctx.font = `13px 'Press Start 2P'`;
  ctx.textAlign = 'start';
  ctx.fillText(controlInfo, padding, infoTextPosY);

  // Game title
  ctx.font = `15px 'Press Start 2P'`;
  ctx.textAlign = 'center';
  ctx.fillText(title, gameWindowWidth / 2, infoTextPosY);

  // Player's rank
  ctx.font = `13px 'Press Start 2P'`;
  ctx.textAlign = 'end';
  ctx.fillText(playerRank, gameWindowWidth - padding, infoTextPosY);
}
