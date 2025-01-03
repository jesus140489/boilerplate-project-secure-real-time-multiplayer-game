export default function drawDropShadow(ctx) {
  ctx.shadowColor = 'rgba(0, 0, 0, .7)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}
