import React, { Component } from "react";
import Point from "./components/Point";
import Lines from "./components/Lines";
import DragRect from "./components/DragRect";

class App extends Component {
  state = {
    points: [
      [100, 400],
      [400, 400],
      [400, 300],
      // [400, 200],
      [250, 100],
      // [100, 200],
      [100, 300]
    ],
    activePoints: [],
    dragRect: {}
  };

  svgPoint = (x, y) => {
    let point = this.refs.svg.createSVGPoint();
    point.x = x;
    point.y = y;
    point = point.matrixTransform(this.refs.svg.getCTM().inverse());
    return [Math.floor(point.x), Math.floor(point.y)];
  };

  handleMouseMove = event => {
    const [x, y] = this.svgPoint(event.pageX, event.pageY);

    this.state.activePoints.forEach(index => {
      this.setState(prevState => {
        prevState.points[index][0] = x;
        prevState.points[index][1] = y;
        return prevState;
      });
    });
  };

  setActivePoint = id => e => {
    e.stopPropagation();
    console.log('active point')
    this.setState({ activePoints: [id] });
  };

  handleMouseUp = e => {
    this.setState({
      activePoints: [],
      dragRect: {}
    });
  };

  handleMouseDown = e => {
    e.stopPropagation();
    const [x, y] = this.svgPoint(e.pageX, e.pageY);
    this.setState({ dragRect: {x,y} });
  }

  render() {
    const { points, dragRect } = this.state;

    const dRect = dragRect.x ? <DragRect x={dragRect.x} y={dragRect.y} /> : <g />

    return (
      <svg
        id="svg"
        ref="svg"
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
      >
        <Lines points={points} />
        <g id="points">
          {points.map((p, i) => (
            <Point
              key={i}
              i={i}
              x={p[0]}
              y={p[1]}
              setActivePoint={this.setActivePoint}
            />
          ))}
        </g>
        {dRect}
      </svg>
    );
  }
}

export default App;
