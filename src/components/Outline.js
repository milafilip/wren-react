import React, { Component } from "react";

class Outline extends Component {
  // handleClick = e => {
  //   e.stopPropagation();
  //   // console.log(this.props.points, clockwiseSort(this.props.points));
  // };

  render() {
    const points = this.props.points.reduce((str, [x, y]) => {
      str += `${x},${y} `;
      return str;
    }, "");
    return <polygon points={points} />;
  }
}

export default Outline;
