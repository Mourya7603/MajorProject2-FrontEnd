import React, { useState } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaDatabase,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";

const SimpleSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    theme: "light",
    emailNotifications: true,
    twoFactorAuth: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Manage your account preferences</p>
      </div>

      <div style={styles.content}>
        <div style={styles.sidebar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={styles.main}>
          {activeTab === "profile" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Profile Information</h2>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Appearance</h2>
              <div style={styles.formGroup}>
                <label style={styles.label}>Theme</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Notifications</h2>
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  Email Notifications
                </label>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Security</h2>
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  Two-Factor Authentication
                </label>
              </div>
              <button style={styles.secondaryButton}>Change Password</button>
            </div>
          )}

          <div style={styles.actions}>
            <button style={styles.primaryButton} onClick={handleSave}>
              Save Changes
            </button>
            <button style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  header: {
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  title: {
    fontSize: "28px",
    color: "#2c3e50",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#7f8c8d",
    margin: 0,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
  },
  sidebar: {
    width: "250px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    border: "none",
    background: "transparent",
    color: "#7f8c8d",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    width: "100%",
    textAlign: "left",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  activeTab: {
    background: "#3498db",
    color: "white",
  },
  tabIcon: {
    fontSize: "18px",
  },
  main: {
    flex: 1,
    background: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#2c3e50",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
    background: "white",
  },
  checkboxGroup: {
    marginBottom: "15px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "30px",
  },
  primaryButton: {
    background: "#3498db",
    color: "white",
    padding: "12px 25px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  cancelButton: {
    background: "#95a5a6",
    color: "white",
    padding: "12px 25px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  secondaryButton: {
    background: "transparent",
    color: "#3498db",
    padding: "10px 20px",
    border: "1px solid #3498db",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default SimpleSettings;
