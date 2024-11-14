import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarData } from './SidebarData';

const Sidebar = () => {
    const handleLogout = async () => {
        try {
            window.location.href = '/';
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

    return (
        <section className="sidebar-section">
            <div className="app-name">StudyHive</div>
            {
                SidebarData.map((item, index) => (
                    <div key={index}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? 'sidebar-link-active sidebar-link-hover' : 'sidebar-link-normal sidebar-link-hover'
                            }
                            onClick={item.title === 'Logout' ? handleLogout : undefined}
                        >
                            <img src={item.icon} alt={item.title} className="sidebar-icon" />
                            <span>{item.title}</span>
                        </NavLink>
                    </div>
                ))
            }
        </section>
    );
};

export default Sidebar;
