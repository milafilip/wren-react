import React, { Component } from "react";

class Outline extends Component {
  handleDoubleClick = e => {
    e.stopPropagation();
    console.log(e);
    // console.log(this.props.points, clockwiseSort(this.props.points));
  };

  render() {
    const points = this.props.points.reduce((str, [x, y]) => {
      str += `${x},${y} `;
      return str;
    }, "");
    return <polygon points={points} onDoubleClick={this.handleDoubleClick} />;
  }
}

export default Outline;
