import React, { useState } from 'react';
import { Clock, Calendar, MapPin, User, BookOpen, Plus, Edit, Trash2, Filter, Download, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  instructor: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'exam' | 'break';
  color: string;
}

interface DaySchedule {
  day: string;
  date: string;
  slots: TimeSlot[];
}

const Timetable: React.FC = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Sample timetable data
  const [timetableData, setTimetableData] = useState<DaySchedule[]>([
    {
      day: 'Monday',
      date: '2025-01-27',
      slots: [
        {
          id: 'MON-1',
          startTime: '09:00',
          endTime: '10:00',
          subject: 'Data Structures',
          instructor: 'Dr. Smith',
          room: 'Room 101',
          type: 'lecture',
          color: 'bg-blue-500',
        },
        {
          id: 'MON-2',
          startTime: '10:15',
          endTime: '11:15',
          subject: 'Database Management',
          instructor: 'Prof. Johnson',
          room: 'Room 102',
          type: 'lecture',
          color: 'bg-green-500',
        },
        {
          id: 'MON-3',
          startTime: '11:30',
          endTime: '12:30',
          subject: 'Computer Networks Lab',
          instructor: 'Dr. Wilson',
          room: 'Lab 201',
          type: 'lab',
          color: 'bg-purple-500',
        },
        {
          id: 'MON-4',
          startTime: '14:00',
          endTime: '15:00',
          subject: 'Software Engineering',
          instructor: 'Dr. Brown',
          room: 'Room 103',
          type: 'lecture',
          color: 'bg-orange-500',
        },
      ],
    },
    {
      day: 'Tuesday',
      date: '2025-01-28',
      slots: [
        {
          id: 'TUE-1',
          startTime: '09:00',
          endTime: '10:00',
          subject: 'Operating Systems',
          instructor: 'Dr. Davis',
          room: 'Room 104',
          type: 'lecture',
          color: 'bg-red-500',
        },
        {
          id: 'TUE-2',
          startTime: '10:15',
          endTime: '11:15',
          subject: 'Machine Learning',
          instructor: 'Prof. Miller',
          room: 'Room 105',
          type: 'lecture',
          color: 'bg-indigo-500',
        },
        {
          id: 'TUE-3',
          startTime: '11:30',
          endTime: '13:30',
          subject: 'Data Structures Lab',
          instructor: 'Dr. Smith',
          room: 'Lab 202',
          type: 'lab',
          color: 'bg-blue-500',
        },
        {
          id: 'TUE-4',
          startTime: '14:30',
          endTime: '15:30',
          subject: 'Tutorial - Algorithms',
          instructor: 'TA John',
          room: 'Room 106',
          type: 'tutorial',
          color: 'bg-yellow-500',
        },
      ],
    },
    {
      day: 'Wednesday',
      date: '2025-01-29',
      slots: [
        {
          id: 'WED-1',
          startTime: '09:00',
          endTime: '10:00',
          subject: 'Computer Graphics',
          instructor: 'Dr. Taylor',
          room: 'Room 107',
          type: 'lecture',
          color: 'bg-pink-500',
        },
        {
          id: 'WED-2',
          startTime: '10:15',
          endTime: '11:15',
          subject: 'Artificial Intelligence',
          instructor: 'Prof. Anderson',
          room: 'Room 108',
          type: 'lecture',
          color: 'bg-teal-500',
        },
        {
          id: 'WED-3',
          startTime: '11:30',
          endTime: '12:30',
          subject: 'Web Development Lab',
          instructor: 'Dr. White',
          room: 'Lab 203',
          type: 'lab',
          color: 'bg-cyan-500',
        },
      ],
    },
    {
      day: 'Thursday',
      date: '2025-01-30',
      slots: [
        {
          id: 'THU-1',
          startTime: '09:00',
          endTime: '10:00',
          subject: 'Discrete Mathematics',
          instructor: 'Dr. Garcia',
          room: 'Room 109',
          type: 'lecture',
          color: 'bg-lime-500',
        },
        {
          id: 'THU-2',
          startTime: '10:15',
          endTime: '11:15',
          subject: 'Computer Architecture',
          instructor: 'Prof. Martinez',
          room: 'Room 110',
          type: 'lecture',
          color: 'bg-amber-500',
        },
        {
          id: 'THU-3',
          startTime: '14:00',
          endTime: '17:00',
          subject: 'Project Work',
          instructor: 'Dr. Smith',
          room: 'Lab 204',
          type: 'lab',
          color: 'bg-violet-500',
        },
      ],
    },
    {
      day: 'Friday',
      date: '2025-01-31',
      slots: [
        {
          id: 'FRI-1',
          startTime: '09:00',
          endTime: '10:00',
          subject: 'Compiler Design',
          instructor: 'Dr. Lee',
          room: 'Room 111',
          type: 'lecture',
          color: 'bg-rose-500',
        },
        {
          id: 'FRI-2',
          startTime: '10:15',
          endTime: '11:15',
          subject: 'Information Security',
          instructor: 'Prof. Clark',
          room: 'Room 112',
          type: 'lecture',
          color: 'bg-emerald-500',
        },
        {
          id: 'FRI-3',
          startTime: '11:30',
          endTime: '12:30',
          subject: 'Seminar Presentation',
          instructor: 'Various',
          room: 'Seminar Hall',
          type: 'tutorial',
          color: 'bg-slate-500',
        },
      ],
    },
  ]);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800';
      case 'lab':
        return 'bg-purple-100 text-purple-800';
      case 'tutorial':
        return 'bg-yellow-100 text-yellow-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'break':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture':
        return <BookOpen className="w-4 h-4" />;
      case 'lab':
        return <User className="w-4 h-4" />;
      case 'tutorial':
        return <Edit className="w-4 h-4" />;
      case 'exam':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredData = timetableData.map(day => ({
    ...day,
    slots: filterType === 'all' ? day.slots : day.slots.filter(slot => slot.type === filterType)
  }));

  const handleAddSlot = (slotData: any) => {
    const newSlot: TimeSlot = {
      id: `${slotData.day}-${Date.now()}`,
      ...slotData,
      color: 'bg-blue-500',
    };

    setTimetableData(prev => prev.map(day => 
      day.day === slotData.day 
        ? { ...day, slots: [...day.slots, newSlot].sort((a, b) => a.startTime.localeCompare(b.startTime)) }
        : day
    ));
    setShowAddModal(false);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setShowAddModal(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    setTimetableData(prev => prev.map(day => ({
      ...day,
      slots: day.slots.filter(slot => slot.id !== slotId)
    })));
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7)));
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
          <p className="mt-1 text-gray-600">View and manage your weekly class schedule</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ←
              </button>
              <span className="text-sm font-medium text-gray-900">
                Week {currentWeek === 0 ? 'Current' : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
              </span>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                →
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded-md ${
                  viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm rounded-md ${
                  viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="lecture">Lectures</option>
              <option value="lab">Labs</option>
              <option value="tutorial">Tutorials</option>
              <option value="exam">Exams</option>
            </select>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600" title="Download Timetable">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600" title="Import Timetable">
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      {viewMode === 'week' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Time
                  </th>
                  {filteredData.map((day) => (
                    <th key={day.day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div>
                        <div>{day.day}</div>
                        <div className="text-gray-400 font-normal">{day.date}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((time, timeIndex) => (
                  <tr key={time} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                      {time}
                    </td>
                    {filteredData.map((day) => {
                      const slot = day.slots.find(s => s.startTime === time);
                      return (
                        <td key={`${day.day}-${time}`} className="px-6 py-4 whitespace-nowrap">
                          {slot ? (
                            <div className={`${slot.color} text-white p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getTypeIcon(slot.type)}
                                  <div>
                                    <div className="font-medium text-sm">{slot.subject}</div>
                                    <div className="text-xs opacity-90">{slot.instructor}</div>
                                    <div className="text-xs opacity-75 flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {slot.room}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <button
                                    onClick={() => handleEditSlot(slot)}
                                    className="text-white hover:text-gray-200"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="text-white hover:text-gray-200"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs mt-1 opacity-75">
                                {slot.startTime} - {slot.endTime}
                              </div>
                            </div>
                          ) : (
                            <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-300 cursor-pointer">
                              <Plus className="w-4 h-4" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Day View
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {filteredData.map((day, index) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedDay === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {filteredData[selectedDay]?.day} - {filteredData[selectedDay]?.date}
            </h3>
            <div className="space-y-3">
              {filteredData[selectedDay]?.slots.map((slot) => (
                <div key={slot.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`${slot.color} text-white p-2 rounded-lg`}>
                        {getTypeIcon(slot.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{slot.subject}</h4>
                        <p className="text-sm text-gray-600">{slot.instructor}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {slot.room}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(slot.type)}`}>
                            {slot.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSlot(slot)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredData[selectedDay]?.slots.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No classes scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddClassModal
          slot={editingSlot}
          onClose={() => {
            setShowAddModal(false);
            setEditingSlot(null);
          }}
          onSave={handleAddSlot}
          days={timetableData.map(d => d.day)}
        />
      )}
    </div>
  );
};

interface AddClassModalProps {
  slot?: TimeSlot | null;
  onClose: () => void;
  onSave: (slot: any) => void;
  days: string[];
}

const AddClassModal: React.FC<AddClassModalProps> = ({ slot, onClose, onSave, days }) => {
  const [formData, setFormData] = useState({
    day: slot?.id.split('-')[0] || 'Monday',
    startTime: slot?.startTime || '09:00',
    endTime: slot?.endTime || '10:00',
    subject: slot?.subject || '',
    instructor: slot?.instructor || '',
    room: slot?.room || '',
    type: slot?.type || 'lecture',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{slot ? 'Edit Class' : 'Add New Class'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Day</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Data Structures"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instructor</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Dr. Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Room</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Room 101"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
              <option value="tutorial">Tutorial</option>
              <option value="exam">Exam</option>
            </select>
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
              {slot ? 'Update' : 'Add'} Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Timetable;
