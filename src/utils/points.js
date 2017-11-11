export function clockwiseSort(input, firstPointIndex = 0) {
  if (!Array.isArray(input) || input.length === 0) return input

  const b = bounds(input);
  const arr = []

  for (let i = 0; i < input.length; i++) {
    arr[i] = [
      input[i][0],
      input[i][1],
      input[i][0] - b.offsetX,
      input[i][1] - b.offsetY
    ]
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
      else if (v[0] > o.maxX) o.maxX = v[0];
      if (v[1] < o.minY) o.minY = v[0];
      else if (v[1] > o.maxY) o.maxY = v[0];
      return o;
    },
    {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity
    }
  );

  b.offsetX = (b.maxX - b.minX) / 2;
  b.offsetY = (b.maxY - b.minY) / 2;

  return b;
}
