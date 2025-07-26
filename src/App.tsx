import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SearchProvider } from "./context/SearchContext";
import AuthWrapper from "./components/Auth/AuthWrapper";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import NoticeBoard from "./components/Modules/NoticeBoard";
import ComplaintSystem from "./components/Modules/ComplaintSystem";
import LostAndFound from "./components/Modules/LostAndFound";
import StudyResourceHub from "./components/Modules/StudyResourceHub";
import CanteenOrdering from "./components/Modules/CanteenOrdering";
import RoomBooking from "./components/Modules/RoomBooking";
import Events from "./components/Modules/Events";
import BusTracker from "./components/Modules/BusTracker";
import HostelServices from "./components/Modules/HostelServices";
import LabTools from "./components/Modules/LabTools";
import Placements from "./components/Modules/Placements";
import Timetable from "./components/Modules/Timetable";
import Skills from "./components/Modules/Skills";
import Hackathon from "./components/Modules/Hackathon";
import PollsFeedback from "./components/Modules/PollsFeedback";

import { MessageCircle } from "lucide-react";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentModule, setCurrentModule] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderModule = () => {
    switch (currentModule) {
      case "dashboard":
        return <StudentDashboard onNavigate={setCurrentModule} />;
      case "notices":
        return <NoticeBoard />;
      case "complaints":
        return <ComplaintSystem />;
      case "lost-found":
        return <LostAndFound />;
      case "study-resources":
        return <StudyResourceHub />;
      case "timetable":
        return <Timetable />;
      case "skills":
        return <Skills />;
      case "hackathon":
        return <Hackathon />;
      case "polls":
        return <PollsFeedback />;
      case "canteen":
        return <CanteenOrdering />;
      case "room-booking":
        return <RoomBooking />;
      case "bus-tracker":
        return <BusTracker />;
      case "events":
        return <Events />;
      case "hostel":
        return <HostelServices />;
      case "lab-tools":
        return <LabTools />;
      case "placements":
        return <Placements />;
      case "admin-dashboard":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Admin Analytics
            </h3>
            <p className="text-gray-600">View analytics and system insights.</p>
          </div>
        );

      default:
        return <StudentDashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  return (
    <SearchProvider onNavigate={setCurrentModule}>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <Sidebar
            currentModule={currentModule}
            onModuleChange={(module) => {
              setCurrentModule(module);
              setSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMobileMenuToggle={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            <div className="p-6">{renderModule()}</div>
          </main>
        </div>

        {/* AI Assistant Button */}
        <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </SearchProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
