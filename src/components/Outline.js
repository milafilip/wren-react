import React, { Component } from "react";

class Outline extends Component {
  render() {
    const points = this.props.points.reduce((str, [x, y]) => {
      str += `${x},${y} `;
      return str;
    }, "");
    return <polygon points={points} />;
  }
}

export default Outline;
