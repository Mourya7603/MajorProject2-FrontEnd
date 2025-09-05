import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { leadsAPI, commentsAPI } from "../services/api";

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
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", fontWeight: "bold" }}>
        Loading lead details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        <button
          onClick={() => navigate("/leads")}
          style={{
            padding: "8px 14px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Go Back to Leads
        </button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ color: "red", marginBottom: "10px" }}>Lead not found</div>
        <button
          onClick={() => navigate("/leads")}
          style={{
            padding: "8px 14px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Go Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate("/leads")}
          style={{
            padding: "6px 12px",
            background: "#f1f1f1",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          ← Back to Leads
        </button>
        <h1 style={{ margin: 0, fontSize: "20px" }}>
          Lead Details: {lead.name}
        </h1>
        <Link
          to={`/leads/${lead._id}/edit`}
          style={{
            padding: "6px 12px",
            background: "#007bff",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Edit Lead
        </Link>
      </div>

      {/* Lead Info */}
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Lead Information</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <strong>Lead Name:</strong> {lead.name}
          </div>
          <div>
            <strong>Sales Agent:</strong>{" "}
            {lead.salesAgent?.name || "Unassigned"}
          </div>
          <div>
            <strong>Lead Source:</strong> {lead.source}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span
              style={{
                padding: "2px 6px",
                background: "#e0f7fa",
                borderRadius: "4px",
              }}
            >
              {lead.status}
            </span>
          </div>
          <div>
            <strong>Priority:</strong>{" "}
            <span
              style={{
                padding: "2px 6px",
                background: "#ffe0b2",
                borderRadius: "4px",
              }}
            >
              {lead.priority}
            </span>
          </div>
          <div>
            <strong>Time to Close:</strong> {lead.timeToClose} days
          </div>
          <div>
            <strong>Created:</strong>{" "}
            {new Date(lead.createdAt).toLocaleDateString()}
          </div>
          {lead.closedAt && (
            <div>
              <strong>Closed:</strong>{" "}
              {new Date(lead.closedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "6px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Comments & Activity</h2>
        {comments.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#888" }}>
            No comments yet. Be the first to add one.
          </p>
        ) : (
          <div>
            {comments.map((comment) => (
              <div
                key={comment._id}
                style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
              >
                <div style={{ fontWeight: "bold" }}>
                  {comment.author?.name || "System"}{" "}
                  <span style={{ color: "#888", fontSize: "12px" }}>
                    ({new Date(comment.createdAt).toLocaleString()})
                  </span>
                </div>
                <div>{comment.commentText}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitComment} style={{ marginTop: "15px" }}>
          <label
            htmlFor="comment"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Add New Comment:
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
            placeholder="Type your comment..."
            disabled={submitting}
            required
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            style={{
              padding: "8px 14px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadDetails;
