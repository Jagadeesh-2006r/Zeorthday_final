import React, { useState } from "react";
import {
  BarChart3,
  Plus,
  Vote,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  TrendingUp,
  MessageSquare,
  Star,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Poll {
  id: string;
  title: string;
  description: string;
  type: "multiple-choice" | "yes-no" | "rating" | "text";
  options?: string[];
  status: "draft" | "active" | "closed";
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  category: "academic" | "facilities" | "events" | "general" | "feedback";
  isAnonymous: boolean;
  allowMultiple: boolean;
  totalVotes: number;
  results?: { [key: string]: number };
  textResponses?: string[];
}

interface Vote {
  id: string;
  pollId: string;
  userId: string;
  response: string | string[] | number;
  submittedAt: string;
  isAnonymous: boolean;
}

const PollsFeedback: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "active" | "my-polls" | "results" | "feedback"
  >("active");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "POLL001",
      title: "Do you prefer offline exams?",
      description:
        "We want to understand student preferences for examination modes to improve the academic experience.",
      type: "yes-no",
      options: ["Yes", "No"],
      status: "active",
      createdBy: "Dr. Academic Affairs",
      createdAt: "2025-01-20T10:00:00Z",
      expiresAt: "2025-02-15T23:59:59Z",
      category: "academic",
      isAnonymous: true,
      allowMultiple: false,
      totalVotes: 245,
      results: { Yes: 156, No: 89 },
    },
    {
      id: "POLL002",
      title: "Rate the Campus Canteen Service",
      description:
        "Help us improve our canteen services by rating different aspects.",
      type: "rating",
      status: "active",
      createdBy: "Canteen Management",
      createdAt: "2025-01-18T14:30:00Z",
      expiresAt: "2025-01-30T23:59:59Z",
      category: "facilities",
      isAnonymous: true,
      allowMultiple: false,
      totalVotes: 189,
      results: { "1": 12, "2": 23, "3": 45, "4": 67, "5": 42 },
    },
    {
      id: "POLL003",
      title: "Which programming languages should we add to the curriculum?",
      description:
        "Select the programming languages you think would be most beneficial for your career.",
      type: "multiple-choice",
      options: ["Rust", "Go", "Kotlin", "Swift", "TypeScript", "Dart"],
      status: "active",
      createdBy: "Computer Science Department",
      createdAt: "2025-01-15T09:00:00Z",
      expiresAt: "2025-02-28T23:59:59Z",
      category: "academic",
      isAnonymous: false,
      allowMultiple: true,
      totalVotes: 167,
      results: {
        Rust: 45,
        Go: 67,
        Kotlin: 89,
        Swift: 34,
        TypeScript: 123,
        Dart: 28,
      },
    },
    {
      id: "POLL004",
      title: "Tech Fest 2025 Feedback",
      description: "Share your experience about the recent Tech Fest event.",
      type: "text",
      status: "active",
      createdBy: "Event Committee",
      createdAt: "2025-01-22T16:00:00Z",
      expiresAt: "2025-02-05T23:59:59Z",
      category: "events",
      isAnonymous: true,
      allowMultiple: false,
      totalVotes: 78,
      textResponses: [
        "Great event! Loved the coding competition.",
        "Food arrangements could be better.",
        "Amazing speakers and workshops.",
        "Need more technical sessions.",
        "Well organized overall.",
      ],
    },
    {
      id: "POLL005",
      title: "Library Operating Hours",
      description: "Should we extend library hours during exam periods?",
      type: "yes-no",
      options: [
        "Yes, extend to 24/7",
        "Yes, extend to midnight",
        "No, current hours are fine",
      ],
      status: "closed",
      createdBy: "Library Administration",
      createdAt: "2025-01-10T11:00:00Z",
      expiresAt: "2025-01-20T23:59:59Z",
      category: "facilities",
      isAnonymous: true,
      allowMultiple: false,
      totalVotes: 312,
      results: {
        "Yes, extend to 24/7": 189,
        "Yes, extend to midnight": 87,
        "No, current hours are fine": 36,
      },
    },
  ]);

  const [userVotes, setUserVotes] = useState<Vote[]>([
    {
      id: "VOTE001",
      pollId: "POLL001",
      userId: user?.id || "current-user",
      response: "Yes",
      submittedAt: "2025-01-21T14:30:00Z",
      isAnonymous: true,
    },
    {
      id: "VOTE002",
      pollId: "POLL003",
      userId: user?.id || "current-user",
      response: ["TypeScript", "Go", "Kotlin"],
      submittedAt: "2025-01-19T10:15:00Z",
      isAnonymous: false,
    },
  ]);

  const categories = [
    "all",
    "academic",
    "facilities",
    "events",
    "general",
    "feedback",
  ];

  const filteredPolls = polls.filter((poll) => {
    const matchesCategory =
      selectedCategory === "all" || poll.category === selectedCategory;
    const matchesTab =
      activeTab === "active"
        ? poll.status === "active"
        : activeTab === "my-polls"
        ? poll.createdBy === user?.name
        : activeTab === "results"
        ? poll.status === "closed"
        : poll.category === "feedback";

    return matchesCategory && matchesTab;
  });

  const hasUserVoted = (pollId: string) => {
    return userVotes.some((vote) => vote.pollId === pollId);
  };

  const getUserVote = (pollId: string) => {
    return userVotes.find((vote) => vote.pollId === pollId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800";
      case "facilities":
        return "bg-purple-100 text-purple-800";
      case "events":
        return "bg-pink-100 text-pink-800";
      case "feedback":
        return "bg-orange-100 text-orange-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculatePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const handleVote = (pollId: string, response: any) => {
    const newVote: Vote = {
      id: "VOTE" + Date.now(),
      pollId,
      userId: user?.id || "current-user",
      response,
      submittedAt: new Date().toISOString(),
      isAnonymous: polls.find((p) => p.id === pollId)?.isAnonymous || false,
    };

    // Add the new vote to user votes
    setUserVotes((prev) => [...prev, newVote]);

    // Update poll results
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          const updatedResults = { ...poll.results };
          if (poll.type === "multiple-choice" && Array.isArray(response)) {
            response.forEach((option) => {
              updatedResults[option] = (updatedResults[option] || 0) + 1;
            });
          } else if (poll.type === "rating") {
            updatedResults[response.toString()] =
              (updatedResults[response.toString()] || 0) + 1;
          } else if (poll.type === "text") {
            return {
              ...poll,
              totalVotes: poll.totalVotes + 1,
              textResponses: [...(poll.textResponses || []), response],
            };
          } else {
            updatedResults[response] = (updatedResults[response] || 0) + 1;
          }

          return {
            ...poll,
            totalVotes: poll.totalVotes + 1,
            results: updatedResults,
          };
        }
        return poll;
      })
    );

    setShowVoteModal(false);
    setSelectedPoll(null);

    // Show success toast
    setToastMessage("Your vote has been submitted successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreatePoll = (pollData: any) => {
    const newPoll: Poll = {
      id: "POLL" + Date.now(),
      ...pollData,
      createdBy: user?.name || "Current User",
      createdAt: new Date().toISOString(),
      totalVotes: 0,
      results: {},
    };

    setPolls((prev) => [newPoll, ...prev]);
    setShowCreateModal(false);
  };

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return "No expiry";

    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days left`;
    if (hours > 0) return `${hours} hours left`;
    return "Expires soon";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls & Feedback</h1>
          <p className="mt-1 text-gray-600">
            Participate in polls and share your feedback
          </p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          {
            label: "Active Polls",
            value: polls.filter((p) => p.status === "active").length,
            color: "bg-green-500",
            icon: Vote,
          },
          {
            label: "Total Votes",
            value: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
            color: "bg-blue-500",
            icon: Users,
          },
          {
            label: "My Votes",
            value: userVotes.length,
            color: "bg-purple-500",
            icon: CheckCircle,
          },
          {
            label: "Feedback Items",
            value: polls.filter((p) => p.category === "feedback").length,
            color: "bg-orange-500",
            icon: MessageSquare,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: "active", label: "Active Polls", icon: Vote },
              { key: "my-polls", label: "My Polls", icon: Edit },
              { key: "results", label: "Results", icon: BarChart3 },
              { key: "feedback", label: "Feedback", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Polls Grid */}
          <div className="space-y-6">
            {filteredPolls.map((poll) => (
              <div
                key={poll.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {poll.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          poll.status
                        )}`}
                      >
                        {poll.status}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          poll.category
                        )}`}
                      >
                        {poll.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{poll.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {poll.totalVotes} votes
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(poll.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getTimeRemaining(poll.expiresAt)}
                      </span>
                      <span>by {poll.createdBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {poll.status === "active" && !hasUserVoted(poll.id) && (
                      <button
                        onClick={() => {
                          setSelectedPoll(poll);
                          setShowVoteModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Vote
                      </button>
                    )}
                    {hasUserVoted(poll.id) && (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Voted
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPoll(poll);
                        // Show results modal
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View Results"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Results Preview */}
                {poll.results && Object.keys(poll.results).length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Results Preview
                    </h4>
                    {poll.type === "text" ? (
                      <div className="space-y-2">
                        {poll.textResponses
                          ?.slice(0, 3)
                          .map((response, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 italic"
                            >
                              "{response}"
                            </div>
                          ))}
                        {(poll.textResponses?.length || 0) > 3 && (
                          <div className="text-sm text-blue-600">
                            +{(poll.textResponses?.length || 0) - 3} more
                            responses
                          </div>
                        )}
                      </div>
                    ) : poll.type === "rating" ? (
                      <div className="flex items-center space-x-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div
                            key={rating}
                            className="flex items-center space-x-1"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                rating <= 3
                                  ? "text-yellow-400"
                                  : "text-yellow-500"
                              }`}
                            />
                            <span className="text-sm">
                              {poll.results?.[rating.toString()] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(poll.results)
                          .slice(0, 3)
                          .map(([option, votes]) => (
                            <div
                              key={option}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-700">
                                {option}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${calculatePercentage(
                                        votes,
                                        poll.totalVotes
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right">
                                  {calculatePercentage(votes, poll.totalVotes)}%
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPolls.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No polls found
              </h3>
              <p className="text-gray-600">
                {activeTab === "active"
                  ? "No active polls at the moment."
                  : activeTab === "my-polls"
                  ? "You haven't created any polls yet."
                  : activeTab === "results"
                  ? "No completed polls to show results."
                  : "No feedback polls available."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && selectedPoll && (
        <VoteModal
          poll={selectedPoll}
          onClose={() => {
            setShowVoteModal(false);
            setSelectedPoll(null);
          }}
          onVote={handleVote}
        />
      )}

      {/* Create Poll Modal */}
      {showCreateModal && (
        <CreatePollModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePoll}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="text-white hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

interface VoteModalProps {
  poll: Poll;
  onClose: () => void;
  onVote: (pollId: string, response: any) => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ poll, onClose, onVote }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [textResponse, setTextResponse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let response;
    if (poll.type === "multiple-choice") {
      response = poll.allowMultiple ? selectedOptions : selectedOptions[0];
    } else if (poll.type === "rating") {
      response = rating;
    } else if (poll.type === "text") {
      response = textResponse;
    } else {
      response = selectedOptions[0];
    }

    onVote(poll.id, response);
  };

  const handleOptionChange = (option: string) => {
    if (poll.allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    } else {
      setSelectedOptions([option]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Vote on Poll</h2>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {poll.title}
        </h3>
        <p className="text-gray-600 mb-6">{poll.description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {poll.type === "multiple-choice" || poll.type === "yes-no" ? (
            <div className="space-y-3">
              {poll.options?.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type={poll.allowMultiple ? "checkbox" : "radio"}
                    name="poll-option"
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          ) : poll.type === "rating" ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Rate from 1 to 5
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0
                    ? `${rating} star${rating > 1 ? "s" : ""}`
                    : "No rating"}
                </span>
              </div>
            </div>
          ) : poll.type === "text" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Share your thoughts..."
                required
              />
            </div>
          ) : null}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                ((poll.type === "multiple-choice" || poll.type === "yes-no") &&
                  selectedOptions.length === 0) ||
                (poll.type === "rating" && rating === 0) ||
                (poll.type === "text" && !textResponse.trim())
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Vote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreatePollModalProps {
  onClose: () => void;
  onSave: (poll: any) => void;
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "multiple-choice",
    options: ["", ""],
    category: "general",
    isAnonymous: true,
    allowMultiple: false,
    expiresAt: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      options:
        formData.type === "text" || formData.type === "rating"
          ? undefined
          : formData.options.filter((o) => o.trim()),
      status: "active",
    });
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Poll</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="yes-no">Yes/No</option>
                <option value="rating">Rating (1-5)</option>
                <option value="text">Text Response</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="facilities">Facilities</option>
                <option value="events">Events</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
          </div>

          {(formData.type === "multiple-choice" ||
            formData.type === "yes-no") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Option</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expires At
            </label>
            <input
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAnonymous: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Anonymous voting</span>
            </label>

            {formData.type === "multiple-choice" && (
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.allowMultiple}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      allowMultiple: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Allow multiple selections
                </span>
              </label>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollsFeedback;
