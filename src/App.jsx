import React from "react";
import ReactDOM from "react-dom";

import Header from "./Header.jsx";
import Content from "./Content.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CallerId from "./CallerId.jsx";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Header />
        <div className="container-view">
          <Route path="/" exact component={Content} />
          {/* <Route path="/" exact component={CallerId} /> */}
          <Route path="/:id" exact component={CallerId} />
        </div>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
