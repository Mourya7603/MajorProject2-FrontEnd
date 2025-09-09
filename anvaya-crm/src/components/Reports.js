import React, { useState, useEffect } from "react";
import { reportsAPI, leadsAPI, agentsAPI } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [pipelineData, setPipelineData] = useState({});
  const [closedByAgentData, setClosedByAgentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Check for dark theme
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.body.classList.contains('theme-dark'));
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          leadsResponse,
          agentsResponse,
          pipelineResponse,
          closedResponse,
        ] = await Promise.all([
          leadsAPI.getAll(),
          agentsAPI.getAll(),
          reportsAPI.getPipeline(),
          reportsAPI.getClosedByAgent(),
        ]);

        setLeads(leadsResponse.data);
        setAgents(agentsResponse.data);
        setPipelineData(pipelineResponse.data);
        setClosedByAgentData(closedResponse.data);
      } catch (err) {
        console.error("Error fetching reports data:", err);
        setError("Failed to load reports data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart options with dark mode support
  const getChartOptions = (title, chartType = 'bar') => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkTheme ? '#e0e0e0' : '#666'
        }
      },
      title: {
        display: true,
        text: title,
        color: isDarkTheme ? '#e0e0e0' : '#666',
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: isDarkTheme ? '#2d2d2d' : '#fff',
        titleColor: isDarkTheme ? '#e0e0e0' : '#666',
        bodyColor: isDarkTheme ? '#e0e0e0' : '#666',
        borderColor: isDarkTheme ? '#555' : '#ddd',
        borderWidth: 1
      }
    },
    // Only include scales for bar charts, not pie charts
    ...(chartType === 'bar' && {
      scales: {
        y: {
          ticks: {
            color: isDarkTheme ? '#e0e0e0' : '#666'
          },
          grid: {
            color: isDarkTheme ? '#404040' : '#eee'
          }
        },
        x: {
          ticks: {
            color: isDarkTheme ? '#e0e0e0' : '#666'
          },
          grid: {
            color: isDarkTheme ? '#404040' : '#eee'
          }
        }
      }
    })
  });

  if (loading) {
    return (
      <div className="reports">
        <h1>Anvaya CRM Reports</h1>
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports">
        <h1>Anvaya CRM Reports</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  // ✅ Lead status counts
  const statusCounts = (leads || []).reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Leads by Status",
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // ✅ Leads closed in the last week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const closedLastWeek = (leads || []).filter((lead) => {
    if (lead.status !== "Closed") return false;
    if (!lead.closedAt) return false;
    const closedDate = new Date(lead.closedAt);
    return !isNaN(closedDate) && closedDate >= oneWeekAgo;
  });

  const closedLastWeekData = {
    labels: ["Closed Last Week"],
    datasets: [
      {
        label: "Leads Closed Last Week",
        data: [closedLastWeek.length],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // ✅ Agent performance calculation
  const agentPerformance = (agents || []).map((agent) => {
    const agentLeads = (leads || []).filter(
      (lead) =>
        lead.salesAgent?._id === agent._id || // populated
        lead.salesAgent === agent._id // plain reference
    );

    const closedLeads = agentLeads.filter(
      (lead) => lead.status === "Closed"
    ).length;

    return {
      name: agent.name,
      closed: closedLeads,
      total: agentLeads.length,
      conversionRate:
        agentLeads.length > 0
          ? ((closedLeads / agentLeads.length) * 100).toFixed(2)
          : 0,
    };
  });

  const agentPerformanceData = {
    labels: agentPerformance.map((agent) => agent.name),
    datasets: [
      {
        label: "Total Leads",
        data: agentPerformance.map((agent) => agent.total),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Closed Leads",
        data: agentPerformance.map((agent) => agent.closed),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // ✅ Pipeline value calculation
  const pipelineValue = (leads || [])
    .filter((lead) => lead.status !== "Closed")
    .reduce((total, lead) => total + (lead.timeToClose * 100 || 0), 0);

  return (
    <div className="reports">
      <h1>Anvaya CRM Reports</h1>

      {/* Top Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Leads</p>
          <h3>{leads.length}</h3>
        </div>
        <div className="stat-card">
          <p>Leads in Pipeline</p>
          <h3>{leads.filter((lead) => lead.status !== "Closed").length}</h3>
        </div>
        <div className="stat-card">
          <p>Pipeline Value</p>
          <h3>${pipelineValue.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <p>Closed Last Week</p>
          <h3>{closedLastWeek.length}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Lead Status Distribution</h3>
          <div className="chart">
            <Pie 
              data={statusData} 
              options={getChartOptions("Lead Status Distribution", "pie")} 
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>Leads Closed Last Week</h3>
          <div className="chart">
            <Bar 
              data={closedLastWeekData} 
              options={getChartOptions("Leads Closed Last Week", "bar")} 
            />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Agent Performance</h3>
          <div className="chart">
            <Bar
              data={agentPerformanceData}
              options={getChartOptions("Agent Performance", "bar")}
            />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Agent Conversion Rates</h3>
          <table className="conversion-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Total Leads</th>
                <th>Closed Leads</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {agentPerformance.map((agent) => (
                <tr key={agent.name}>
                  <td>{agent.name}</td>
                  <td>{agent.total}</td>
                  <td>{agent.closed}</td>
                  <td>{agent.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;