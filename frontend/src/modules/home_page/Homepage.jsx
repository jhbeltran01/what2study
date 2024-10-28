import Sidebar from '@modules/sidebar/Sidebar';
import React from "react";
import { Outlet } from "react-router-dom";

const Homepage = () => {
  return (
    <section className="homepage-section">
      <div className="homepage-grid">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="navpage-container grid">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Homepage;
