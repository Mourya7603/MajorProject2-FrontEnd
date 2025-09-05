import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaDollarSign,
  FaUserTie,
  FaChartPie,
  FaCog,
  FaHome,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", name: "Dashboard", icon: <FaHome /> },
    { path: "/leads", name: "Leads", icon: <FaUsers /> },
    { path: "/agents", name: "Agents", icon: <FaUserTie /> },
    { path: "/reports", name: "Reports", icon: <FaChartPie /> },
    { path: "/settings", name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <FaChartPie /> Anvaya CRM
      </div>
      <ul className="menu-items">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
