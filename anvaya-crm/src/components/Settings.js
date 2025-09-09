import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaShieldAlt,
  FaTrash,
  FaUsers,
  FaChartLine,
  FaTimes
} from "react-icons/fa";
import { leadsAPI, agentsAPI } from "../services/api";
import { toast } from "react-toastify";

const SimpleSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    theme: "light",
    emailNotifications: true,
    twoFactorAuth: false,
  });
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "lead" or "agent"

  // Load saved settings when component loads
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applyTheme(parsedSettings.theme);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "leads" || activeTab === "agents") {
      fetchData();
    }
  }, [activeTab]);

  // Function to change the theme of the ENTIRE app
  const applyTheme = (theme) => {
    // Remove any existing theme classes
    document.body.classList.remove('theme-light', 'theme-dark');
    
    // Add the new theme class
    document.body.classList.add(`theme-${theme}`);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "leads") {
        const response = await leadsAPI.getAll();
        setLeads(response.data || []);
      } else if (activeTab === "agents") {
        const response = await agentsAPI.getAll();
        setAgents(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setSettings((prev) => {
      const updatedSettings = {
        ...prev,
        [name]: newValue
      };
      
      // If theme is changed, apply it immediately
      if (name === 'theme') {
        applyTheme(newValue);
      }
      
      // Save to browser storage
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  const openDeleteModal = (type, id, name) => {
    setDeleteType(type);
    setItemToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteType("");
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (deleteType === "lead") {
        await leadsAPI.delete(itemToDelete.id);
        setLeads(leads.filter(lead => lead._id !== itemToDelete.id));
        toast.success(`Lead "${itemToDelete.name}" deleted successfully!`);
      } else if (deleteType === "agent") {
        await agentsAPI.delete(itemToDelete.id);
        setAgents(agents.filter(agent => agent._id !== itemToDelete.id));
        toast.success(`Agent "${itemToDelete.name}" deleted successfully!`);
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      toast.error(`Failed to delete ${deleteType}`);
    } finally {
      closeDeleteModal();
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "leads", label: "Manage Leads", icon: <FaChartLine /> },
    { id: "agents", label: "Manage Agents", icon: <FaUsers /> },
  ];

  return (
    <div className="settings-container">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={closeDeleteModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>
                {deleteType === "lead" 
                  ? `Are you sure you want to delete lead "${itemToDelete.name}"? This action cannot be undone.`
                  : `Are you sure you want to delete agent "${itemToDelete.name}"? This will also unassign all their leads.`
                }
              </p>
            </div>
            <div className="modal-footer">
              <button className="settings-cancel-button" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="settings-delete-button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-main">
          {activeTab === "profile" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Profile Information</h2>
              <div className="settings-form-group">
                <label className="settings-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleInputChange}
                  className="settings-input"
                />
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="settings-input"
                />
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Appearance</h2>
              <div className="settings-form-group">
                <label className="settings-label">Theme</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  className="settings-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="settings-theme-preview">
                <h3 className="settings-preview-title">Preview</h3>
                <div className="settings-preview-box">
                  <p>This is how your application will look with the {settings.theme} theme.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Notifications</h2>
              <div className="settings-checkbox-group">
                <label className="settings-checkbox-label">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                    className="settings-checkbox"
                  />
                  Email Notifications
                </label>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Security</h2>
              <div className="settings-checkbox-group">
                <label className="settings-checkbox-label">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleInputChange}
                    className="settings-checkbox"
                  />
                  Two-Factor Authentication
                </label>
              </div>
              <button className="settings-secondary-button">Change Password</button>
            </div>
          )}

          {activeTab === "leads" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Manage Leads</h2>
              {loading ? (
                <div className="settings-loading">Loading leads...</div>
              ) : leads.length === 0 ? (
                <p className="settings-no-data">No leads found.</p>
              ) : (
                <div className="settings-list-container">
                  {leads.map((lead, index) => (
                    <div 
                      key={lead._id} 
                      className="settings-list-item"
                      style={index === leads.length - 1 ? {borderBottom: 'none'} : {}}
                    >
                      <div className="settings-item-info">
                        <div className="settings-item-name">{lead.name}</div>
                        <div className="settings-item-details">
                          {lead.status} • {lead.priority} • {lead.salesAgent?.name || "Unassigned"}
                        </div>
                      </div>
                      <button
                        className="settings-delete-button"
                        onClick={() => openDeleteModal("lead", lead._id, lead.name)}
                        title="Delete lead"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "agents" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Manage Sales Agents</h2>
              {loading ? (
                <div className="settings-loading">Loading agents...</div>
              ) : agents.length === 0 ? (
                <p className="settings-no-data">No agents found.</p>
              ) : (
                <div className="settings-list-container">
                  {agents.map((agent, index) => (
                    <div 
                      key={agent._id} 
                      className="settings-list-item"
                      style={index === agents.length - 1 ? {borderBottom: 'none'} : {}}
                    >
                      <div className="settings-item-info">
                        <div className="settings-item-name">{agent.name}</div>
                        <div className="settings-item-details">{agent.email}</div>
                      </div>
                      <button
                        className="settings-delete-button"
                        onClick={() => openDeleteModal("agent", agent._id, agent.name)}
                        title="Delete agent"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab !== "leads" && activeTab !== "agents" && (
            <div className="settings-actions">
              <button className="settings-primary-button" onClick={handleSave}>
                Save Changes
              </button>
              <button className="settings-cancel-button">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleSettings;