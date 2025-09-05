import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { leadsAPI } from "../services/api";

const LeadForm = ({ salesAgents }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    tags: [],
    timeToClose: "",
    priority: "Medium",
  });

  useEffect(() => {
    if (isEdit) {
      const fetchLead = async () => {
        try {
          const response = await leadsAPI.getById(id);
          const leadData = response.data;
          setFormData({
            name: leadData.name || "",
            source: leadData.source || "",
            salesAgent: leadData.salesAgent?.id || leadData.salesAgent || "",
            status: leadData.status || "New",
            tags: leadData.tags || [],
            timeToClose: leadData.timeToClose || "",
            priority: leadData.priority || "Medium",
          });
        } catch (error) {
          console.error("Error fetching lead:", error);
        }
      };
      fetchLead();
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e) => {
    const options = e.target.options;
    const selectedTags = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedTags.push(options[i].value);
      }
    }
    setFormData((prev) => ({ ...prev, tags: selectedTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the data in the correct format for the backend
      const submitData = {
        name: formData.name,
        source: formData.source,
        salesAgent: formData.salesAgent,
        status: formData.status,
        tags: formData.tags,
        timeToClose: parseInt(formData.timeToClose),
        priority: formData.priority,
      };

      if (isEdit) {
        await leadsAPI.update(id, submitData);
      } else {
        await leadsAPI.create(submitData);
      }
      navigate(isEdit ? `/leads/${id}` : "/leads");
    } catch (error) {
      console.error("Error saving lead:", error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Failed to save lead. Please check your input and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-form-container">
      <h2>{isEdit ? "Edit Lead" : "Create New Lead"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Lead Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="source">Lead Source *</label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">Select source</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Email">Email</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="salesAgent">Assigned Sales Agent *</label>
            <select
              id="salesAgent"
              name="salesAgent"
              value={formData.salesAgent}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">Select agent</option>
              {salesAgents.map((agent) => (
                <option
                  key={agent.id || agent._id}
                  value={agent.id || agent._id}
                >
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Lead Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <select
              id="tags"
              name="tags"
              multiple
              value={formData.tags}
              onChange={handleTagChange}
              disabled={loading}
              size="5"
            >
              <option value="High Value">High Value</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Trial">Trial</option>
              <option value="Partner">Partner</option>
            </select>
            <small>Hold Ctrl/Cmd to select multiple tags</small>
          </div>

          <div className="form-group">
            <label htmlFor="timeToClose">Time to Close (days) *</label>
            <input
              type="number"
              id="timeToClose"
              name="timeToClose"
              min="1"
              value={formData.timeToClose}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Lead" : "Create Lead"}
          </button>
          <button type="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
