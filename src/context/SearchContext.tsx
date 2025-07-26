import React, { createContext, useContext, useState, useEffect } from "react";
import { useData } from "./DataContext";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type:
    | "complaint"
    | "booking"
    | "resource"
    | "event"
    | "skill"
    | "notice"
    | "user"
    | "module"
    | "poll";
  module: string;
  url: string;
  metadata?: any;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  clearSearch: () => void;
  navigateToResult: (result: SearchResult) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider: React.FC<{
  children: React.ReactNode;
  onNavigate: (module: string) => void;
}> = ({ children, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const {
    complaints,
    bookings,
    studyResources,
    events,
    canteenOrders,
    lostFoundItems,
    borrowRequests,
    jobApplications,
  } = useData();

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, complaints, bookings, studyResources, events]);

  const performSearch = (query: string) => {
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search in complaints
    complaints.forEach((complaint) => {
      if (
        complaint.title.toLowerCase().includes(searchTerm) ||
        complaint.description.toLowerCase().includes(searchTerm) ||
        complaint.category.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: complaint.id,
          title: complaint.title,
          description: complaint.description,
          type: "complaint",
          module: "complaints",
          url: "/complaints",
          metadata: { status: complaint.status, priority: complaint.priority },
        });
      }
    });

    // Search in bookings
    bookings.forEach((booking) => {
      if (
        booking.roomName.toLowerCase().includes(searchTerm) ||
        booking.purpose.toLowerCase().includes(searchTerm) ||
        booking.bookedBy.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: booking.id,
          title: `${booking.roomName} - ${booking.purpose}`,
          description: `Booked by ${booking.bookedBy} on ${booking.date}`,
          type: "booking",
          module: "room-booking",
          url: "/room-booking",
          metadata: { status: booking.status, date: booking.date },
        });
      }
    });

    // Search in study resources
    studyResources.forEach((resource) => {
      if (
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.subject.toLowerCase().includes(searchTerm) ||
        resource.semester.toLowerCase().includes(searchTerm) ||
        resource.description?.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: resource.id,
          title: resource.title,
          description: `${resource.subject} - ${resource.semester}`,
          type: "resource",
          module: "study-resources",
          url: "/study-resources",
          metadata: { type: resource.type, downloads: resource.downloads },
        });
      }
    });

    // Search in events
    events.forEach((event) => {
      if (
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.organizer.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: event.id,
          title: event.title,
          description: `${event.location} - ${event.organizer}`,
          type: "event",
          module: "events",
          url: "/events",
          metadata: { date: event.date, category: event.category },
        });
      }
    });

    // Search in lost & found items
    lostFoundItems.forEach((item) => {
      if (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          description: `${item.type} - ${item.location}`,
          type: "notice",
          module: "lost-found",
          url: "/lost-found",
          metadata: { type: item.type, status: item.status },
        });
      }
    });

    // Search in modules/features
    const modules = [
      {
        id: "dashboard",
        title: "Dashboard",
        description: "Overview of campus activities and statistics",
      },
      {
        id: "notices",
        title: "Notice Board",
        description: "Campus announcements and notifications",
      },
      {
        id: "complaints",
        title: "Complaints",
        description: "Submit and track campus complaints",
      },
      {
        id: "lost-found",
        title: "Lost & Found",
        description: "Report lost items or find lost belongings",
      },
      {
        id: "study-resources",
        title: "Study Resources",
        description: "Access study materials and notes",
      },
      {
        id: "timetable",
        title: "Timetable",
        description: "View and manage class schedules",
      },
      {
        id: "skills",
        title: "Skills",
        description: "Track and develop professional skills",
      },
      {
        id: "polls",
        title: "Polls & Feedback",
        description: "Participate in polls and share feedback",
      },
      {
        id: "room-booking",
        title: "Room Booking",
        description: "Book seminar halls and labs",
      },
      {
        id: "canteen",
        title: "Canteen",
        description: "Order food from campus canteen",
      },
      {
        id: "bus-tracker",
        title: "Bus Tracker",
        description: "Track campus bus locations",
      },
      {
        id: "events",
        title: "Events",
        description: "Campus events and registrations",
      },
      {
        id: "hostel",
        title: "Hostel Services",
        description: "Hostel-related services and requests",
      },
      {
        id: "lab-tools",
        title: "Lab Tools",
        description: "Borrow and return lab equipment",
      },
      {
        id: "placements",
        title: "Placements",
        description: "Job opportunities and applications",
      },
    ];

    modules.forEach((module) => {
      if (
        module.title.toLowerCase().includes(searchTerm) ||
        module.description.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: module.id,
          title: module.title,
          description: module.description,
          type: "module",
          module: module.id,
          url: `/${module.id}`,
          metadata: { type: "navigation" },
        });
      }
    });

    // Quick actions/shortcuts
    const quickActions = [
      {
        id: "add-complaint",
        title: "Submit Complaint",
        description: "Report a new campus issue",
        module: "complaints",
      },
      {
        id: "book-room",
        title: "Book Room",
        description: "Reserve a seminar hall or lab",
        module: "room-booking",
      },
      {
        id: "add-skill",
        title: "Add Skill",
        description: "Add a new skill to your portfolio",
        module: "skills",
      },
      {
        id: "view-timetable",
        title: "View Timetable",
        description: "Check your class schedule",
        module: "timetable",
      },
      {
        id: "order-food",
        title: "Order Food",
        description: "Place a canteen order",
        module: "canteen",
      },
      {
        id: "track-bus",
        title: "Track Bus",
        description: "Find campus bus locations",
        module: "bus-tracker",
      },
    ];

    quickActions.forEach((action) => {
      if (
        action.title.toLowerCase().includes(searchTerm) ||
        action.description.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: action.id,
          title: action.title,
          description: action.description,
          type: "module",
          module: action.module,
          url: `/${action.module}`,
          metadata: { type: "quick-action" },
        });
      }
    });

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === searchTerm;
      const bExact = b.title.toLowerCase() === searchTerm;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = a.title.toLowerCase().startsWith(searchTerm);
      const bStarts = b.title.toLowerCase().startsWith(searchTerm);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return a.title.localeCompare(b.title);
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const navigateToResult = (result: SearchResult) => {
    onNavigate(result.module);
    clearSearch();
  };

  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    clearSearch,
    navigateToResult,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export default SearchContext;
