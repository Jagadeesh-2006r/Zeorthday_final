import React, { useState } from "react";
import {
  Plus,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { User as UserType } from "../../types";

type Comment = {
  text: string;
  author: string;
  createdAt: string;
};

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  submittedBy: string;
  submittedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  images?: string[];
  comments: Comment[];
};

const ComplaintSystem: React.FC = () => {
  const { user } = useAuth();
  const { complaints, addComplaint, updateComplaint } = useData();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [commentText, setCommentText] = useState("");

  // Add Complaint handler
  const handleCreateComplaint = (complaint: any) => {
    addComplaint({
      ...complaint,
      submittedBy: user?.name || "Unknown",
      comments: [],
    });
    setShowCreateModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "in-progress":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "closed":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hostel":
        return "bg-purple-100 text-purple-800";
      case "classroom":
        return "bg-blue-100 text-blue-800";
      case "campus":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesCategory =
      selectedCategory === "all" || complaint.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || complaint.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  // Calculate dynamic complaint statistics
  const complaintStats = {
    pending: complaints.filter(
      (c) => c.status === "pending" || c.status === "open"
    ).length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    total: complaints.length,
  };

  // Add comment handler
  const handleAddComment = () => {
    if (!selectedComplaint || !commentText.trim()) return;

    const newComment = {
      text: commentText,
      author: user?.name || "Anonymous",
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...(selectedComplaint.comments || []), newComment];
    updateComplaint(selectedComplaint.id, { comments: updatedComments });

    setCommentText("");
    setShowCommentModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint System</h1>
          <p className="mt-1 text-gray-600">
            Report and track issues across campus
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Report Issue
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="hostel">Hostel</option>
              <option value="classroom">Classroom</option>
              <option value="campus">Campus</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full"
              onClick={() => setShowAdvancedFilter(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {complaintStats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {complaintStats.inProgress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {complaintStats.resolved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gray-500 rounded-lg p-3">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {complaintStats.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(complaint.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-gray-600">#{complaint.id}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status.replace("-", " ").toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{complaint.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(
                    complaint.category
                  )}`}
                >
                  {complaint.category.charAt(0).toUpperCase() +
                    complaint.category.slice(1)}
                </span>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{complaint.submittedBy}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(complaint.submittedAt)}</span>
                </div>
                {complaint.assignedTo && (
                  <span className="text-blue-600">
                    Assigned to: {complaint.assignedTo}
                  </span>
                )}
              </div>

              {complaint.images && complaint.images.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Attachments:
                  </p>
                  <div className="flex space-x-2">
                    {complaint.images.map((image, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {complaint.comments && complaint.comments.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Comments:
                  </p>
                  <div className="space-y-2">
                    {complaint.comments.map((comment, idx) => (
                      <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                        <span className="font-medium text-gray-900">
                          {comment.author}
                        </span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(comment.createdAt)}
                        </span>
                        <div className="text-gray-800 mt-1">{comment.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowDetailsModal(true);
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowCommentModal(true);
                    }}
                  >
                    Add Comment
                  </button>
                </div>
                {complaint.resolvedAt && (
                  <span className="text-sm text-green-600">
                    Resolved on {formatDate(complaint.resolvedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No complaints found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or create a new complaint.
          </p>
        </div>
      )}

      {showCreateModal && (
        <CreateComplaintModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateComplaint}
        />
      )}
      {/* Advanced Filter Modal */}
      {showAdvancedFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAdvancedFilter(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Advanced Filters</h2>
            <p className="mb-4 text-gray-600">
              (Advanced filter options not implemented. This is a placeholder
              modal.)
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAdvancedFilter(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* View Details Modal */}
      {showDetailsModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowDetailsModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">
              {selectedComplaint.title}
            </h2>
            <div className="mb-2 text-gray-600">
              {selectedComplaint.description}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Category:</span>{" "}
              {selectedComplaint.category}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {selectedComplaint.status}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Priority:</span>{" "}
              {selectedComplaint.priority}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Submitted By:</span>{" "}
              {selectedComplaint.submittedBy}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Submitted At:</span>{" "}
              {formatDate(selectedComplaint.submittedAt)}
            </div>
            {selectedComplaint.resolvedAt && (
              <div className="mb-2">
                <span className="font-semibold">Resolved At:</span>{" "}
                {formatDate(selectedComplaint.resolvedAt)}
              </div>
            )}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Add Comment Modal */}
      {showCommentModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowCommentModal(false);
                setCommentText("");
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add Comment</h2>
            <textarea
              className="w-full border rounded px-2 py-1 mb-4"
              placeholder="Type your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              onClick={handleAddComment}
            >
              Submit
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={() => {
                setShowCommentModal(false);
                setCommentText("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintSystem;

interface CreateComplaintModalProps {
  onClose: () => void;
  onCreate: (
    complaint: Omit<Complaint, "id" | "submittedBy" | "submittedAt">
  ) => void;
}

const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("hostel");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    onCreate({
      title,
      description,
      category,
      status: "pending",
      priority,
      images,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Report Issue</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="hostel">Hostel</option>
                <option value="classroom">Classroom</option>
                <option value="campus">Campus</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
