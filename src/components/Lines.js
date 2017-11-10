import React, { Component } from "react";
import { offset } from "../utils/clipper";

class Lines extends Component {
  offsetPoints = (points, delta) => {
    return offset(points, delta).reduce((str, pts) => {
      str += pts.join(",") + " ";
      return str;
    }, "");
  };

  render() {
    const { points } = this.props;

    if (points.length >= 3) {
      return (
        <g id="lines">
          <polygon points={this.offsetPoints(points, 0)} className="line" />
          <polygon points={this.offsetPoints(points, 10)} />
          <polygon points={this.offsetPoints(points, -10)} />
        </g>
      );
    } else {
      return <g id="lines" />;
    }
  }
}

// <polygon
//   points={this.offsetPoints(points.filter(p => p[1] < 300), -10)}
// />
// <polygon
//   points={this.offsetPoints(points.filter(p => p[1] >= 300), -10)}
// />

export default Lines;
