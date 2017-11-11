import { clockwiseSort } from "../utils/points";

test("sorts points clockwise from first point", () => {
  // anticlockwise
  const points = [[0, 0], [1, 0], [1, 1], [0, 1]];
  // clockwise
  const result = [[0, 0], [0, 1], [1, 1], [1, 0]];
  expect(clockwiseSort(points)).toEqual(result);
});

test("should work", () => {
  const a = [
    [299.5, 166, true],
    [358.75, 245, true],
    [200.5, 166, true],
    [141.25, 245, true]
  ];
  const b = [[299.5, 166], [200.5, 166], [141.25, 245], [358.75, 245]];
  expect(clockwiseSort(a)).toEqual(b);
});

test("should work2", () => {
  const a = [
    [272.5, 130, true],
    [345.25, 227, true],
    [227.5, 130, true],
    [154.75, 227, true]
  ];
  const b = [[272.5, 130], [227.5, 130], [154.75, 227], [345.25, 227]];
  expect(clockwiseSort(a)).toEqual(b);
});
