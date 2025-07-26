import React, { useState } from "react";
import {
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Pin,
  Download,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Notice } from "../../types";

const NoticeBoard: React.FC = () => {
  const { user } = useAuth();
  const { notices, addNotice, updateNotice } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Notices are now managed by DataContext

  // Add Notice handler
  const handleCreateNotice = (
    notice: Omit<Notice, "id" | "author" | "createdAt">
  ) => {
    // Use DataContext to add notice (will persist across navigation)
    addNotice({
      ...notice,
      author: user?.name || "Unknown",
    });
    setShowCreateModal(false);
    setShowSuccessMessage(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const departments = [
    "All Departments",
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
  ];
  const years = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      notice.department === selectedDepartment ||
      notice.department === "All Departments";
    const matchesYear =
      selectedYear === "all" ||
      notice.year === selectedYear ||
      notice.year === "All Years";

    return matchesSearch && matchesDepartment && matchesYear;
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCreateNotice = true; // Allow all users to create notices

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="mt-1 text-gray-600">
            Stay updated with important announcements
          </p>
        </div>
        {canCreateNotice && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Notice
          </button>
        )}
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Notice created successfully! It will be visible to all students.
              </p>
            </div>
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
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments
              .filter((dept) => dept !== "All Departments")
              .map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Years</option>
            {years
              .filter((year) => year !== "All Years")
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>

          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
              notice.isPinned ? "ring-2 ring-blue-500 ring-opacity-50" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {notice.isPinned && (
                    <Pin className="w-5 h-5 text-blue-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notice.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(
                          notice.priority
                        )}`}
                      >
                        {notice.priority.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{notice.content}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{notice.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                        {notice.department}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                        {notice.year}
                      </span>
                    </div>

                    {notice.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Attachments:
                        </h4>
                        <div className="space-y-2">
                          {notice.attachments.map((attachment, index) => (
                            <button
                              key={index}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Download className="w-4 h-4" />
                              <span>{attachment}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notices found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
      {canCreateNotice && showCreateModal && (
        <CreateNoticeModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNotice}
          departments={departments}
          years={years}
        />
      )}
    </div>
  );
};

interface CreateNoticeModalProps {
  onClose: () => void;
  onCreate: (notice: Omit<Notice, "id" | "author" | "createdAt">) => void;
  departments: string[];
  years: string[];
}

const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({
  onClose,
  onCreate,
  departments,
  years,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState(departments[1] || "");
  const [year, setYear] = useState(years[1] || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isPinned, setIsPinned] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onCreate({
      title,
      content,
      department,
      year,
      priority,
      isPinned,
      attachments,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Notice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Title *
            </label>
            <input
              type="text"
              className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a clear and descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Content *
            </label>
            <textarea
              rows={5}
              className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Write the detailed content of your notice..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments
                  .filter((d) => d !== "All Departments")
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years
                  .filter((y) => y !== "All Years")
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
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
            <div className="flex-1 flex items-center mt-6">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="mr-2"
              />
              <span>Pin Notice</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
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
              Create Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeBoard;
