import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, Filter, Search, Download, Star, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  category: 'technical' | 'cultural' | 'sports' | 'workshop' | 'seminar' | 'club';
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  registrationDeadline: string;
  image?: string;
  requirements?: string[];
  certificateTemplate?: string;
  isRegistered?: boolean;
  isFavorite?: boolean;
}

const Events: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'registered' | 'favorites'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [events, setEvents] = useState<Event[]>([
    {
      id: 'EVT001',
      title: 'AI & Machine Learning Workshop',
      description: 'Hands-on workshop covering the fundamentals of AI and ML with practical projects.',
      organizer: 'Tech Club',
      category: 'workshop',
      date: '2025-02-15',
      time: '10:00',
      venue: 'Computer Lab 1',
      capacity: 30,
      registeredCount: 18,
      registrationDeadline: '2025-02-10',
      requirements: ['Laptop', 'Basic Python knowledge'],
      certificateTemplate: 'workshop_certificate.pdf',
      isRegistered: false,
      isFavorite: true,
    },
    {
      id: 'EVT002',
      title: 'Annual Cultural Fest',
      description: 'Join us for a spectacular cultural celebration with music, dance, and drama performances.',
      organizer: 'Cultural Committee',
      category: 'cultural',
      date: '2025-03-01',
      time: '18:00',
      venue: 'Main Auditorium',
      capacity: 500,
      registeredCount: 245,
      registrationDeadline: '2025-02-25',
      isRegistered: true,
      isFavorite: false,
    },
    {
      id: 'EVT003',
      title: 'Inter-College Basketball Tournament',
      description: 'Compete with teams from various colleges in this exciting basketball tournament.',
      organizer: 'Sports Committee',
      category: 'sports',
      date: '2025-02-20',
      time: '09:00',
      venue: 'Sports Complex',
      capacity: 16,
      registeredCount: 12,
      registrationDeadline: '2025-02-15',
      requirements: ['Team of 5 players', 'Sports kit'],
      isRegistered: false,
      isFavorite: false,
    },
    {
      id: 'EVT004',
      title: 'Entrepreneurship Seminar',
      description: 'Learn from successful entrepreneurs about starting and scaling your own business.',
      organizer: 'Entrepreneurship Cell',
      category: 'seminar',
      date: '2025-02-28',
      time: '14:00',
      venue: 'Seminar Hall 1',
      capacity: 100,
      registeredCount: 67,
      registrationDeadline: '2025-02-25',
      certificateTemplate: 'seminar_certificate.pdf',
      isRegistered: true,
      isFavorite: true,
    },
  ]);

  const categories = ['all', 'technical', 'cultural', 'sports', 'workshop', 'seminar', 'club'];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'registered' && event.isRegistered) ||
                      (activeTab === 'favorites' && event.isFavorite);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800',
      cultural: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      workshop: 'bg-orange-100 text-orange-800',
      seminar: 'bg-indigo-100 text-indigo-800',
      club: 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleRegister = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: !event.isRegistered, registeredCount: event.isRegistered ? event.registeredCount - 1 : event.registeredCount + 1 }
        : event
    ));
  };

  const handleFavorite = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    ));
  };

  const handleCreateEvent = (eventData: any) => {
    const newEvent: Event = {
      id: 'EVT' + (Date.now() + Math.floor(Math.random() * 1000)),
      ...eventData,
      organizer: user?.name || 'Unknown',
      registeredCount: 0,
      isRegistered: false,
      isFavorite: false,
    };
    setEvents(prev => [newEvent, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Clubs</h1>
          <p className="mt-1 text-gray-600">Discover events, RSVP, and download certificates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Events', value: events.length, color: 'bg-blue-500' },
          { label: 'Registered', value: events.filter(e => e.isRegistered).length, color: 'bg-green-500' },
          { label: 'Favorites', value: events.filter(e => e.isFavorite).length, color: 'bg-red-500' },
          { label: 'This Month', value: events.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length, color: 'bg-purple-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
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
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            {['all', 'registered', 'favorites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
                <button
                  onClick={() => handleFavorite(event.id)}
                  className={`p-1 rounded-full ${event.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${event.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{event.registeredCount}/{event.capacity} registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Register by {event.registrationDeadline}</span>
                </div>
              </div>

              {event.requirements && event.requirements.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {event.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">by {event.organizer}</span>
                <div className="flex space-x-2">
                  {event.certificateTemplate && event.isRegistered && (
                    <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                      <Download className="w-3 h-3 mr-1" />
                      Certificate
                    </button>
                  )}
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={event.registeredCount >= event.capacity && !event.isRegistered}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      event.isRegistered
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : event.registeredCount >= event.capacity
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {event.isRegistered ? 'Unregister' : event.registeredCount >= event.capacity ? 'Full' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new event.</p>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
          categories={categories.filter(c => c !== 'all')}
        />
      )}
    </div>
  );
};

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (event: any) => void;
  categories: string[];
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onCreate, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'workshop',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    registrationDeadline: '',
    requirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.venue) return;
    
    onCreate({
      ...formData,
      capacity: parseInt(formData.capacity) || 0,
      requirements: formData.requirements ? formData.requirements.split(',').map(r => r.trim()) : [],
    });
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
        <h2 className="text-xl font-bold mb-4">Create Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
            <input
              type="date"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Requirements (comma-separated)</label>
            <input
              type="text"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Laptop, Basic knowledge"
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
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Events;
