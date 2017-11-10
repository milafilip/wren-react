import React, { Component } from "react";
import { offset } from "../utils/clipper";

// console.time("intersect")
// console.log(intersect([0, 0], [10, 10], [10, 0], [0, 10]))
// console.timeEnd("intersect")

class Lines extends Component {
  offsetPoints = (points, delta) => {
    return offset(points, delta).reduce((str, [x, y]) => {
      str += `${x},${y} `;
      return str;
    }, "");
  };

  innerPolygons = () => {
    const { guideLines, points } = this.props;
    const sortedGuidelines = guideLines.y.slice(0).reverse();

    const allGuideLines = [-Infinity, ...sortedGuidelines, Infinity];

    return sortedGuidelines.map((guideLine, index) => {
      return [
        <polygon
          points={this.offsetPoints(
            points.filter(p => {
              return (
                p[1] >= allGuideLines[index] && p[1] <= allGuideLines[index + 1]
              );
            }),
            -10
          )}
        />,
        <polygon
          points={this.offsetPoints(
            points.filter(p => {
              return (
                p[1] >= allGuideLines[index + 1] &&
                p[1] <= allGuideLines[index + 2]
              );
            }),
            -10
          )}
        />
      ];
    });
  };

  // <polygon
  //   points={this.offsetPoints(this.props.points.filter(p => p[1] >= guideLine), -10)}
  // />

  render() {
    const { points, guideLines } = this.props;

    const holes =
      guideLines.y.length > 0 ? (
        this.innerPolygons()
      ) : (
        <polygon points={this.offsetPoints(points, -10)} />
      );

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
