import _ from "lodash";
import Hole from "./Hole";
import inputs from "../wren/inputs";
import Outline from "./Outline";
import config from "../config";
import React, { Component } from "react";
import { clockwiseSort, bounds } from "../utils/points";
import { loopifyInPairs } from "../utils/list";
import { offset, offsetPoints } from "../utils/clipper";
import { Sheet } from "../wren/sheet";

const halfFinWidth = inputs.fin.width / 2;

const sortNumeric = (a, b) => a - b;

class Lines extends Component {
  innerPolygons = (allGuideLines, axis, i) => {
    const { points } = this.props;

    const polygons = [];
    for (let index = 1; index < allGuideLines[axis].length - 1; index++) {
      let p = points.filter(p => {
        return (
          Math.ceil(p[i]) >= allGuideLines[axis][index - 1] &&
          Math.floor(p[i]) <= allGuideLines[axis][index]
        );
      });

      polygons.push(offset(clockwiseSort(p), -halfFinWidth));

      p = points.filter(p => {
        return (
          Math.ceil(p[i]) >= allGuideLines[axis][index] &&
          Math.floor(p[i]) <= allGuideLines[axis][index + 1]
        );
      });

      polygons.push(offset(clockwiseSort(p), -halfFinWidth));
    }

    // console.log(polygons)

    return polygons.filter(arr => arr.length > 0);
  };

  normalize = b => ([x, y]) => {
    return [
      (x - b.minX - (b.maxX - b.minX) / 2) * config.scale,
      (y - b.maxY) * config.scale * -1
      // ((y - b.maxY + (b.maxY - b.minY)) * -1)
    ];
  };

  render() {
    const { points, guideLines } = this.props;

    const outline = offset(points.filter(p => p.length === 2), halfFinWidth);

    // make a new array of guidelines sorted top>bottom or left>right
    const allGuideLines = {
      x: [-Infinity, ...guideLines.x.slice(0).sort(sortNumeric), Infinity],
      y: [-Infinity, ...guideLines.y.slice(0).sort(sortNumeric), Infinity]
    };

    let holes = [];
    if (guideLines.y.length > 0) {
      holes.push(...this.innerPolygons(allGuideLines, "y", 1));
    }
    if (guideLines.x.length > 0) {
      holes.push(...this.innerPolygons(allGuideLines, "x", 0));
    }
    if (holes.length === 0) {
      holes.push(offset(points, -halfFinWidth));
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
          subSheet.map(sheet => ({
            pos: this.normalize(b)(sheet.pos),
            rot: sheet.rot,
            pts: sheet.pts.map(this.normalize(b))
          }))
        ),
        inner: innerSheets.map(subSheet =>
          subSheet.map(sheet => ({
            pos: this.normalize(b)(sheet.pos),
            rot: sheet.rot,
            pts: sheet.pts.map(this.normalize(b))
          }))
        )
      }
    };

    // console.log(JSON.stringify(output));
    // console.log(JSON.stringify(output.sheets.outer))
    // outerSheets.map(sheet => console.log(sheet.length))
    // sheets.map(sheet => sheet.map(console.log))

    if (points.length >= 3) {
      // <Outline points={outline} />

      /*
  {innerSheets.map((sheets, index1) =>
    sheets.map((sheet, index2) => (
      <Outline
        key={["inner", index1, index2].join("-")}
        points={sheet.pts}
      />
    ))
  )}
*/
      return (
        <g id="lines">
          <g id="mainline">
            <Outline points={points} />
          </g>
          {holes.map((hole, index) => (
            <Hole key={["hole", index].join("-")} points={hole} />
          ))}
          <g id="outer">
            {outerSheets.map((sheets, index1) =>
              sheets.map((sheet, index2) => (
                <Outline
                  key={["outer", index1, index2].join("-")}
                  points={sheet.pts}
                />
              ))
            )}
          </g>
          <g id="inner" />
        </g>
      );
    } else {
      return <g id="lines" />;
    }
  }
}

export default Lines;
