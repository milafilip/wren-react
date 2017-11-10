import React, { Component } from "react";

class Ruler extends Component {
  render() {
    const { axis, handleMouseDownOnRuler } = this.props;

    let x, y, height, width;
    if (axis === "y") {
      x = 20;
      y = 0;
      height = 20;
      width = 800;
    } else {
      x = 0;
      y = 20;
      height = 800;
      width = 20;
    }
    return (
      <rect
        x={x}
        y={y}
        height={height}
        width={width}
        className="ruler"
        onMouseDown={handleMouseDownOnRuler(axis)}
      />
    );
  }
}

export default Ruler;
