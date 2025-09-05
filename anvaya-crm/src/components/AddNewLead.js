// components/AddNewLead.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNewLead = ({ agents, setLeads, API_BASE }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    source: "Website",
    assignedAgent: agents.length > 0 ? agents[0].name : "",
    status: "New",
    priority: "Medium",
    timeToClose: 30,
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newLead = await response.json();
        setLeads((prevLeads) => [...prevLeads, newLead]);
        navigate("/leads");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  return (
    <div>
      <h1>Add New Lead</h1>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Lead Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lead Source:</label>
          <select name="source" value={formData.source} onChange={handleChange}>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Sales Agent:</label>
          <select
            name="assignedAgent"
            value={formData.assignedAgent}
            onChange={handleChange}
          >
            {agents.map((agent) => (
              <option key={agent._id} value={agent.name}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Lead Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority:</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label>Time to Close (days):</label>
          <input
            type="number"
            name="timeToClose"
            value={formData.timeToClose}
            onChange={handleChange}
            min="1"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Create Lead
        </button>
      </form>
    </div>
  );
};

export default AddNewLead;
