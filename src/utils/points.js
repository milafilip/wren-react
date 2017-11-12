const _getXY = (start, end) => [end[0] - start[0], end[1] - start[1]];

/**
 * Rotates a point rotated around a given axis point (in radians)
 * @returns {Array}
 */
export const rotateAroundPoint = ([originX, originY], angle = 0) => (
  [pointX, pointY]
) => {
  return [
    Math.cos(angle) * (pointX - originX) -
      Math.sin(angle) * (pointY - originY) +
      originX,
    Math.sin(angle) * (pointX - originX) +
      Math.cos(angle) * (pointY - originY) +
      originY
  ];
};

/**
 * Calculates the angle (in radians) of a line drawn between two points
 * @returns {Number}
 */
export const angle = (start, end) => {
  const [x, y] = _getXY(start, end);
  return Math.atan2(y, x);
};

/**
 * Converts radians into degrees of rotation
 * @returns {Number}
 */
export const rad2deg = rads => rads / Math.PI * 180;

/**
 * Calculates the distance between two points
 * @returns {Number}
 */
export const length = (start, end) => {
  const [x, y] = _getXY(start, end);
  return Math.hypot(x, y);
};

export function clockwiseSort(input, firstPointIndex = 0) {
  if (!Array.isArray(input) || input.length === 0) return input;

  const b = bounds(input);
  const arr = [];

  for (let i = 0; i < input.length; i++) {
    arr[i] = [
      input[i][0],
      input[i][1],
      input[i][0] - b.offsetX,
      input[i][1] - b.offsetY
    ];
  }

  const base = Math.atan2(arr[firstPointIndex][3], arr[firstPointIndex][2]);

  return arr
    .sort(function(a, b) {
      return (
        Math.atan2(b[3], b[2]) -
        Math.atan2(a[3], a[2]) +
        (Math.atan2(b[3], b[2]) > base ? -2 * Math.PI : 0) +
        (Math.atan2(a[3], a[2]) > base ? 2 * Math.PI : 0)
      );
    })
    .map(points => points.slice(0, 2));
}

export function bounds(points) {
  const b = points.reduce(
    (o, v) => {
      if (v[0] < o.minX) o.minX = v[0];
      if (v[0] > o.maxX) o.maxX = v[0];
      if (v[1] < o.minY) o.minY = v[0];
      if (v[1] > o.maxY) o.maxY = v[0];
      return o;
    },
    {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity
    }
  );

  b.offsetX = b.minX + (b.maxX - b.minX) / 2;
  b.offsetY = b.minY + (b.maxY - b.minY) / 2;

  return b;
}

function centroid(pts) {
  var first = pts[0],
    last = pts[pts.length - 1];
  if (first[0] != last[0] || first[1] != last[1]) pts.push(first);
  var twicearea = 0,
    x = 0,
    y = 0,
    nPts = pts.length,
    p1,
    p2,
    f;
  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = pts[i];
    p2 = pts[j];
    f = p1[0] * p2[1] - p2[0] * p1[1];
    twicearea += f;
    x += (p1[0] + p2[0]) * f;
    y += (p1[1] + p2[1]) * f;
  }
  f = twicearea * 3;
  return [x / f, y / f];
}
