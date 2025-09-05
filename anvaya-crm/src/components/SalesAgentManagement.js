import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { agentsAPI, leadsAPI } from "../services/api";

const SalesAgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [agentsRes, leadsRes] = await Promise.all([
          agentsAPI.getAll(),
          leadsAPI.getAll(),
        ]);
        setAgents(agentsRes.data);
        setLeads(leadsRes.data);
      } catch (err) {
        console.error("Error fetching agents or leads:", err);
        setError("Failed to load sales agents.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLeadStats = (agentId) => {
    const agentLeads = leads.filter((l) => l.salesAgent?._id === agentId);
    const closed = agentLeads.filter((l) => l.status === "Closed").length;
    return {
      total: agentLeads.length,
      closed,
    };
  };

  if (loading) return <div>Loading agents...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="sales-agent-management">
      <div className="page-header">
        <h1>Sales Agent Management</h1>
        <Link to="/agents/new" className="btn-primary">
          Add New Agent
        </Link>
      </div>

      <div className="agents-list">
        <h2>Sales Agents</h2>
        {agents.length === 0 ? (
          <p>No sales agents found.</p>
        ) : (
          <div className="agents-grid">
            {agents.map((agent) => {
              const stats = getLeadStats(agent._id);
              return (
                <div key={agent._id} className="agent-card">
                  <h3>{agent.name}</h3>
                  <p className="agent-email">{agent.email}</p>
                  <div className="agent-stats">
                    <span className="stat">Leads: {stats.total}</span>
                    <span className="stat">Closed: {stats.closed}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAgentManagement;
