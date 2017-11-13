import _ from "lodash";
import Hole from "./Hole";
import inputs from "../wren/inputs";
import Outline from "./Outline";
import MainLine from "./MainLine";
import config from "../config";
import React, { Component } from "react";
import { clockwiseSort, bounds } from "../utils/points";
import { loopifyInPairs } from "../utils/list";
import { offset, offsetPoints } from "../utils/clipper";
import { Sheet } from "../wren/sheet";

const halfFinWidth = inputs.fin.width / 2;

const sortNumeric = (a, b) => a - b;

class Lines extends Component {
  innerPolygons = allGuideLines => {
    const { points } = this.props;

    let p = [];
    const polygons = [];

    for (let x = 1; x < allGuideLines.x.length; x++) {
      for (let y = 1; y < allGuideLines.y.length; y++) {
        p = points.filter(p => {
          return (
            Math.ceil(p[0]) >= allGuideLines.x[x - 1] &&
            Math.floor(p[0]) <= allGuideLines.x[x] &&
            Math.ceil(p[1]) >= allGuideLines.y[y - 1] &&
            Math.floor(p[1]) <= allGuideLines.y[y]
          );
        });
        polygons.push(offset(clockwiseSort(p), -halfFinWidth));
      }
    }
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
    const { points, guideLines, handleLineClick, layers } = this.props;

    const outline = offset(points.filter(p => p.length === 2), halfFinWidth);

    let holes = [];
    if (guideLines.x.length + guideLines.y.length > 0) {
      // make a new array of guidelines sorted top>bottom or left>right
      const allGuideLines = {
        x: [-Infinity, ...guideLines.x.slice(0).sort(sortNumeric), Infinity],
        y: [-Infinity, ...guideLines.y.slice(0).sort(sortNumeric), Infinity]
      };
      holes.push(...this.innerPolygons(allGuideLines));
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

    console.log(JSON.stringify(output));
    // console.log(JSON.stringify(output.sheets.outer))
    // outerSheets.map(sheet => console.log(sheet.length))
    // sheets.map(sheet => sheet.map(console.log))

    const inner = layers.has("INNER")
      ? innerSheets.map((sheets, index1) =>
          sheets.map((sheet, index2) => (
            <Outline
              key={["inner", index1, index2].join("-")}
              points={sheet.pts}
            />
          ))
        )
      : "";
    const outer = layers.has("OUTER") ? (
      outerSheets.map((sheets, index1) =>
        sheets.map((sheet, index2) => (
          <Outline
            key={["outer", index1, index2].join("-")}
            points={sheet.pts}
          />
        ))
      )
    ) : (
      <Outline points={outline} />
    );

    if (points.length >= 3) {
      return (
        <g id="lines">
          <g id="mainline">
            <MainLine handleLineClick={handleLineClick} points={points} />
          </g>
          {holes.map((hole, index) => (
            <Hole key={["hole", index].join("-")} points={hole} />
          ))}
          <g id="outer">{outer}</g>
          <g id="inner">{inner}</g>
        </g>
      );
    } else {
      return <g id="lines" />;
    }
  }
}

export default Lines;
