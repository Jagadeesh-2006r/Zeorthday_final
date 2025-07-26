import React, { createContext, useContext, useState, useEffect } from "react";
import { Notice, Hackathon } from "../types";

interface Comment {
  text: string;
  author: string;
  createdAt: string;
}

interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  submittedAt: string;
  submittedBy: string;
  assignedTo?: string;
  resolvedAt?: string;
  feedback?: string;
  comments?: Comment[];
}

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookedBy: string;
  bookedAt: string;
  attendees?: number;
  equipment?: string[];
}

interface StudyResource {
  id: string;
  title: string;
  type: "notes" | "video" | "book" | "assignment" | "exam";
  subject: string;
  semester: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
  rating: number;
  fileUrl?: string;
  description?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "academic" | "cultural" | "sports" | "technical" | "social";
  organizer: string;
  maxAttendees?: number;
  registeredCount: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  isRegistered?: boolean;
}

interface CanteenOrder {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  orderedAt: string;
  orderedBy: string;
  estimatedTime?: string;
  specialInstructions?: string;
}

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "lost" | "found";
  location: string;
  date: string;
  contactInfo: string;
  status: "active" | "resolved" | "expired";
  reportedBy: string;
  imageUrl?: string;
}

interface BorrowRequest {
  id: string;
  toolId: string;
  toolName: string;
  requestedBy: string;
  requestedAt: string;
  purpose: string;
  expectedDuration: string;
  status: "pending" | "approved" | "rejected" | "returned";
  approvedBy?: string;
  borrowedAt?: string;
  returnedAt?: string;
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status:
    | "submitted"
    | "under-review"
    | "shortlisted"
    | "interview-scheduled"
    | "rejected"
    | "selected";
  interviewDate?: string;
}

interface DataContextType {
  // Data
  complaints: Complaint[];
  bookings: Booking[];
  studyResources: StudyResource[];
  events: Event[];
  canteenOrders: CanteenOrder[];
  lostFoundItems: LostFoundItem[];
  borrowRequests: BorrowRequest[];
  jobApplications: JobApplication[];
  notices: Notice[];
  hackathons: Hackathon[];

  // Actions
  addComplaint: (complaint: Omit<Complaint, "id" | "submittedAt">) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;

  addBooking: (booking: Omit<Booking, "id" | "bookedAt">) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;

  addStudyResource: (
    resource: Omit<StudyResource, "id" | "uploadedAt" | "downloads" | "rating">
  ) => void;
  updateStudyResource: (id: string, updates: Partial<StudyResource>) => void;

