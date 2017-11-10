import React, { Component } from "react";

class DragRect extends Component {
  render() {
    const { x, y } = this.props;
    return <rect id="dragRect" x={x} y={y} width="150" height="150" />;
  }
}

export default DragRect;
