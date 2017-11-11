import ClipperLib from "clipper-lib";

export function offsetPoints(points, delta) {
  return offset(points, delta).reduce((str, [x, y]) => {
    str += `${x},${y} `;
    return str;
  }, "");
}

export function offset(points, delta, scale = 100) {
  try {
    const paths = [
      points.map(pts => ({ X: pts[0] * scale, Y: pts[1] * scale }))
    ];
    const co = new ClipperLib.ClipperOffset();
    const offsetted_paths = new ClipperLib.Paths();
    co.MiterLimit = 10;
    co.AddPaths(
      paths,
      ClipperLib.JoinType.jtMiter,
      ClipperLib.EndType.etClosedPolygon
    );
    co.Execute(offsetted_paths, delta * scale);
    return offsetted_paths[0].map(pts => [pts.X / scale, pts.Y / scale]);
  } catch (e) {
    return points;
  }
}