  addEvent: (event: Omit<Event, "id" | "registeredCount">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  registerForEvent: (eventId: string) => void;

  addCanteenOrder: (order: Omit<CanteenOrder, "id" | "orderedAt">) => void;
  updateCanteenOrder: (id: string, updates: Partial<CanteenOrder>) => void;

  addLostFoundItem: (item: Omit<LostFoundItem, "id">) => void;
  updateLostFoundItem: (id: string, updates: Partial<LostFoundItem>) => void;

  addBorrowRequest: (
    request: Omit<BorrowRequest, "id" | "requestedAt">
  ) => void;
  updateBorrowRequest: (id: string, updates: Partial<BorrowRequest>) => void;

  addJobApplication: (
    application: Omit<JobApplication, "id" | "appliedAt">
  ) => void;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;

  addNotice: (notice: Omit<Notice, "id" | "createdAt">) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;

  addHackathon: (hackathon: Omit<Hackathon, "id" | "registeredTeams">) => void;
  updateHackathon: (id: string, updates: Partial<Hackathon>) => void;

  // Dashboard stats
  getDashboardStats: () => {
    activeComplaints: number;
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    upcomingBookings: number;
    studyResourcesCount: number;
    eventsRegistered: number;
    pendingOrders: number;
    activeLostFound: number;
    pendingBorrowRequests: number;
    activeApplications: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize with some sample data
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "COMP001",
      title: "WiFi connectivity issues in Library",
      category: "infrastructure",
      description:
        "The WiFi connection in the main library is very slow and frequently disconnects.",
      status: "open",
      priority: "medium",
      submittedAt: "2025-01-20T10:00:00Z",
      submittedBy: "John Student",
      comments: [],
    },
    {
      id: "COMP002",
      title: "Broken AC in Classroom 101",
      category: "maintenance",
      description:
        "The air conditioning unit in Classroom 101 is not working properly.",
      status: "in-progress",
      priority: "high",
      submittedAt: "2025-01-18T14:30:00Z",
      submittedBy: "Sarah Wilson",
      assignedTo: "Maintenance Team",
      comments: [],
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BOOK001",
      roomId: "CONF001",
      roomName: "Conference Room A",
      date: "2025-01-25",
      startTime: "14:00",
      endTime: "16:00",
      purpose: "Project presentation",
      status: "confirmed",
      bookedBy: "John Student",
      bookedAt: "2025-01-22T09:00:00Z",
      attendees: 8,
    },
  ]);

  const [studyResources, setStudyResources] = useState<StudyResource[]>([
    {
      id: "RES001",
      title: "Data Structures Notes",
      type: "notes",
      subject: "Computer Science",
      semester: "Semester 3",
      uploadedBy: "Prof. Smith",
      uploadedAt: "2025-01-15T10:00:00Z",
      downloads: 156,
      rating: 4.5,
      description: "Comprehensive notes on data structures and algorithms",
    },
    // Add more sample resources to reach 45
    ...Array.from({ length: 43 }, (_, i) => ({
      id: `RES${String(i + 2).padStart(3, "0")}`,
      title: `Study Material ${i + 2}`,
      type: "notes" as const,
      subject: ["Computer Science", "Mathematics", "Physics", "Chemistry"][
        i % 4
      ],
      semester: `Semester ${(i % 8) + 1}`,
      uploadedBy: `Contributor ${i + 1}`,
      uploadedAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      downloads: Math.floor(Math.random() * 200),
      rating: 3 + Math.random() * 2,
    })),
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: "EVT001",
      title: "Tech Symposium 2025",
      description: "Annual technology symposium featuring industry experts",
      date: "2025-02-15",
      time: "09:00",
      location: "Main Auditorium",
      category: "technical",
      organizer: "Computer Science Department",
      maxAttendees: 500,
      registeredCount: 234,
      status: "upcoming",
      isRegistered: true,
    },
    {
      id: "EVT002",
      title: "Cultural Night",
      description: "Annual cultural celebration with performances and food",
      date: "2025-02-20",
      time: "18:00",
      location: "Campus Grounds",
      category: "cultural",
      organizer: "Student Council",
      maxAttendees: 1000,
      registeredCount: 567,
      status: "upcoming",
      isRegistered: true,
    },
    {
      id: "EVT003",
      title: "Sports Day",
      description: "Inter-department sports competition",
      date: "2025-02-25",
      time: "08:00",
      location: "Sports Complex",
      category: "sports",
      organizer: "Sports Committee",
      maxAttendees: 800,
      registeredCount: 345,
      status: "upcoming",
      isRegistered: true,
    },
  ]);

  const [canteenOrders, setCanteenOrders] = useState<CanteenOrder[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  // Initialize notices with sample data
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "NOT001",
      title: "Mid-Semester Examination Schedule",
      content:
        "The mid-semester examinations will commence from February 15, 2025. Students are advised to check their exam schedules on the student portal.",
      department: "Computer Science",
      year: "All Years",
      author: "Dr. Sarah Johnson",
      createdAt: "2025-01-20T10:00:00Z",
      priority: "high",
      attachments: ["exam_schedule.pdf"],
      isPinned: true,
    },
    {
      id: "NOT002",
      title: "Lab Equipment Maintenance Notice",
      content:
        "The computer lab will be closed for maintenance on January 25, 2025. Alternative arrangements have been made in Lab 2.",
      department: "Computer Science",
      year: "2nd Year",
      author: "Lab Coordinator",
      createdAt: "2025-01-19T14:30:00Z",
      priority: "medium",
      attachments: [],
      isPinned: false,
    },
    {
      id: "NOT003",
      title: "Career Guidance Workshop",
      content:
        "Join us for an interactive career guidance workshop featuring industry experts. Registration is mandatory.",
      department: "All Departments",
      year: "All Years",
      author: "Placement Cell",
      createdAt: "2025-01-18T09:15:00Z",
      priority: "medium",
      attachments: ["workshop_details.pdf"],
      isPinned: false,
    },
  ]);

  // Initialize hackathons with sample data
  const [hackathons, setHackathons] = useState<Hackathon[]>([
    {
      id: "HACK001",
      title: "AI Innovation Challenge 2025",
      description:
        "Build innovative AI solutions to solve real-world problems. Focus on machine learning, natural language processing, and computer vision.",
      theme: "Artificial Intelligence & Machine Learning",
      startDate: "2025-02-15T09:00:00Z",
      endDate: "2025-02-17T18:00:00Z",
      registrationDeadline: "2025-02-10T23:59:59Z",
      maxTeamSize: 4,
      minTeamSize: 2,
      prizes: {
        first: "$5,000",
        second: "$3,000",
        third: "$1,500",
      },
      rules: [
        "Teams must consist of 2-4 members",
        "All code must be original",
        "Use of external APIs is allowed",
        "Final submission must include source code and demo",
      ],
      requirements: [
        "Basic programming knowledge",
        "Familiarity with AI/ML concepts",
        "Laptop with development environment",
      ],
      organizer: "Computer Science Department",
      status: "registration-open",
      registeredTeams: 15,
      maxTeams: 50,
      venue: "Tech Hub, Main Campus",
      contactEmail: "hackathon@university.edu",
      technologies: ["Python", "TensorFlow", "PyTorch", "JavaScript", "React"],
      difficulty: "intermediate",
      isRegistered: false,
    },
    {
      id: "HACK002",
      title: "Web Development Sprint",
      description:
        "Create amazing web applications using modern frameworks and technologies. Perfect for beginners and intermediate developers.",
      theme: "Full-Stack Web Development",
      startDate: "2025-03-01T10:00:00Z",
      endDate: "2025-03-02T20:00:00Z",
      registrationDeadline: "2025-02-25T23:59:59Z",
      maxTeamSize: 3,
      minTeamSize: 1,
      prizes: {
        first: "$2,000",
        second: "$1,200",
        third: "$800",
      },
      rules: [
        "Individual or team participation allowed",
        "Must use at least one modern web framework",
        "Responsive design required",
        "Deploy your application online",
      ],
      requirements: [
        "HTML, CSS, JavaScript knowledge",
        "Experience with at least one web framework",
        "Git version control basics",
      ],
      organizer: "Web Development Club",
      status: "upcoming",
      registeredTeams: 8,
      maxTeams: 30,
      venue: "Innovation Lab, Building A",
      contactEmail: "webdev@university.edu",
      technologies: ["React", "Vue.js", "Node.js", "MongoDB", "Firebase"],
      difficulty: "beginner",
      isRegistered: true,
    },
  ]);

  // Helper function to generate unique IDs
  const generateId = (prefix: string) => {
    return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  // Complaint actions
  const addComplaint = (complaint: Omit<Complaint, "id" | "submittedAt">) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: generateId("COMP"),
      submittedAt: new Date().toISOString(),
      comments: complaint.comments || [],
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, ...updates } : complaint
      )
    );
  };

  // Booking actions
  const addBooking = (booking: Omit<Booking, "id" | "bookedAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: generateId("BOOK"),
      bookedAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, ...updates } : booking
      )
    );
  };

  // Study Resource actions
  const addStudyResource = (
    resource: Omit<StudyResource, "id" | "uploadedAt" | "downloads" | "rating">
  ) => {
    const newResource: StudyResource = {
      ...resource,
      id: generateId("RES"),
      uploadedAt: new Date().toISOString(),
      downloads: 0,
      rating: 0,
    };
    setStudyResources((prev) => [newResource, ...prev]);
  };

  const updateStudyResource = (id: string, updates: Partial<StudyResource>) => {
    setStudyResources((prev) =>
      prev.map((resource) =>
        resource.id === id ? { ...resource, ...updates } : resource
      )
    );
  };

  // Event actions
  const addEvent = (event: Omit<Event, "id" | "registeredCount">) => {
    const newEvent: Event = {
      ...event,
      id: generateId("EVT"),
      registeredCount: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const registerForEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              registeredCount: event.registeredCount + 1,
              isRegistered: true,
            }
          : event
      )
    );
  };

  // Canteen Order actions
  const addCanteenOrder = (order: Omit<CanteenOrder, "id" | "orderedAt">) => {
    const newOrder: CanteenOrder = {
      ...order,
      id: generateId("ORD"),
      orderedAt: new Date().toISOString(),
    };
    setCanteenOrders((prev) => [newOrder, ...prev]);
  };

  const updateCanteenOrder = (id: string, updates: Partial<CanteenOrder>) => {
    setCanteenOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...updates } : order))
    );
  };

  // Lost & Found actions
  const addLostFoundItem = (item: Omit<LostFoundItem, "id">) => {
    const newItem: LostFoundItem = {
      ...item,
      id: generateId("LF"),
    };
    setLostFoundItems((prev) => [newItem, ...prev]);
  };

  const updateLostFoundItem = (id: string, updates: Partial<LostFoundItem>) => {
    setLostFoundItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Borrow Request actions
  const addBorrowRequest = (
    request: Omit<BorrowRequest, "id" | "requestedAt">
  ) => {
    const newRequest: BorrowRequest = {
      ...request,
      id: generateId("BR"),
      requestedAt: new Date().toISOString(),
    };
    setBorrowRequests((prev) => [newRequest, ...prev]);
  };

  const updateBorrowRequest = (id: string, updates: Partial<BorrowRequest>) => {
    setBorrowRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  // Job Application actions
  const addJobApplication = (
    application: Omit<JobApplication, "id" | "appliedAt">
  ) => {
    const newApplication: JobApplication = {
      ...application,
      id: generateId("APP"),
      appliedAt: new Date().toISOString(),
    };
    setJobApplications((prev) => [newApplication, ...prev]);
  };

  const updateJobApplication = (
    id: string,
    updates: Partial<JobApplication>
  ) => {
    setJobApplications((prev) =>
      prev.map((application) =>
        application.id === id ? { ...application, ...updates } : application
      )
    );
  };

  // Notice actions
  const addNotice = (notice: Omit<Notice, "id" | "createdAt">) => {
    const newNotice: Notice = {
      ...notice,
      id: generateId("NOT"),
      createdAt: new Date().toISOString(),
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const updateNotice = (id: string, updates: Partial<Notice>) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id ? { ...notice, ...updates } : notice
      )
    );
  };

  // Hackathon actions
  const addHackathon = (
    hackathon: Omit<Hackathon, "id" | "registeredTeams">
  ) => {
    const newHackathon: Hackathon = {
      ...hackathon,
      id: generateId("HACK"),
      registeredTeams: 0,
    };
    setHackathons((prev) => [newHackathon, ...prev]);
  };

  const updateHackathon = (id: string, updates: Partial<Hackathon>) => {
    setHackathons((prev) =>
      prev.map((hackathon) =>
        hackathon.id === id ? { ...hackathon, ...updates } : hackathon
      )
    );
  };

  // Dashboard stats calculation
  const getDashboardStats = () => {
    return {
      activeComplaints: complaints.filter(
        (c) => c.status === "open" || c.status === "in-progress"
      ).length,
      totalComplaints: complaints.length,
      pendingComplaints: complaints.filter(
        (c) => c.status === "open" || c.status === "pending"
      ).length,
      resolvedComplaints: complaints.filter((c) => c.status === "resolved")
        .length,
      upcomingBookings: bookings.filter((b) => {
        const bookingDate = new Date(b.date);
        const today = new Date();
        return (
          bookingDate >= today &&
          (b.status === "confirmed" || b.status === "pending")
        );
      }).length,
      studyResourcesCount: studyResources.length,
      eventsRegistered: events.filter((e) => e.isRegistered).length,
      pendingOrders: canteenOrders.filter(
        (o) => o.status === "pending" || o.status === "preparing"
      ).length,
      activeLostFound: lostFoundItems.filter((i) => i.status === "active")
        .length,
      pendingBorrowRequests: borrowRequests.filter(
        (r) => r.status === "pending"
      ).length,
      activeApplications: jobApplications.filter(
        (a) =>
          a.status === "submitted" ||
          a.status === "under-review" ||
          a.status === "shortlisted"
      ).length,
    };
  };

  const value: DataContextType = {
    // Data
    complaints,
    bookings,
    studyResources,
    events,
    canteenOrders,
    lostFoundItems,
    borrowRequests,
    jobApplications,
    notices,
    hackathons,

    // Actions
    addComplaint,
    updateComplaint,
    addBooking,
    updateBooking,
    addStudyResource,
    updateStudyResource,
    addEvent,
    updateEvent,
    registerForEvent,
    addCanteenOrder,
    updateCanteenOrder,
    addLostFoundItem,
    updateLostFoundItem,
    addBorrowRequest,
    updateBorrowRequest,
    addJobApplication,
    updateJobApplication,
    addNotice,
    updateNotice,
    addHackathon,
    updateHackathon,

    // Dashboard stats
    getDashboardStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
