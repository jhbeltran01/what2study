import React from "react";
import '../../sass/pages/homepage.scss';
import Navpage from '../nav_page/Navpage';
import Sidebar from '../sidebar/Sidebar';

const Homepage = () => {
  return (
    <React.Fragment>
      <section className="homepage-section">
        <div className="homepage-grid">
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <div className="navpage-container">
            <Navpage />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Homepage;
