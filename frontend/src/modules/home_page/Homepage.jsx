import Sidebar from '@modules/sidebar/Sidebar';
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { setUserInfo } from '@redux/user_info'
import { apiRootURL } from '@root/globals'
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Homepage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    axios
      .get(`${apiRootURL}/auth/authenticated-user-details/`)
      .then(response => {
        dispatch(setUserInfo(response.data))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

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
