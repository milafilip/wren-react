import React, { Component } from "react";
import { offset, offsetPoints } from "../utils/clipper";
import { clockwiseSort, bounds } from "../utils/points";
import { loopifyInPairs } from "../utils/list";
import Outline from "./Outline";
import Hole from "./Hole";
import _ from "lodash";
import { Sheet } from "../wren/sheet";

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

    const outline = offset(points.filter(p => p.length === 2), 10);

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

    const outerSheets = loopifyInPairs(outline).map(Sheet("outer"));
    let innerSheets = _.flatten(
      holes.map(points => loopifyInPairs(points).map(Sheet("inner")))
    );

    // console.log(outerSheets)

    const output = {
      outline: outline.map(this.normalize(b)),
      holes: holes.map(hole => hole.map(this.normalize(b)).reverse()),
      sheets: {
        outer: outerSheets.map(subSheet =>
          subSheet.map(sheet => sheet.map(this.normalize(b)))
        ),
        inner: innerSheets.map(subSheet =>
          subSheet.map(sheet => sheet.map(this.normalize(b)))
        )
      }
    };

    // console.log(outline)
    console.log(JSON.stringify(output));
    // sheets.map(sheet => sheet.map(console.log))

    if (points.length >= 3) {
      return (
        <g id="lines">
          <Outline points={outline} />
          {holes.map(hole => <Hole points={hole} />)}
          <g id="outer">
            {outerSheets.map(sheet =>
              sheet.map(points => <Outline points={points} />)
            )}
          </g>
          <g id="inner">
            {innerSheets.map(sheet =>
              sheet.map(points => <Outline points={points} />)
            )}
          </g>
        </g>
      );
    } else {
      return <g id="lines" />;
    }
  }
}

export default Lines;
