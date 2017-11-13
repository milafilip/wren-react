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
    return (
      <circle
        id={`point-${i}`}
        className={auto ? "autoPoint" : "point"}
        cx={x}
        cy={y}
        r={inputs.fin.width / 2}
        onMouseDown={setActivePoint(i)}
        onDoubleClick={handleDoubleClickPoint([x, y], auto)}
      />
    );
  }
}

export default Point;
