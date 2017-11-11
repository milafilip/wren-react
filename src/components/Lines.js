import React, { Component } from "react";
import { offset, offsetPoints } from "../utils/clipper";
import { clockwiseSort } from "../utils/points";
import Outline from "./Outline";
import Hole from "./Hole";

class Lines extends Component {
  innerPolygons = (axis, i) => {
    const { guideLines, points } = this.props;
    const sortedGuidelines = guideLines[axis].slice(0).sort(function(a, b) {
      return a - b;
    });

    const allGuideLines = [-Infinity, ...sortedGuidelines, Infinity];

    const polygons = [];

    for (let index = 1; index < allGuideLines.length - 1; index++) {
      let p = points.filter(p => {
        return (
          Math.ceil(p[i]) >= allGuideLines[index - 1] &&
          Math.floor(p[i]) <= allGuideLines[index]
        );
      });

      polygons.push(<Hole points={offset(clockwiseSort(p), -10)} />);

      p = points.filter(p => {
        return (
          Math.ceil(p[i]) >= allGuideLines[index] &&
          Math.floor(p[i]) <= allGuideLines[index + 1]
        );
      });

      polygons.push(<Hole points={offset(clockwiseSort(p), -10)} />);
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
      holes.push(<Hole points={offset(points, -10)} />);
    }

    if (points.length >= 3) {
      return (
        <g id="lines">
          <Outline points={offset(points, 10)} />
          {holes}
        </g>
      );
    } else {
      return <g id="lines" />;
    }
  }
}

export default Lines;
