import React, { Component } from "react";
import { offset } from "../utils/clipper";
import { clockwiseSort } from "../utils/points"

class Lines extends Component {
  offsetPoints = (points, delta) => {
    return offset(points, delta).reduce((str, [x, y]) => {
      str += `${x},${y} `;
      return str;
    }, "");
  };

  innerPolygons = (axis, i) => {
    const { guideLines, points } = this.props;
    const sortedGuidelines = guideLines[axis].slice(0).sort(function(a, b) {
      return a - b;
    });

    const allGuideLines = [-Infinity, ...sortedGuidelines, Infinity];

    const polygons = [];

    for (let index = 1; index < allGuideLines.length - 1; index++) {

      // if (index === 2) {
      //   console.log(JSON.stringify(clockwiseSort(points)))
      // }

      polygons.push(
        <polygon
          points={this.offsetPoints(
            clockwiseSort(points).filter(p => {
              return (
                p[i] >= allGuideLines[index - 1] && p[i] <= allGuideLines[index]
              );
            }),
            -10
          )}
        />
      );

      // polygons.push(
      //   <polygon
      //     points={this.offsetPoints(
      //       points.filter(p => {
      //         return (
      //           p[i] >= allGuideLines[index] && p[i] <= allGuideLines[index + 1]
      //         );
      //       }),
      //       -10
      //     )}
      //   />
      // );
    }

    return polygons;
  };

  render() {
    const { points, guideLines } = this.props;

    let holes = [];
    if (guideLines.y.length > 0) {
      holes.push(this.innerPolygons("y", 1));
    }
    if (guideLines.x.length > 0) {
      holes.push(this.innerPolygons("x", 0));
    }
    if (holes.length === 0) {
      holes.push(<polygon points={this.offsetPoints(points, -10)} />);
    }

    if (points.length >= 3) {
      return (
        <g id="lines">
          <polygon points={this.offsetPoints(points, 0)} className="line" />
          <polygon points={this.offsetPoints(points, 10)} />
          {holes}
        </g>
      );
    } else {
      return <g id="lines" />;
    }
  }
}

// <polygon points={this.offsetPoints(points, -10)} />

// <polygon
//   points={this.offsetPoints(points.filter(p => p[1] < 300), -10)}
// />
// <polygon
//   points={this.offsetPoints(points.filter(p => p[1] >= 300), -10)}
// />

export default Lines;
