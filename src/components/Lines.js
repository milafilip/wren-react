import React, { Component } from "react";
import { offset, offsetPoints } from "../utils/clipper";
import { clockwiseSort, bounds } from "../utils/points";
import { loopifyInPairs } from "../utils/list";
import Outline from "./Outline";
import Hole from "./Hole";
import Sheet from "./Sheet";

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

      polygons.push(offset(clockwiseSort(p), -10));

      p = points.filter(p => {
        return (
          Math.ceil(p[i]) >= allGuideLines[index] &&
          Math.floor(p[i]) <= allGuideLines[index + 1]
        );
      });

      polygons.push(offset(clockwiseSort(p), -10));
    }

    // console.log(polygons)

    return polygons.filter(arr => arr.length > 0);
  };

  normalize = b => ([x, y]) => [
    (x - b.minX - (b.maxX - b.minX) / 2) / 100,
    (y - b.maxY) * -1 / 100
  ];

  render() {
    const { points, guideLines } = this.props;
    const outline = offset(points, 10);

    let holes = [];
    if (guideLines.y.length > 0) {
      holes.push(...this.innerPolygons("y", 1));
    }
    if (guideLines.x.length > 0) {
      holes.push(...this.innerPolygons("x", 0));
    }
    if (holes.length === 0) {
      holes.push(offset(points, -10));
    }

    const b = bounds(outline);
    // convert top-left 0,0 to bottom-left 0,0
    const output = {
      outline: outline.map(this.normalize(b)),
      holes: holes.map(hole => hole.map(this.normalize(b)).reverse())
    };
    // console.log(JSON.stringify(output))

    if (points.length >= 3) {
      return (
        <g id="lines">
          <Outline points={outline} />
          {holes.map(hole => <Hole points={hole} />)}
          {loopifyInPairs(outline).map(pair => <Sheet pair={pair} />)}
        </g>
      );
    } else {
      return <g id="lines" />;
    }
  }
}

export default Lines;
