import React, { Component } from "react";
import { loopifyInPairs } from "../utils/list";

class MainLine extends Component {
  render() {
    const { points, handleLineDoubleClick } = this.props;
    const pointPairs = loopifyInPairs(points);
    return pointPairs.map(([start, end], index) => (
      <line
        x1={start[0]}
        y1={start[1]}
        x2={end[0]}
        y2={end[1]}
        onDoubleClick={handleLineDoubleClick(index)}
      />
    ));
  }
}

export default MainLine;
