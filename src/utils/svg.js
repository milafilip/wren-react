export const svgPoint = svg => (x, y) => {
  let point = svg.createSVGPoint();
  point.x = x;
  point.y = y;
  point = point.matrixTransform(svg.getCTM().inverse());
  return [Math.floor(point.x), Math.floor(point.y)];
};
