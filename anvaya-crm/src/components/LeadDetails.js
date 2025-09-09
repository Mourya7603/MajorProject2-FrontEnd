import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { leadsAPI, commentsAPI } from "../services/api";
import { toast } from 'react-toastify';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid lead ID. Please check the URL.");
      setLoading(false);
      return;
    }

    const fetchLeadDetails = async () => {
      try {
        setLoading(true);

        const leadResponse = await leadsAPI.getById(id);
        setLead(leadResponse.data);

        const commentsResponse = await commentsAPI.getByLeadId(id);
        setComments(commentsResponse.data || []);
      } catch (err) {
        console.error("Error fetching lead details:", err);
        if (err.response?.status === 404) {
          setError("Lead not found. It may have been deleted.");
        } else {
          setError("Failed to load lead details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDetails();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await commentsAPI.create(id, {
        commentText: newComment,
        author: lead?.salesAgent?._id,
      });
      setComments([...comments, response.data]);
      setNewComment("");
      toast.success('Comment added successfully!');
    } catch (err) {
      console.error("Error submitting comment:", err);
      const errorMessage = err.response?.data?.error || "Failed to submit comment. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading lead details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="lead-details-container">
        <div className="error-message">{error}</div>
        <button
          onClick={() => navigate("/leads")}
          className="back-button"
        >
          Go Back to Leads
        </button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="lead-details-container">
        <div className="error-message">Lead not found</div>
        <button
          onClick={() => navigate("/leads")}
          className="back-button"
        >
          Go Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="lead-details-container">
      {/* Header */}
      <div className="lead-details-header">
        <button
          onClick={() => navigate("/leads")}
          className="back-button"
        >
          ← Back to Leads
        </button>
        <h1 className="lead-title">
          Lead Details: {lead.name}
        </h1>
        <Link
          to={`/leads/${lead._id}/edit`}
          className="edit-button"
        >
          Edit Lead
        </Link>
      </div>

      {/* Lead Info */}
      <div className="lead-info-card">
        <h2 className="lead-info-title">Lead Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Lead Name:</span>
            <span className="info-value">{lead.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sales Agent:</span>
            <span className="info-value">{lead.salesAgent?.name || "Unassigned"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Lead Source:</span>
            <span className="info-value">{lead.source}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="status-badge">{lead.status}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Priority:</span>
            <span className="priority-badge">{lead.priority}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Time to Close:</span>
            <span className="info-value">{lead.timeToClose} days</span>
          </div>
          <div className="info-item">
            <span className="info-label">Created:</span>
            <span className="info-value">{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
          {lead.closedAt && (
            <div className="info-item">
              <span className="info-label">Closed:</span>
              <span className="info-value">{new Date(lead.closedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="comments-card">
        <h2 className="comments-title">Comments & Activity</h2>
        {comments.length === 0 ? (
          <p className="empty-comments">
            No comments yet. Be the first to add one.
          </p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="comment-item"
              >
                <div className="comment-header">
                  <div className="comment-author">
                    {comment.author?.name || "System"}
                  </div>
                  <div className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="comment-text">{comment.commentText}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="comment-form">
          <label htmlFor="comment" className="comment-label">
            Add New Comment:
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-textarea"
            placeholder="Type your comment..."
            disabled={submitting}
            required
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="comment-submit"
          >
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadDetails;