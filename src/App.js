import _ from "lodash";
import config from "./config";
import DragRect from "./components/DragRect";
import GuideLine from "./components/GuideLine";
import inputs, { points } from "./wren/inputs";
import Lines from "./components/Lines";
import Point from "./components/Point";
import React, { Component } from "react";
import Ruler from "./components/Ruler";
import { bounds } from "./utils/points";
import { intersect } from "mathjs";
import { loopifyInPairs } from "./utils/list";
import { svgPoint } from "./utils/svg";

class App extends Component {
  actions = {
    ADDING_GUIDE: "addingGuide",
    DRAGGING_GUIDE: "draggingGuide",
    DRAGGING_POINTS: "draggingPoints",
    DRAWING_SELECT_BOX: "drawingSelectBox",
    NOTHING: "nothing"
  };

  state = {
    action: [this.actions.NOTHING, undefined],
    dragRect: {},
    guideLines: {
      x: [],
      y: []
    },
    points: points(inputs).map(([x, y]) => [
      x + config.offset,
      y + config.offset
    ]),
    layers: new Set()
  };

  componentDidMount() {
    this.svgPoint = svgPoint(this.refs.svg)
  }

  handleLineDoubleClick = index => e => {
    e.stopPropagation();
    const point = this.svgPoint(e.pageX, e.pageY);
    const i = index + 1;

    this.setState(prevState => {
      console.log(prevState.points);
      prevState.points.splice(i, 0, point);
      return prevState;
    });
    setTimeout(() => this.setActivePoint(i)(e), 10);

    // console.log(this.props.points, clockwiseSort(this.props.points));
  };

  handleMouseMove = event => {
    const [x, y] = this.svgPoint(event.pageX, event.pageY);
    const pos = { x, y };

    switch (this.state.action[0]) {
      case this.actions.DRAGGING_POINTS:
        this.state.action[1].forEach(index => {
          this.setState(prevState => {
            prevState.points[index][0] = x;
            prevState.points[index][1] = y;
            return prevState;
          });
        });
        break;

      case this.actions.DRAWING_SELECT_BOX:
        break;

      case this.actions.DRAGGING_GUIDE:
        this.setState(prevState => {
          prevState.guideLines[this.state.action[1][0]][
            this.state.action[1][1]
          ] =
            pos[this.state.action[1][0]];
          return prevState;
        });
        break;

      case this.actions.ADDING_GUIDE:
        this.setState(prevState => {
          const last = prevState.guideLines[this.state.action[1]].length - 1;
          prevState.guideLines[this.state.action[1]][last] =
            pos[this.state.action[1]];
          return prevState;
        });
        break;

      default:
        break;
    }
  };

  handleMouseDownOnRuler = axis => e => {
    e.stopPropagation();
    console.log("RULER", axis);
    this.setState(prevState => {
      prevState.guideLines[axis].push(10);
      prevState.action = [this.actions.ADDING_GUIDE, axis];
      return prevState;
    });
  };

  handleGuideLineMouseDown = (axis, index) => e => {
    console.log({ axis, index });
    e.stopPropagation();
    this.setState({ action: [this.actions.DRAGGING_GUIDE, [axis, index]] });
    console.log(this.state.action);
  };

  handleMouseUp = e => {
    const [x, y] = this.svgPoint(e.pageX, e.pageY);
    const { action } = this.state;
    const b = bounds(this.state.points);

    if (action[0] === this.actions.DRAGGING_GUIDE) {
      if (
        (action[1][0] === "y" && (y < b.minY || y > b.maxY)) ||
        (action[1][0] === "x" && (x < b.minX || x > b.maxX))
      ) {
        this.setState(prevState => {
          prevState.guideLines[action[1][0]].splice(action[1][1], 1);
          return prevState;
        });
      }
    }

    this.setState({
      action: [this.actions.NOTHING, null],
      activePoints: [],
      dragRect: {}
    });
  };

  handleMouseDown = e => {
    // e.stopPropagation();
    // const [x, y] = this.svgPoint(e.pageX, e.pageY);
    // this.setState({ dragRect: { x, y } });
  };

  handleDoubleClickPoint = (point, auto) => event => {
    event.stopPropagation();
    if (auto) return;
    this.setState(prevState => {
      console.log(
        prevState.points.map(p => p.join(",")),
        point.join(","),
        prevState.points.indexOf(point)
      );
      prevState.points.splice(
        prevState.points.map(p => p.join(",")).indexOf(point.join(",")),
        1
      );
      return prevState;
    });
  };

