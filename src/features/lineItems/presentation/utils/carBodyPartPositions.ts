export interface CarPosition {
  x: number;
  y: number;
}

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

// Positions in % over the top-down car image (car-top.png).
// Body parts are user-defined in database, so they are matched by keywords.
export const getCarPosition = (bodyPartName: string): CarPosition | undefined => {
  const name = normalize(bodyPartName);
  const left = /gauche|\bg\b/.test(name);
  const right = /droit|\bd\b/.test(name);
  const rear = /arriere|\bar\b/.test(name);
  const front = /avant|\bav\b/.test(name) || !rear;
  const x = (l: number, r: number) => (left ? l : right ? r : undefined);

  if (/retro/.test(name)) {
    const px = x(30, 68);
    return px === undefined ? undefined : { x: px, y: 37 };
  }
  if (/pare.?chocs?|pare.?choc/.test(name)) return { x: 50, y: rear ? 93 : 3 };
  if (/capot/.test(name)) return { x: 50, y: 11 };
  if (/toit|pavillon/.test(name)) return { x: 50, y: 53 };
  if (/coffre|hayon/.test(name)) return { x: 50, y: 76 };
  if (/porte/.test(name)) {
    const px = x(15, 85);
    return px === undefined ? undefined : { x: px, y: rear ? 65 : 49 };
  }
  if (/aile/.test(name)) {
    const px = rear ? x(19, 81) : front ? x(15, 85) : undefined;
    return px === undefined ? undefined : { x: px, y: rear ? 82 : 21 };
  }
  return undefined;
};
