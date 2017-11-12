import { length, angle, rotateAroundPoint } from "../utils/points";

function sheet([x, y], width, length, dir) {
  return [
    [x, y],
    [x, y + width * dir],
    [x + length, y + width * dir],
    [x + length, y]
  ];
}

const maxSheetHeight = 200;
const notchHeight = 0;
const width = 122;

export const Sheet = inout => pair => {
  const _angle = angle(...pair);
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
    const rotate = rotateAroundPoint(sortedStart, _angle);
    const [x, y] = sortedStart;
    arr.push(
      sheet(
        [x + (maxSheetHeight * i - notchHeight * i) * d, y],
        width,
        (length + notchHeight * i) * d,
        dir
      ).map(rotate)
    );
  }
  return arr;
};
