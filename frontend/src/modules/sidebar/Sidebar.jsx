import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import axios from 'axios'
import { apiRootURL } from '@root/globals'


const Sidebar = () => {
    const logoutUser = () => {
        axios
            .post(`${apiRootURL}/auth/logout/session-auth/`)
            .then(_ => {
                window.location.replace("/auth/login/");
            })
            .catch(err => console.log(err))
    }

    return (
        <section className="sidebar-section">
            <div className="app-name">StudyHive</div> {/* App name*/}
            {
                SidebarData.map((item, index) => (
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
                ))
            }
            <button onClick={logoutUser} className='sidebar-link-normal sidebar-link-hover'>Logout</button>
        </section>
    );
};

export default Sidebar;
