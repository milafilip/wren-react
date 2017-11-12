import { length, angle, rotateAroundPoint } from "../utils/points";

const maxSheetHeight = 200;
const notchHeight = 0;
const width = 122;

const NUM_DIMENSIONS = 2;

const dimensions = number => number === NUM_DIMENSIONS;

function sheet([x, y], width, length, dir, pos, rot) {
  const rotate = rotateAroundPoint(pos, rot);
  const ob = {
    pts: [
      [x, y],
      [x, y + width * dir],
      [x + length, y + width * dir],
      [x + length, y]
    ],
    pos,
    rot
  };
  if (dimensions(2)) ob.pts = ob.pts.map(rotate);
  return ob;
}

export const Sheet = inout => pair => {
  const start = pair[0];
  const end = pair[1];
  const totalLength = length(start, end);

  const dir = inout === "inner" ? 1 : -1;

  let sortedStart = start;
  let d = 1;
  if (start[1] < end[1]) {
    sortedStart = end;
    d = -1;
  }
  let arr = [];
  const numSheets = Math.ceil(totalLength / maxSheetHeight);
  for (let i = 0; i < numSheets; i++) {
    const length = Math.min(totalLength - maxSheetHeight * i, maxSheetHeight);
    const [x, y] = dimensions(2) ? sortedStart : [0, 0];

    arr.push(
      sheet(
        [x + (maxSheetHeight * i - notchHeight * i) * d, y],
        width,
        (length + notchHeight * i) * d,
        dir,
        sortedStart,
        angle(...pair)
      )
    );
  }
  return arr;
};
