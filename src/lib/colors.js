/* Meeple colours, handed out by seat order and never reshuffled, so a player
   keeps the same colour everywhere: avatar, score row, sheet header, rank bar. */
export const MEEPLE = [
  '#e24b41', // red
  '#2f8fd8', // blue
  '#f2b134', // gold
  '#45a97c', // green
  '#8a5fd6', // purple
  '#ef7f3c', // orange
  '#e267a6', // pink
  '#27b3b3', // teal
];

export const meepleColor = (index) => MEEPLE[index % MEEPLE.length];
