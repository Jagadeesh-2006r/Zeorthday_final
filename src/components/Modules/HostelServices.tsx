import React, { useState } from 'react';
import { Plus, Home, Utensils, Wrench, Users, Calendar, Clock, Filter, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HostelService {
  id: string;
  type: 'room-change' | 'mess-registration' | 'maintenance' | 'visitor-pass';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  approvedBy?: string;
  completedAt?: string;
  roomNumber?: string;
  visitorDetails?: {
    name: string;
    relation: string;
    phone: string;
    visitDate: string;
    duration: string;
  };
}

const HostelServices: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [services, setServices] = useState<HostelService[]>([
    {
      id: 'HS001',
      type: 'room-change',
      title: 'Room Change Request',
      description: 'Request to change from Room 201A to Room 301B due to roommate issues.',
      requestedBy: 'John Student',
      requestedAt: '2025-01-20T10:00:00Z',
      status: 'pending',
      priority: 'medium',
      roomNumber: '201A',
    },
    {
      id: 'HS002',
      type: 'mess-registration',
      title: 'Mess Registration - Vegetarian',
      description: 'Registration for vegetarian mess for the upcoming semester.',
      requestedBy: 'Sarah Wilson',
      requestedAt: '2025-01-19T14:30:00Z',
      status: 'approved',
      priority: 'low',
      approvedBy: 'Hostel Warden',
    },
    {
      id: 'HS003',
      type: 'maintenance',
      title: 'AC Repair Request',
      description: 'Air conditioning unit not working properly in Room 105C.',
      requestedBy: 'Mike Johnson',
      requestedAt: '2025-01-21T09:15:00Z',
      status: 'completed',
      priority: 'high',
      approvedBy: 'Maintenance Head',
      completedAt: '2025-01-22T16:00:00Z',
      roomNumber: '105C',
    },
    {
      id: 'HS004',
      type: 'visitor-pass',
      title: 'Visitor Pass for Parents',
      description: 'Visitor pass request for parents visiting this weekend.',
      requestedBy: 'Emma Davis',
      requestedAt: '2025-01-18T11:00:00Z',
      status: 'approved',
      priority: 'low',
      approvedBy: 'Security Head',
      visitorDetails: {
        name: 'Mr. & Mrs. Davis',
        relation: 'Parents',
        phone: '+91-9876543210',
        visitDate: '2025-01-25',
        duration: '2 days',
      },
    },
  ]);

  const serviceTypes = [
    { value: 'all', label: 'All Services' },
    { value: 'room-change', label: 'Room Change' },
    { value: 'mess-registration', label: 'Mess Registration' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'visitor-pass', label: 'Visitor Pass' },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || service.type === selectedType;
    const matchesTab = activeTab === 'all' || service.status === activeTab;
    
    return matchesSearch && matchesType && matchesTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'room-change':
        return <Home className="w-5 h-5 text-blue-500" />;
      case 'mess-registration':
        return <Utensils className="w-5 h-5 text-green-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'visitor-pass':
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Home className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleCreateService = (serviceData: any) => {
    const newService: HostelService = {
      id: 'HS' + (Date.now() + Math.floor(Math.random() * 1000)),
      ...serviceData,
      requestedBy: user?.name || 'Unknown',
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
    setServices(prev => [newService, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hostel Services</h1>
          <p className="mt-1 text-gray-600">Room changes, mess registration, and maintenance requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: services.length, color: 'bg-blue-500' },
          { label: 'Pending', value: services.filter(s => s.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Approved', value: services.filter(s => s.status === 'approved').length, color: 'bg-green-500' },
          { label: 'Completed', value: services.filter(s => s.status === 'completed').length, color: 'bg-purple-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <Home className="w-6 h-6 text-white" />
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
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {serviceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            {['all', 'pending', 'approved', 'completed'].map((tab) => (
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

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(service.type)}
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(service.priority)}`}>
                    {service.priority} priority
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{service.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Requested: {new Date(service.requestedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>By: {service.requestedBy}</span>
                  </div>
                  {service.roomNumber && (
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4" />
                      <span>Room: {service.roomNumber}</span>
                    </div>
                  )}
                </div>

                {service.approvedBy && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Approved by:</span> {service.approvedBy}
                  </div>
                )}

                {service.completedAt && (
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Completed:</span> {new Date(service.completedAt).toLocaleDateString()}
                  </div>
                )}

                {service.visitorDetails && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Visitor Details:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><span className="font-medium">Name:</span> {service.visitorDetails.name}</div>
                      <div><span className="font-medium">Relation:</span> {service.visitorDetails.relation}</div>
                      <div><span className="font-medium">Phone:</span> {service.visitorDetails.phone}</div>
                      <div><span className="font-medium">Visit Date:</span> {service.visitorDetails.visitDate}</div>
                      <div><span className="font-medium">Duration:</span> {service.visitorDetails.duration}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                {getStatusIcon(service.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new request.</p>
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateModal && (
        <CreateServiceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateService}
          serviceTypes={serviceTypes.filter(t => t.value !== 'all')}
        />
      )}
    </div>
  );
};

interface CreateServiceModalProps {
  onClose: () => void;
  onCreate: (service: any) => void;
  serviceTypes: { value: string; label: string }[];
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ onClose, onCreate, serviceTypes }) => {
  const [formData, setFormData] = useState({
    type: 'room-change',
    title: '',
    description: '',
    priority: 'medium',
    roomNumber: '',
    visitorDetails: {
      name: '',
      relation: '',
      phone: '',
      visitDate: '',
      duration: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    const serviceData = {
      ...formData,
      visitorDetails: formData.type === 'visitor-pass' ? formData.visitorDetails : undefined,
    };
    
    onCreate(serviceData);
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
        <h2 className="text-xl font-bold mb-4">New Service Request</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

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
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {(formData.type === 'room-change' || formData.type === 'maintenance') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Number</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 201A"
              />
            </div>
          )}

          {formData.type === 'visitor-pass' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Visitor Details</h4>
              <input
                type="text"
                placeholder="Visitor Name"
                value={formData.visitorDetails.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  visitorDetails: { ...prev.visitorDetails, name: e.target.value }
                }))}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Relation (e.g., Father, Friend)"
                value={formData.visitorDetails.relation}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  visitorDetails: { ...prev.visitorDetails, relation: e.target.value }
                }))}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.visitorDetails.phone}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  visitorDetails: { ...prev.visitorDetails, phone: e.target.value }
                }))}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={formData.visitorDetails.visitDate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  visitorDetails: { ...prev.visitorDetails, visitDate: e.target.value }
                }))}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2 days, 1 week)"
                value={formData.visitorDetails.duration}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  visitorDetails: { ...prev.visitorDetails, duration: e.target.value }
                }))}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

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
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostelServices;
