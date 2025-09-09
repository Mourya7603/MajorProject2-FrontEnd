import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { leadsAPI } from "../services/api";
import FilterBar from "../common/FilterBar";
import { FaEdit, FaEye, FaFilter, FaSort } from "react-icons/fa";

/** Hook: true if viewport <= breakpoint */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
};

const LeadList = () => {
  const isMobile = useIsMobile(768);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Function to check if dark mode is enabled
  const isDarkTheme = () => document.body.classList.contains('theme-dark');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const response = await leadsAPI.getAll(params);
        setLeads(response.data || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => setSearchParams(newFilters);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const av = (a?.[sortField] ?? "").toString().toLowerCase();
    const bv = (b?.[sortField] ?? "").toString().toLowerCase();
    if (av < bv) return sortDirection === "asc" ? -1 : 1;
    if (av > bv) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) return <div className="loading">Loading Leads...</div>;

  return (
    <div className="lead-list-container">
      <div className="page-header">
        <h1 className="title">Lead Management</h1>
        <Link to="/leads/new" className="primary-button">
          Add New Lead
        </Link>
      </div>

      {/* Mobile controls */}
      <div className={isMobile ? "mobile-controls" : "hidden"}>
        <button
          className="mobile-filter-toggle"
          onClick={() => setShowFilters((s) => !s)}
        >
          <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {(showFilters || !isMobile) && (
        <div className="filter-container">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>
      )}

      {/* Desktop table */}
      {!isMobile && (
        <div className="table">
          <div className="table-header">
            <div className="th" onClick={() => toggleSort("name")}>
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="th" onClick={() => toggleSort("status")}>
              Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="th" onClick={() => toggleSort("priority")}>
              Priority {sortField === "priority" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="th">Sales Agent</div>
            <div className="th" onClick={() => toggleSort("timeToClose")}>
              Time to Close {sortField === "timeToClose" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="th">Actions</div>
          </div>

          {sortedLeads.map((lead) => {
            const statusKey = (lead.status || "").toLowerCase().replace(/\s+/g, "-");
            const priorityKey = (lead.priority || "").toLowerCase();
            return (
              <div key={lead._id} className="tr">
                <div>
                  <Link to={`/leads/${lead._id}`} className="lead-name">
                    {lead.name}
                  </Link>
                </div>
                <div>
                  <span className={`status-badge ${statusKey}`}>
                    {lead.status}
                  </span>
                </div>
                <div>
                  <span className={`priority-badge ${priorityKey}`}>
                    {lead.priority}
                  </span>
                </div>
                <div>{lead.salesAgent?.name || "Unassigned"}</div>
                <div>{lead.timeToClose} days</div>
                <div className="action-buttons">
                  <Link to={`/leads/${lead._id}/edit`} className="btn-edit">
                    <FaEdit /> Edit
                  </Link>
                  <Link to={`/leads/${lead._id}`} className="btn-view">
                    <FaEye /> View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile cards */}
      {isMobile && (
        <div className="cards">
          {sortedLeads.map((lead) => {
            const statusKey = (lead.status || "").toLowerCase().replace(/\s+/g, "-");
            const priorityKey = (lead.priority || "").toLowerCase();
            return (
              <div key={lead._id} className="card">
                <div className="card-row">
                  <span className="card-label">Name</span>
                  <Link to={`/leads/${lead._id}`} className="lead-name">
                    {lead.name}
                  </Link>
                </div>
                <div className="card-row">
                  <span className="card-label">Status</span>
                  <span className={`status-badge ${statusKey}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">Priority</span>
                  <span className={`priority-badge ${priorityKey}`}>
                    {lead.priority}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">Sales Agent</span>
                  <span>{lead.salesAgent?.name || "Unassigned"}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Time to Close</span>
                  <span>{lead.timeToClose} days</span>
                </div>
                <div className="mobile-actions">
                  <Link to={`/leads/${lead._id}/edit`} className="btn-edit mobile-button">
                    <FaEdit /> Edit
                  </Link>
                  <Link to={`/leads/${lead._id}`} className="btn-view mobile-button">
                    <FaEye /> View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {leads.length === 0 && (
        <div className="empty-state">
          <p>No leads found. Try adjusting your filters or create a new lead.</p>
        </div>
      )}
    </div>
  );
};

export default LeadList;