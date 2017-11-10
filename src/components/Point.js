import React, { Component } from "react";

class Point extends Component {
  render() {
    const { x, y, i, setActivePoint } = this.props;
    return <circle id={`point-${i}`} cx={x} cy={y} r="5" onMouseDown={setActivePoint(i)} />;
  }
}

export default Point;
