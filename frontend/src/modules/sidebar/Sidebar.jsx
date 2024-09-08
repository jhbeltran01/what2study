// Sidebar.js

import React from 'react';
import { NavLink } from "react-router-dom";
import '../../sass/pages/sidebar.scss';
import { SidebarData } from './SidebarData'; // Ensure the path is correct

const Sidebar = () => {
    return (
        <React.Fragment>
            <section className="sidebar-section">
                {
                    SidebarData.map((item, index) => {
                        return (
                            <div key={index}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? 'sidebar-link-active sidebar-link-hover' : 'sidebar-link-normal sidebar-link-hover'
                                    }
                                >
                                    <img src={item.icon} alt={item.title} className="sidebar-icon" />
                                    <span>{item.title}</span>
                                </NavLink>
                            </div>
                        );
                    })
                }
            </section>
        </React.Fragment>
    );
};

export default Sidebar;
