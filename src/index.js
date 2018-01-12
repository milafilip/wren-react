import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const body = document.querySelector("body");
window.setCursor = (cursor = "default") => (body.className = cursor);
window.setCursor();

// needed to stop firefox from dragging the SVG
document.addEventListener("dragstart", function(e) {
  e.preventDefault();
});

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
