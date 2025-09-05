import React from "react";
import { FaUsers, FaChartLine, FaClock, FaDollarSign } from "react-icons/fa";

const StatusCard = ({ title, value, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case "users":
        return <FaUsers />;
      case "chart-line":
        return <FaChartLine />;
      case "clock":
        return <FaClock />;
      case "dollar-sign":
        return <FaDollarSign />;
      default:
        return <FaUsers />;
    }
  };

  return (
    <div className="status-card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        <div className="card-icon">{getIcon()}</div>
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
};

export default StatusCard;
