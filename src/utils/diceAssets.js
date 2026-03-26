/** Rutas públicas para iconos de dados (Vite: carpeta `public/dices`). */
export const DICE_IMAGE_BY_TYPE = {
  4: "/dices/d4.png",
  6: "/dices/d6.png",
  8: "/dices/d8.png",
  10: "/dices/d10.png",
  12: "/dices/d12.png",
  20: "/dices/d20.png",
  100: "/dices/d100.png",
};

export function getDiceImageSrc(dieType) {
  return DICE_IMAGE_BY_TYPE[dieType] ?? DICE_IMAGE_BY_TYPE[20];
}
