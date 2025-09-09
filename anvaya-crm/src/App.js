import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LeadForm from "./components/LeadForm";
import LeadList from "./components/LeadList";
import LeadDetails from "./components/LeadDetails";
import SalesAgentManagement from "./components/SalesAgentManagement";
import Reports from "./components/Reports";
import { agentsAPI } from "./services/api";
import AddAgentForm from "./components/AddAgentForm";
import Settings from "./components/Settings";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {
  const [salesAgents, setSalesAgents] = useState([]);
  const [loading, setLoading] = useState(true);

   // Initialize theme on app load
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Apply the saved theme
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(`theme-${parsedSettings.theme || 'light'}`);
    } else {
      // Apply default theme
      document.body.classList.add('theme-light');
    }
  }, []);

  useEffect(() => {
    const fetchSalesAgents = async () => {
      try {
        const response = await agentsAPI.getAll();
        setSalesAgents(response.data);
      } catch (error) {
        console.error("Error fetching sales agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesAgents();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadList />} />
            <Route
              path="/leads/new"
              element={<LeadForm salesAgents={salesAgents} />}
            />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route
              path="/leads/:id/edit"
              element={<LeadForm salesAgents={salesAgents} />}
            />

            <Route path="/agents" element={<SalesAgentManagement />} />
            <Route path="/agents/new" element={<AddAgentForm />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
        </div>
      </div>
    </Router>
  );
}

export default App;
