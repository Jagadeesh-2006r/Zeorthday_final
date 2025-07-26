import React, { useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  Trophy,
  Code,
  MapPin,
  Mail,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const Hackathon: React.FC = () => {
  const { user } = useAuth();
  const { hackathons, addHackathon, updateHackathon } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Filter hackathons
  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch =
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.theme.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || hackathon.status === selectedStatus;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      hackathon.difficulty === selectedDifficulty;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  // Sort hackathons: ongoing first, then by start date
  const sortedHackathons = filteredHackathons.sort((a, b) => {
    if (a.status === "ongoing" && b.status !== "ongoing") return -1;
    if (b.status === "ongoing" && a.status !== "ongoing") return 1;
    if (a.status === "registration-open" && b.status !== "registration-open")
      return -1;
    if (b.status === "registration-open" && a.status !== "registration-open")
      return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "registration-open":
        return "bg-green-100 text-green-800 border-green-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      case "all-levels":
        return "bg-blue-100 text-blue-800";
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

  const canCreateHackathon =
    user?.role === "admin" ||
    user?.role === "faculty" ||
    user?.role === "student";

  const handleCreateHackathon = (hackathonData: any) => {
    addHackathon({
      ...hackathonData,
      organizer: user?.name || "Unknown",
    });
    setShowCreateModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleRegister = (hackathonId: string) => {
    updateHackathon(hackathonId, {
      isRegistered: true,
      registeredTeams:
        hackathons.find((h) => h.id === hackathonId)?.registeredTeams + 1 || 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hackathons</h1>
          <p className="mt-1 text-gray-600">
            Participate in coding competitions and showcase your skills
          </p>
        </div>
        {canCreateHackathon && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Hackathon
          </button>
        )}
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
            <p className="text-sm font-medium text-green-800">
              Hackathon created successfully!
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search hackathons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="registration-open">Registration Open</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all-levels">All Levels</option>
          </select>

          <div className="flex items-end">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          {
            label: "Total Hackathons",
            value: hackathons.length,
            color: "bg-blue-500",
          },
          {
            label: "Registration Open",
            value: hackathons.filter((h) => h.status === "registration-open")
              .length,
            color: "bg-green-500",
          },
          {
            label: "Ongoing",
            value: hackathons.filter((h) => h.status === "ongoing").length,
            color: "bg-yellow-500",
          },
          {
            label: "My Registrations",
            value: hackathons.filter((h) => h.isRegistered).length,
            color: "bg-purple-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <Code className="w-6 h-6 text-white" />
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

      {/* Hackathons List */}
      <div className="space-y-4">
        {sortedHackathons.map((hackathon) => (
          <div
            key={hackathon.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {hackathon.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                        hackathon.status
                      )}`}
                    >
                      {hackathon.status.replace("-", " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-md ${getDifficultyColor(
                        hackathon.difficulty
                      )}`}
                    >
                      {hackathon.difficulty.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{hackathon.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(hackathon.startDate)} -{" "}
                        {formatDate(hackathon.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{hackathon.venue}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{hackathon.registeredTeams} teams registered</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedHackathon(hackathon);
                      setShowDetailsModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                  {hackathon.status === "registration-open" &&
                    !hackathon.isRegistered && (
                      <button
                        onClick={() => handleRegister(hackathon.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Register
                      </button>
                    )}
                  {hackathon.isRegistered && (
                    <span className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md">
                      Registered
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHackathons.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hackathons found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* Create Hackathon Modal */}
      {canCreateHackathon && showCreateModal && (
        <CreateHackathonModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateHackathon}
        />
      )}

      {/* Hackathon Details Modal */}
      {showDetailsModal && selectedHackathon && (
        <HackathonDetailsModal
          hackathon={selectedHackathon}
          onClose={() => setShowDetailsModal(false)}
          onRegister={() => handleRegister(selectedHackathon.id)}
        />
      )}
    </div>
  );
};

interface CreateHackathonModalProps {
  onClose: () => void;
  onCreate: (hackathon: any) => void;
}

const CreateHackathonModal: React.FC<CreateHackathonModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [venue, setVenue] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced" | "all-levels"
  >("intermediate");
  const [maxTeams, setMaxTeams] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !startDate || !endDate) return;

    onCreate({
      title,
      description,
      theme,
      startDate,
      endDate,
      registrationDeadline,
      maxTeamSize,
      minTeamSize,
      prizes: {
        first: "$5,000",
        second: "$3,000",
        third: "$1,500",
      },
      rules: [
        `Teams must consist of ${minTeamSize}-${maxTeamSize} members`,
        "All code must be original",
        "Use of external APIs is allowed",
        "Final submission must include source code and demo",
      ],
      requirements: [
        "Basic programming knowledge",
        "Laptop with development environment",
        "Team collaboration skills",
      ],
      status: "upcoming",
      maxTeams,
      venue,
      contactEmail,
      technologies: [],
      difficulty,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create New Hackathon
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hackathon Title *
              </label>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter hackathon title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., AI & Machine Learning"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Describe the hackathon objectives and goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline
              </label>
              <input
                type="datetime-local"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Team Size
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={minTeamSize}
                onChange={(e) => setMinTeamSize(parseInt(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Team Size
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={maxTeamSize}
                onChange={(e) => setMaxTeamSize(parseInt(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Teams
              </label>
              <input
                type="number"
                min="1"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={maxTeams}
                onChange={(e) => setMaxTeams(parseInt(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Tech Hub, Main Campus"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="hackathon@university.edu"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Create Hackathon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface HackathonDetailsModalProps {
  hackathon: any;
  onClose: () => void;
  onRegister: () => void;
}

const HackathonDetailsModal: React.FC<HackathonDetailsModalProps> = ({
  hackathon,
  onClose,
  onRegister,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {hackathon.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {hackathon.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Rules
              </h3>
              <ul className="space-y-2">
                {hackathon.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Requirements
              </h3>
              <ul className="space-y-2">
                {hackathon.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {hackathon.technologies && hackathon.technologies.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Suggested Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hackathon.technologies.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Event Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">
                      {formatDate(hackathon.startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">
                      {formatDate(hackathon.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Venue</p>
                    <p className="font-medium">{hackathon.venue}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Team Size</p>
                    <p className="font-medium">
                      {hackathon.minTeamSize} - {hackathon.maxTeamSize} members
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium">{hackathon.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                Prizes
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">🥇 First Place:</span>
                  <span className="font-bold text-yellow-600">
                    {hackathon.prizes.first}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🥈 Second Place:</span>
                  <span className="font-bold text-gray-600">
                    {hackathon.prizes.second}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🥉 Third Place:</span>
                  <span className="font-bold text-orange-600">
                    {hackathon.prizes.third}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              {hackathon.status === "registration-open" &&
                !hackathon.isRegistered && (
                  <button
                    onClick={onRegister}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Register for Hackathon
                  </button>
                )}
              {hackathon.isRegistered && (
                <div className="w-full px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium">
                  ✓ You are registered
                </div>
              )}
              {hackathon.status !== "registration-open" && (
                <div className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium">
                  Registration{" "}
                  {hackathon.status === "upcoming" ? "not yet open" : "closed"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hackathon;
