import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import axios from 'axios';
import { apiRootURL } from '@root/globals';

const Sidebar = () => {
    const logoutUser = () => {
        axios
            .post(`${apiRootURL}/auth/logout/session-auth/`)
            .then(() => {
                window.location.replace('/auth/login/');
            })
            .catch((err) => console.log(err));
    };

    return (
        <section className="sidebar-section flex flex-col min-h-[100%]">
            <div className="app-name radius">StudyHive</div>
            {SidebarData.map((item, index) => (
                <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                        `relative radius sidebar-link-hover ${
                            isActive ? 'sidebar-link-active' : 'sidebar-link-normal'
                        }`
                    }
                    key={index}
                >
                    <span className="sidebar-title">{item.title}</span>
                </NavLink>
            ))}
            <button
                onClick={logoutUser}
                className="sidebar-link-normal sidebar-link-hover radius logout-button"
            >
                <span className="sidebar-title">Logout</span>
            </button>
            <div className="filler"></div>
        </section>
    );
};

export default Sidebar;
