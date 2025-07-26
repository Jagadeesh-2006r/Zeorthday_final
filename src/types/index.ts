export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "staff" | "admin" | "transport";
  department?: string;
  year?: string;
  rollNumber?: string;
  employeeId?: string;
  avatar?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  department: string;
  year?: string;
  author: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
  attachments?: string[];
  isPinned?: boolean;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: "hostel" | "classroom" | "campus" | "other";
  status: "pending" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  submittedBy: string;
  submittedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  images?: string[];
}

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  type: "lost" | "found";
  category: string;
  location: string;
  date: string;
  contactPerson: string;
  contactDetails: string;
  images?: string[];
  status: "active" | "resolved";
}

export interface StudyResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  department: string;
  year: string;
  type: "notes" | "question-paper" | "ebook" | "assignment";
  uploadedBy: string;
  uploadedAt: string;
  fileUrl: string;
  downloads: number;
  rating: number;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  bookedBy: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected" | "completed";
  approvedBy?: string;
  requiredEquipment?: string[];
  attendees: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "breakfast" | "lunch" | "dinner" | "snacks" | "beverages";
  description: string;
  image?: string;
  available: boolean;
  rating: number;
}

export interface Order {
  id: string;
  userId: string;
  items: { menuItem: MenuItem; quantity: number }[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  orderTime: string;
  deliveryTime?: string;
  paymentStatus: "pending" | "paid" | "refunded";
}

export interface BusRoute {
  id: string;
  routeName: string;
  stops: string[];
  schedule: { stop: string; time: string }[];
  driverId: string;
  busNumber: string;
  capacity: number;
  currentLocation?: { lat: number; lng: number };
  delay: number; // in minutes
  status: "active" | "delayed" | "cancelled";
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  category:
    | "technical"
    | "cultural"
    | "sports"
    | "workshop"
    | "seminar"
    | "club";
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  registrationDeadline: string;
  image?: string;
  requirements?: string[];
  certificateTemplate?: string;
}

export interface HostelService {
  id: string;
  type: "room-change" | "mess-registration" | "maintenance" | "visitor-pass";
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "completed";
  priority: "low" | "medium" | "high";
  approvedBy?: string;
  completedAt?: string;
}

export interface LabTool {
  id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  available: number;
  location: string;
  condition: "excellent" | "good" | "fair" | "needs-repair";
  lastMaintenance: string;
}

export interface ToolLending {
  id: string;
  toolId: string;
  borrowedBy: string;
  borrowedAt: string;
  returnBy: string;
  returnedAt?: string;
  status: "borrowed" | "returned" | "overdue" | "damaged";
  purpose: string;
  approvedBy: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: "internship" | "full-time" | "part-time";
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  postedAt: string;
  eligibleDepartments: string[];
  eligibleYears: string[];
  contactPerson: string;
  applicationLink?: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  appliedAt: string;
  status:
    | "applied"
    | "shortlisted"
    | "interview-scheduled"
    | "selected"
    | "rejected";
  resume: string;
  coverLetter?: string;
  interviewDate?: string;
  feedback?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  rules: string[];
  requirements: string[];
  organizer: string;
  status:
    | "upcoming"
    | "registration-open"
    | "ongoing"
    | "completed"
    | "cancelled";
  registeredTeams: number;
  maxTeams?: number;
  venue: string;
  contactEmail: string;
  technologies?: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "all-levels";
  isRegistered?: boolean;
  teamId?: string;
}
