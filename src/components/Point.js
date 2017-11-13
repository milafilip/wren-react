import config from "../config";
import inputs from "../wren/inputs";
import React, { Component } from "react";

class Point extends Component {
  render() {
    const {
      x,
      y,
      i,
      setActivePoint,
      auto,
      handleDoubleClickPoint
    } = this.props;
    const radius = inputs.fin.width / 2;
    // const radius = 60
    return (
      <circle
        id={`point-${i}`}
        className={auto ? "autoPoint" : "point"}
        cx={x}
        cy={y}
        r={radius}
        onMouseDown={setActivePoint(i)}
        onDoubleClick={handleDoubleClickPoint([x, y], auto)}
      />
    );
  }
}

export default Point;
