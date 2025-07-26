import React, { useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  MapPin,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

interface RoomBooking {
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

const RoomBooking: React.FC = () => {
  const { user } = useAuth();
  const { bookings, addBooking, updateBooking } = useData();
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("all");

  const rooms = [
    {
      id: "SH101",
      name: "Seminar Hall 1",
      capacity: 50,
      equipment: ["Projector", "Microphone", "Whiteboard"],
    },
    {
      id: "SH102",
      name: "Seminar Hall 2",
      capacity: 100,
      equipment: ["Projector", "Sound System", "Whiteboard"],
    },
    {
      id: "LAB201",
      name: "Computer Lab 2",
      capacity: 30,
      equipment: ["Computers", "Projector"],
    },
    {
      id: "LAB301",
      name: "Physics Lab",
      capacity: 25,
      equipment: ["Lab Equipment", "Projector"],
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    const matchesRoom =
      selectedRoom === "all" || booking.roomId === selectedRoom;

    return matchesSearch && matchesTab && matchesRoom;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateBooking = (bookingData: any) => {
    addBooking({
      ...bookingData,
      bookedBy: user?.name || "Unknown",
      status: "pending",
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Booking</h1>
          <p className="mt-1 text-gray-600">
            Book seminar halls and labs with approval workflow
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Book Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          {
            label: "Total Bookings",
            value: bookings.length,
            color: "bg-blue-500",
          },
          {
            label: "Pending",
            value: bookings.filter((b) => b.status === "pending").length,
            color: "bg-yellow-500",
          },
          {
            label: "Approved",
            value: bookings.filter((b) => b.status === "approved").length,
            color: "bg-green-500",
          },
          {
            label: "Available Rooms",
            value: rooms.length,
            color: "bg-purple-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <Calendar className="w-6 h-6 text-white" />
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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Rooms</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(booking.status)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.purpose}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.roomName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{booking.attendees} attendees</span>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Booked by:{" "}
                    <span className="font-medium">{booking.bookedBy}</span>
                  </p>
                  {booking.requiredEquipment &&
                    booking.requiredEquipment.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Equipment: {booking.requiredEquipment.join(", ")}
                      </p>
                    )}
                  {booking.approvedBy && (
                    <p className="text-sm text-gray-600">
                      Approved by:{" "}
                      <span className="font-medium">{booking.approvedBy}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or create a new booking.
          </p>
        </div>
      )}

      {/* Create Booking Modal */}
      {showCreateModal && (
        <CreateBookingModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateBooking}
          rooms={rooms}
        />
      )}
    </div>
  );
};

interface CreateBookingModalProps {
  onClose: () => void;
  onCreate: (booking: any) => void;
  rooms: any[];
}

const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  onClose,
  onCreate,
  rooms,
}) => {
  const [formData, setFormData] = useState({
    roomId: "",
    roomName: "",
    purpose: "",
    date: "",
    startTime: "",
    endTime: "",
    attendees: "",
    requiredEquipment: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.roomId ||
      !formData.purpose ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    )
      return;

    const selectedRoom = rooms.find((r) => r.id === formData.roomId);
    onCreate({
      ...formData,
      roomName: selectedRoom?.name || "",
      attendees: parseInt(formData.attendees) || 0,
    });
  };

  const handleRoomChange = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    setFormData((prev) => ({
      ...prev,
      roomId,
      roomName: room?.name || "",
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Book a Room</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Room
            </label>
            <select
              value={formData.roomId}
              onChange={(e) => handleRoomChange(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purpose
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, purpose: e.target.value }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Project Presentation"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Attendees
            </label>
            <input
              type="number"
              value={formData.attendees}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, attendees: e.target.value }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Expected number of attendees"
              min="1"
            />
          </div>

          <div className="flex justify-end space-x-3">
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
              Book Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomBooking;
