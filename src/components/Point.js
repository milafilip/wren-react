import React, { Component } from "react";

class Point extends Component {
  render() {
    const { x, y, i, setActivePoint, auto } = this.props;
    return (
      <circle
        id={`point-${i}`}
        className={auto ? "autoPoint" : "point"}
        cx={x}
        cy={y}
        r="5"
        onMouseDown={setActivePoint(i)}
      />
    );
  }
}

export default Point;
