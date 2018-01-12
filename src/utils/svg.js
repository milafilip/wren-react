export const svgPoint = (svg, g) => (x, y) => {
  let point = svg.createSVGPoint();
  point.x = x;
  point.y = y;
  point = point.matrixTransform(g.getCTM().inverse());
  return [Math.floor(point.x), Math.floor(point.y)];
};
