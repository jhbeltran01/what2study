import Router from "./routes/Router";
import React from "react";
import NavBar from "./modules/NavBar";

const App = () => {
  return (
    <React.Fragment>
      <NavBar />
      <Router />
    </React.Fragment>
  );
};

export default App;