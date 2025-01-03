export default function generateStartPos(playField, sprite) {
  return {
    x: Math.random() * (playField.width - sprite.width),
    y: Math.random() * (playField.height - sprite.height),
  };
}
