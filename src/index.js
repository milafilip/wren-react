import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const body = document.querySelector("body");
window.setCursor = (cursor = "default") => (body.className = cursor);
window.setCursor();

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
