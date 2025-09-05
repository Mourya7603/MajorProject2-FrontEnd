import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { leadsAPI, reportsAPI } from "../services/api";
import StatusCard from "../common/StatusCard";
import PieChart from "../common/Charts/PieChart";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [pipelineData, setPipelineData] = useState({});
  const [closedByAgentData, setClosedByAgentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, pipelineResponse, closedResponse] =
          await Promise.all([
            leadsAPI.getAll(),
            reportsAPI.getPipeline(),
            reportsAPI.getClosedByAgent(),
          ]);

        setLeads(leadsResponse.data);
        setPipelineData(pipelineResponse.data);
        setClosedByAgentData(closedResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading Dashboard...</div>;
  }

  // Calculate lead counts by status
  const leadCounts = {
    New: leads.filter((lead) => lead.status === "New").length,
    Contacted: leads.filter((lead) => lead.status === "Contacted").length,
    Qualified: leads.filter((lead) => lead.status === "Qualified").length,
    "Proposal Sent": leads.filter((lead) => lead.status === "Proposal Sent")
      .length,
    Closed: leads.filter((lead) => lead.status === "Closed").length,
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>CRM Dashboard</h1>
        <Link to="/leads/new" className="btn-primary">
          Add New Lead
        </Link>
      </div>

      <div className="dashboard-cards">
        <StatusCard title="Total Leads" value={leads.length} icon="users" />
        <StatusCard
          title="Conversion Rate"
          value={`${
            leads.length > 0
              ? Math.round((leadCounts.Closed / leads.length) * 100)
              : 0
          }%`}
          icon="chart-line"
        />
        <StatusCard title="Avg. Time to Close" value="36 days" icon="clock" />
        <StatusCard
          title="Revenue"
          value={`$${(
            leads.filter((l) => l.status === "Closed").length * 2500
          ).toLocaleString()}`}
          icon="dollar-sign"
        />
      </div>

      <div className="dashboard-section">
        <h2>Lead Status</h2>
        <div className="status-cards">
          {Object.entries(leadCounts).map(([status, count]) => (
            <div
              key={status}
              className={`status-card ${status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              <div className="status-title">{status}</div>
              <div className="status-value">{count} Leads</div>
              <Link
                to={`/leads?status=${encodeURIComponent(status)}`}
                className="view-link"
              >
                View All
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Reports & Analytics</h2>
        <div className="charts-container">
          <div className="chart">
            <h3>Leads by Status</h3>
            <PieChart
              data={Object.entries(leadCounts).map(([name, value]) => ({
                name,
                value,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
