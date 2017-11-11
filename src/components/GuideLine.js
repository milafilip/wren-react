import React, { Component } from "react";

class GuideLine extends Component {
  render() {
    const { axis, value, index, handleGuideLineMouseDown } = this.props;
    let x1, x2, y1, y2, cursor;
    if (axis === "x") {
      x1 = x2 = value;
      y1 = 0;
      y2 = 1000;
      cursor = "col-resize";
    } else {
      y1 = y2 = value;
      x1 = 0;
      x2 = 1000;
      cursor = "row-resize";
    }
    return (
      <line
        className="guideLine"
        onMouseDown={handleGuideLineMouseDown(axis, index)}
        onMouseOver={() => window.setCursor(cursor)}
        onMouseOut={() => window.setCursor()}
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
      />
    );
  }
}

export default GuideLine;