  setActivePoint = id => e => {
    e.stopPropagation();
    console.log("active point");
    this.setState({ action: [this.actions.DRAGGING_POINTS, [id]] });
  };

  setCursor = cursor => {
    this.setState({ cursor });
  };

  points = safePoints => {
    let pointIndex = -1;
    return safePoints.map((p, i) => {
      if (!p[2]) pointIndex++;
      return (
        <Point
          key={i}
          i={pointIndex}
          x={p[0]}
          y={p[1]}
          auto={p[2]}
          setActivePoint={this.setActivePoint}
          handleDoubleClickPoint={this.handleDoubleClickPoint}
        />
      );
    });
  };

  toggleLayer = layerName => e => {
    e.stopPropagation();
    this.setState(prevState => {
      prevState.layers.has(layerName)
        ? prevState.layers.delete(layerName)
        : prevState.layers.add(layerName);
      return prevState;
    });
  };

  render() {
    const { points, dragRect, guideLines, cursor, layers } = this.state;

    const safePoints = points.slice(0);

    const dRect = dragRect.x ? (
      <DragRect x={dragRect.x} y={dragRect.y} />
    ) : (
      <g />
    );

    const pointPairs = loopifyInPairs(safePoints);

    // ----------------

    const xIntersects = _.flatten(
      guideLines["x"].map(guideLine => {
        let intersects = [];
        pointPairs.forEach(([start, end], index) => {
          if (
            (start[0] >= guideLine && end[0] <= guideLine) ||
            (start[0] <= guideLine && end[0] >= guideLine)
          ) {
            intersects.push([
              index + 1,
              // intersect(start, end, [0, guideLine], [1000, guideLine])
              intersect(start, end, [guideLine, 0], [guideLine, 1000])
            ]);
          }
        });
        return intersects;
      })
    ).sort(function(a, b) {
      return b[0] - a[0];
    });

    xIntersects.forEach((intersect, index) => {
      if (intersect[1]) {
        safePoints.splice(intersect[0], 0, [...intersect[1], true]);
      }
    });

    // ----------------

    const yIntersects = _.flatten(
      guideLines["y"].map(guideLine => {
        let intersects = [];
        pointPairs.forEach(([start, end], index) => {
          if (
            (start[1] >= guideLine && end[1] <= guideLine) ||
            (start[1] <= guideLine && end[1] >= guideLine)
          ) {
            intersects.push([
              index + 1,
              intersect(start, end, [0, guideLine], [1000, guideLine])
            ]);
          }
        });
        return intersects;
      })
    ).sort(function(a, b) {
      return b[0] - a[0];
    });

    yIntersects.forEach((intersect, index) => {
      if (intersect[1]) {
        safePoints.splice(intersect[0], 0, [...intersect[1], true]);
      }
    });

    return (
      <div>
        <svg
          id="svg"
          ref="svg"
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseDown={this.handleMouseDown}
        >
          <g transform="scale(1)">
            <Lines
              points={safePoints}
              guideLines={guideLines}
              handleLineDoubleClick={this.handleLineDoubleClick}
              layers={layers}
            />
            <g id="points">{this.points(safePoints)}</g>
          </g>
          {guideLines.x.map((value, index) => (
            <GuideLine
              axis="x"
              key={`x${index}`}
              index={index}
              value={value}
              handleGuideLineMouseDown={this.handleGuideLineMouseDown}
            />
          ))}
          {guideLines.y.map((value, index) => (
            <GuideLine
              axis="y"
              key={`y${index}`}
              index={index}
              value={value}
              handleGuideLineMouseDown={this.handleGuideLineMouseDown}
            />
          ))}

          {dRect}
          <Ruler
            axis="x"
            handleMouseDownOnRuler={this.handleMouseDownOnRuler}
          />
          <Ruler
            axis="y"
            handleMouseDownOnRuler={this.handleMouseDownOnRuler}
          />
        </svg>
        <div id="controls">
          <label onClick={this.toggleLayer("INNER")}>
            Inner <input type="checkbox" checked={layers.has("INNER")} />
          </label>
          <label onClick={this.toggleLayer("OUTER")}>
            Outer <input type="checkbox" checked={layers.has("OUTER")} />
          </label>
        </div>
      </div>
    );
  }
}

export default App;
