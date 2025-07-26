import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Bell,
  MessageSquare,
  Search,
  BookOpen,
  Calendar,
  Utensils,
  Bus,
  Calendar as EventIcon,
  Home,
  Wrench,
  Briefcase,
  BarChart3,
  Settings,
  HelpCircle,
  Users,
  ClipboardList,
  MapPin,
  Clock,
  Award,
  Code,
} from "lucide-react";

interface SidebarProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentModule, onModuleChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "notices", label: "Notice Board", icon: Bell },
      { id: "complaints", label: "Complaints", icon: MessageSquare },
      { id: "lost-found", label: "Lost & Found", icon: Search },
    ];

    const studentItems = [
      ...commonItems,
      { id: "study-resources", label: "Study Resources", icon: BookOpen },
      { id: "timetable", label: "Timetable", icon: Clock },
      { id: "skills", label: "Skills", icon: Award },
      { id: "hackathon", label: "Hackathon", icon: Code },
      { id: "polls", label: "Polls & Feedback", icon: BarChart3 },
      { id: "room-booking", label: "Room Booking", icon: Calendar },
      { id: "canteen", label: "Canteen", icon: Utensils },
      { id: "bus-tracker", label: "Bus Tracker", icon: Bus },
      { id: "events", label: "Events", icon: EventIcon },
      { id: "hostel", label: "Hostel Services", icon: Home },
      { id: "lab-tools", label: "Lab Tools", icon: Wrench },
      { id: "placements", label: "Placements", icon: Briefcase },
    ];

    const facultyItems = [
      ...commonItems,
      { id: "study-resources", label: "Study Resources", icon: BookOpen },
      { id: "hackathon", label: "Hackathon", icon: Code },
      { id: "room-booking", label: "Room Booking", icon: Calendar },
      { id: "canteen", label: "Canteen", icon: Utensils },
      { id: "events", label: "Events", icon: EventIcon },
      { id: "lab-tools", label: "Lab Tools", icon: Wrench },
      { id: "placements", label: "Placements", icon: Briefcase },
    ];

    const adminItems = [
      ...commonItems,
      { id: "study-resources", label: "Study Resources", icon: BookOpen },
      { id: "hackathon", label: "Hackathon", icon: Code },
      { id: "room-booking", label: "Room Booking", icon: Calendar },
      { id: "canteen", label: "Canteen", icon: Utensils },
      { id: "bus-tracker", label: "Bus Tracker", icon: Bus },
      { id: "events", label: "Events", icon: EventIcon },
      { id: "hostel", label: "Hostel Services", icon: Home },
      { id: "lab-tools", label: "Lab Tools", icon: Wrench },
      { id: "placements", label: "Placements", icon: Briefcase },
      { id: "admin-dashboard", label: "Analytics", icon: BarChart3 },
      { id: "user-management", label: "Users", icon: Users },
    ];

    const staffItems = [
      ...commonItems,
      { id: "room-booking", label: "Room Booking", icon: Calendar },
      { id: "canteen", label: "Canteen", icon: Utensils },
      { id: "events", label: "Events", icon: EventIcon },
      { id: "hostel", label: "Hostel Services", icon: Home },
      { id: "lab-tools", label: "Lab Tools", icon: Wrench },
    ];

    const transportItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "bus-tracker", label: "Bus Management", icon: Bus },
      { id: "routes", label: "Routes", icon: MapPin },
      { id: "complaints", label: "Complaints", icon: MessageSquare },
    ];

    switch (user?.role) {
      case "student":
        return studentItems;
      case "faculty":
        return facultyItems;
      case "admin":
        return adminItems;
      case "staff":
        return staffItems;
      case "transport":
        return transportItems;
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Campus Portal</h1>
        <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                currentModule === item.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Help</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
