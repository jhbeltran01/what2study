import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../home_page/Home";
import Reviewers from "../reviewer/Reviewer";


const Navpage = () => {
  return (
    <React.Fragment>
      <section>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Reviewer" element={<Reviewers />} />
        
        </Routes>
      </section>
    </React.Fragment>
  );
};

export default Navpage;