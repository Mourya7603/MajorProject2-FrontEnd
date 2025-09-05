import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { leadsAPI } from "../services/api";
import FilterBar from "../common/FilterBar";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const response = await leadsAPI.getAll(params);
        setLeads(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setSearchParams(newFilters);
  };

  if (loading) {
    return <div className="loading">Loading Leads...</div>;
  }

  return (
    <div className="lead-list">
      <div className="page-header">
        <h1>Lead Management</h1>
        <Link to="/leads/new" className="btn-primary">
          Add New Lead
        </Link>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      <div className="leads-table">
        <div className="table-header">
          <div>Name</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Sales Agent</div>
          <div>Time to Close</div>
          <div>Actions</div>
        </div>

        {leads.map((lead) => (
          <div key={lead._id} className="table-row">
            <div>
              <Link to={`/leads/${lead._id}`} className="lead-name">
                {lead.name}
              </Link>
            </div>
            <div>
              <span
                className={`status-badge ${lead.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {lead.status}
              </span>
            </div>
            <div>
              <span className={`priority-badge ${lead.priority.toLowerCase()}`}>
                {lead.priority}
              </span>
            </div>
            <div>{lead.salesAgent?.name || "Unassigned"}</div>
            <div>{lead.timeToClose} days</div>
            <div className="action-buttons">
              <Link to={`/leads/${lead._id}/edit`} className="btn-edit">
                Edit
              </Link>
              <Link to={`/leads/${lead._id}`} className="btn-view">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="empty-state">
          <p>
            No leads found. Try adjusting your filters or create a new lead.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadList;
