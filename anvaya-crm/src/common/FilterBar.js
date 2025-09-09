import React, { useState, useEffect } from "react";
import { agentsAPI } from "../services/api";

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: "",
    salesAgent: "",
    priority: "",
    source: "",
    tags: "",
  });

  const [salesAgents, setSalesAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesAgents = async () => {
      try {
        const response = await agentsAPI.getAll();
        setSalesAgents(response.data || []);
      } catch (error) {
        console.error("Error fetching sales agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesAgents();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Clean filters
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "")
    );

    onFilterChange(cleanFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: "",
      salesAgent: "",
      priority: "",
      source: "",
      tags: "",
    };
    setFilters(emptyFilters);
    onFilterChange({});
  };

  if (loading) {
    return (
      <div className="filter-loading">
        Loading filters...
      </div>
    );
  }

  return (
    <div className="filter-bar-container">
      {/* Status */}
      <div className="filter-group">
        <label htmlFor="status">
          Status
        </label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Sales Agent */}
      <div className="filter-group">
        <label htmlFor="salesAgent">
          Sales Agent
        </label>
        <select
          id="salesAgent"
          value={filters.salesAgent}
          onChange={(e) => handleFilterChange("salesAgent", e.target.value)}
        >
          <option value="">All Agents</option>
          {salesAgents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div className="filter-group">
        <label htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          value={filters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Source */}
      <div className="filter-group">
        <label htmlFor="source">
          Source
        </label>
        <select
          id="source"
          value={filters.source}
          onChange={(e) => handleFilterChange("source", e.target.value)}
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Cold Call">Cold Call</option>
          <option value="Advertisement">Advertisement</option>
          <option value="Email">Email</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Tags */}
      <div className="filter-group">
        <label htmlFor="tags">
          Tags
        </label>
        <select
          id="tags"
          value={filters.tags}
          onChange={(e) => handleFilterChange("tags", e.target.value)}
        >
          <option value="">All Tags</option>
          <option value="High Value">High Value</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Trial">Trial</option>
          <option value="Partner">Partner</option>
        </select>
      </div>

      {/* Clear Button */}
      <div className="filter-clear-container">
        <button
          onClick={clearFilters}
          className="filter-clear-button"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;