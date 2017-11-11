import {clockwiseSort} from "../utils/points"

test('sorts points clockwise from first point', () => {
  // anticlockwise
  const points = [
    [0,0],
    [1,0],
    [1,1],
    [0,1],
  ]
  // clockwise
  const result = [
    [0,0],
    [0,1],
    [1,1],
    [1,0],
  ]
  expect(clockwiseSort(points)).toEqual(result)
});
