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

  if (loading) return <div style={styles.loading}>Loading Leads...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Lead Management</h1>
        <Link to="/leads/new" style={styles.primaryButton}>
          Add New Lead
        </Link>
      </div>

      {/* Mobile controls */}
      <div style={isMobile ? styles.mobileControls : styles.hidden}>
        <button
          style={styles.mobileFilterToggle}
          onClick={() => setShowFilters((s) => !s)}
        >
          <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {(showFilters || !isMobile) && (
        <div style={styles.filterContainer}>
          <FilterBar onFilterChange={handleFilterChange} />
        </div>
      )}

      {/* Desktop table */}
      {!isMobile && (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div style={styles.th} onClick={() => toggleSort("name")}>
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div style={styles.th} onClick={() => toggleSort("status")}>
              Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div style={styles.th} onClick={() => toggleSort("priority")}>
              Priority {sortField === "priority" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div style={styles.th}>Sales Agent</div>
            <div style={styles.th} onClick={() => toggleSort("timeToClose")}>
              Time to Close {sortField === "timeToClose" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div style={styles.th}>Actions</div>
          </div>

          {sortedLeads.map((lead) => {
            const statusKey = (lead.status || "").toLowerCase().replace(/\s+/g, "-");
            const priorityKey = (lead.priority || "").toLowerCase();
            return (
              <div key={lead._id} style={styles.tr}>
                <div>
                  <Link to={`/leads/${lead._id}`} style={styles.leadName}>
                    {lead.name}
                  </Link>
                </div>
                <div>
                  <span style={{ ...styles.badge, ...(styles.status[statusKey] || {}) }}>
                    {lead.status}
                  </span>
                </div>
                <div>
                  <span style={{ ...styles.badge, ...(styles.priority[priorityKey] || {}) }}>
                    {lead.priority}
                  </span>
                </div>
                <div>{lead.salesAgent?.name || "Unassigned"}</div>
                <div>{lead.timeToClose} days</div>
                <div style={styles.actions}>
                  <Link to={`/leads/${lead._id}/edit`} style={styles.editButton}>
                    <FaEdit /> Edit
                  </Link>
                  <Link to={`/leads/${lead._id}`} style={styles.viewButton}>
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
        <div style={styles.cards}>
          {sortedLeads.map((lead) => {
            const statusKey = (lead.status || "").toLowerCase().replace(/\s+/g, "-");
            const priorityKey = (lead.priority || "").toLowerCase();
            return (
              <div key={lead._id} style={styles.card}>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Name</span>
                  <Link to={`/leads/${lead._id}`} style={styles.leadName}>
                    {lead.name}
                  </Link>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Status</span>
                  <span style={{ ...styles.badge, ...(styles.status[statusKey] || {}), alignSelf: "start" }}>
                    {lead.status}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Priority</span>
                  <span style={{ ...styles.badge, ...(styles.priority[priorityKey] || {}), alignSelf: "start" }}>
                    {lead.priority}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Sales Agent</span>
                  <span>{lead.salesAgent?.name || "Unassigned"}</span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Time to Close</span>
                  <span>{lead.timeToClose} days</span>
                </div>
                <div style={styles.mobileActions}>
                  <Link to={`/leads/${lead._id}/edit`} style={{ ...styles.editButton, ...styles.mobileButton }}>
                    <FaEdit /> Edit
                  </Link>
                  <Link to={`/leads/${lead._id}`} style={{ ...styles.viewButton, ...styles.mobileButton }}>
                    <FaEye /> View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {leads.length === 0 && (
        <div style={styles.emptyState}>
          <p>No leads found. Try adjusting your filters or create a new lead.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loading: {
    padding: "20px",
    textAlign: "center",
    fontSize: "16px",
    color: "#7f8c8d",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },
  title: { fontSize: "24px", color: "#2c3e50" },
  primaryButton: {
    background: "#3498db",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
  },

  /* Filters */
  mobileControls: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "10px",
  },
  hidden: { display: "none" },
  mobileFilterToggle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#3498db",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  filterContainer: { marginBottom: "20px" },

  /* Desktop table */
  table: {
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.5fr 1fr 1fr",
    padding: "15px",
    background: "#f8f9fa",
    fontWeight: "bold",
    borderBottom: "2px solid #eee",
  },
  th: { cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" },
  tr: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.5fr 1fr 1fr",
    padding: "15px",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },

  /* Mobile cards */
  cards: { display: "grid", gap: "12px" },
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "10px",
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  cardLabel: { fontWeight: 600, color: "#2c3e50", fontSize: "14px" },
  mobileActions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    justifyContent: "stretch",
  },
  mobileButton: {
    flex: 1,
    justifyContent: "center",
    display: "flex",
  },

  /* Shared bits */
  leadName: { color: "#3498db", textDecoration: "none", fontWeight: 500 },
  badge: {
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
    textAlign: "center",
  },
  status: {
    new: { backgroundColor: "#e3f2fd", color: "#1565c0" },
    contacted: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    qualified: { backgroundColor: "#fff8e1", color: "#f9a825" },
    "proposal-sent": { backgroundColor: "#fbe9e7", color: "#d84315" },
    closed: { backgroundColor: "#e8eaf6", color: "#283593" },
  },
  priority: {
    high: { backgroundColor: "#ffebee", color: "#c62828" },
    medium: { backgroundColor: "#fff8e1", color: "#f9a825" },
    low: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
  },

  /* Actions */
  actions: { display: "flex", gap: "8px" },
  editButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  viewButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  /* Empty */
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#7f8c8d",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    marginTop: "20px",
  },
};

export default LeadList;