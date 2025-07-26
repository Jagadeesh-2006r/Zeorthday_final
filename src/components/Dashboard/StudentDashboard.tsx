import React from "react";
import {
  Bell,
  MessageSquare,
  Calendar,
  BookOpen,
  Utensils,
  Bus,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

interface StudentDashboardProps {
  onNavigate: (module: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { getDashboardStats, complaints } = useData();
  const dashboardStats = getDashboardStats();

  // Get recent complaints for activity feed
  const recentComplaints = complaints
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 2);

  const stats = [
    {
      name: "Total Complaints",
      value: dashboardStats.totalComplaints.toString(),
      icon: MessageSquare,
      color: "bg-gray-500",
      module: "complaints",
    },
    {
      name: "Active Complaints",
      value: dashboardStats.activeComplaints.toString(),
      icon: MessageSquare,
      color: "bg-red-500",
      module: "complaints",
    },
    {
      name: "Pending Complaints",
      value: dashboardStats.pendingComplaints.toString(),
      icon: Clock,
      color: "bg-yellow-500",
      module: "complaints",
    },
    {
      name: "Resolved Complaints",
      value: dashboardStats.resolvedComplaints.toString(),
      icon: TrendingUp,
      color: "bg-green-500",
      module: "complaints",
    },
  ];

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const recentActivity = [
    {
      type: "notice",
      title: "Mid-semester exam schedule released",
      time: "2 hours ago",
      module: "notices",
    },
    ...recentComplaints.map((complaint) => ({
      type: "complaint",
      title: complaint.title,
      time: formatTimeAgo(complaint.submittedAt),
      module: "complaints",
    })),
    {
      type: "booking",
      title: "Seminar hall booked for project presentation",
      time: "2 days ago",
      module: "room-booking",
    },
    {
      type: "event",
      title: "Tech fest registration confirmed",
      time: "3 days ago",
      module: "events",
    },
  ].slice(0, 4); // Limit to 4 items

  const quickActions = [
    {
      name: "View Notices",
      icon: Bell,
      color: "bg-blue-500",
      module: "notices",
    },
    {
      name: "Order Food",
      icon: Utensils,
      color: "bg-orange-500",
      module: "canteen",
    },
    {
      name: "Track Bus",
      icon: Bus,
      color: "bg-green-500",
      module: "bus-tracker",
    },
    {
      name: "Book Room",
      icon: Calendar,
      color: "bg-purple-500",
      module: "room-booking",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening on campus today
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Clock className="w-4 h-4 mr-1" />
            Spring Semester 2025
          </span>
        </div>
      </div>

      {/* Complaint Statistics */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Complaint Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.name}
                onClick={() => onNavigate(stat.module)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left w-full cursor-pointer"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Statistics */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Campus Activities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate("room-booking")}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left w-full cursor-pointer"
          >
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.upcomingBookings}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate("study-resources")}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left w-full cursor-pointer"
          >
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Study Resources
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.studyResourcesCount}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate("events")}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left w-full cursor-pointer"
          >
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Events Registered
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.eventsRegistered}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(activity.module)}
                  className="flex items-start space-x-3 w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onNavigate(action.module)}
                  >
                    <div className={`${action.color} rounded-lg p-3 mb-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">
                      {action.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Schedule
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Database Systems
                  </p>
                  <p className="text-xs text-gray-500">
                    10:00 AM - 11:30 AM • Room 201
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Data Structures Lab
                  </p>
                  <p className="text-xs text-gray-500">
                    2:00 PM - 4:00 PM • Lab 3
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Project Review
                  </p>
                  <p className="text-xs text-gray-500">
                    4:30 PM - 5:30 PM • Seminar Hall
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Events
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">25</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Tech Symposium 2025
                  </p>
                  <p className="text-xs text-gray-500">
                    January 25 • Main Auditorium
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">28</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Career Fair
                  </p>
                  <p className="text-xs text-gray-500">
                    January 28 • Student Center
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Change Password
        </h3>
        <PasswordChangeForm />
      </div>
    </div>
  );
};

export default StudentDashboard;

const PasswordChangeForm: React.FC = () => {
  const { changePassword } = useAuth();
  const [newPassword, setNewPassword] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      setSuccess("");
      return;
    }
    changePassword(newPassword);
    setSuccess("Password changed successfully!");
    setError("");
    setNewPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter new password"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Change Password
      </button>
    </form>
  );
};
