import type { PlinkoDirection } from '../types';

export interface PlinkoPoint {
  x: number;
  y: number;
}

export interface PlinkoPeg extends PlinkoPoint {
  row: number;
  column: number;
}

export interface PlinkoGeometry {
  width: number;
  height: number;
  pegs: readonly PlinkoPeg[];
  path: readonly PlinkoPoint[];
  slotCenters: readonly number[];
}

export function buildPlinkoGeometry(
  rows: number,
  width: number,
  height: number,
  path: readonly PlinkoDirection[] = [],
): PlinkoGeometry {
  const horizontalUnit = width / (rows + 3);
  const top = 24;
  const bottomPadding = 44;
  const rowGap = (height - top - bottomPadding) / rows;

  const pegs: PlinkoPeg[] = [];
  for (let row = 0; row < rows; row += 1) {
    const count = row + 2;
    const y = top + (row + 1) * rowGap;
    for (let column = 0; column < count; column += 1) {
      pegs.push({
        row,
        column,
        x: width / 2 + (column - (count - 1) / 2) * horizontalUnit,
        y,
      });
    }
  }

  const pathPoints: PlinkoPoint[] = [{ x: width / 2, y: top - 8 }];
  let rights = 0;
  for (let step = 0; step < Math.min(path.length, rows); step += 1) {
    if (path[step] === 'right') {
      rights += 1;
    }
    const decisions = step + 1;
    pathPoints.push({
      x: width / 2 + (rights * 2 - decisions) * (horizontalUnit / 2),
      y: top + decisions * rowGap,
    });
  }

  const slotCenters = Array.from({ length: rows + 1 }, (_, slot) =>
    width / 2 + (slot - rows / 2) * horizontalUnit,
  );

  return {
    width,
    height,
    pegs,
    path: pathPoints,
    slotCenters,
  };
}
