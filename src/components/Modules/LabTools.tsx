import React, { useState } from 'react';
import { Plus, Wrench, Calendar, User, Clock, Filter, Search, CheckCircle, XCircle, AlertTriangle, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LabTool {
  id: string;
  name: string;
  category: 'electronics' | 'mechanical' | 'software' | 'measurement' | 'safety';
  description: string;
  serialNumber: string;
  location: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'damaged';
  borrowedBy?: string;
  borrowedAt?: string;
  dueDate?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance: string;
}

interface BorrowRequest {
  id: string;
  toolId: string;
  toolName: string;
  requestedBy: string;
  requestedAt: string;
  purpose: string;
  expectedDuration: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  approvedBy?: string;
  borrowedAt?: string;
  returnedAt?: string;
  condition?: string;
}

const LabTools: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tools' | 'requests' | 'history'>('tools');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<LabTool | null>(null);

  const [tools, setTools] = useState<LabTool[]>([
    {
      id: 'LT001',
      name: 'Digital Multimeter',
      category: 'electronics',
      description: 'High-precision digital multimeter for electrical measurements',
      serialNumber: 'DMM-2024-001',
      location: 'Electronics Lab - Shelf A1',
      status: 'available',
      condition: 'excellent',
      lastMaintenance: '2025-01-15',
    },
    {
      id: 'LT002',
      name: 'Oscilloscope',
      category: 'electronics',
      description: '100MHz Digital Storage Oscilloscope',
      serialNumber: 'OSC-2024-002',
      location: 'Electronics Lab - Bench 3',
      status: 'borrowed',
      borrowedBy: 'John Student',
      borrowedAt: '2025-01-20T10:00:00Z',
      dueDate: '2025-01-25T10:00:00Z',
      condition: 'good',
      lastMaintenance: '2025-01-10',
    },
    {
      id: 'LT003',
      name: 'Vernier Calipers',
      category: 'measurement',
      description: 'Digital vernier calipers with 0.01mm precision',
      serialNumber: 'VC-2024-003',
      location: 'Mechanical Lab - Tool Cabinet',
      status: 'available',
      condition: 'good',
      lastMaintenance: '2025-01-12',
    },
    {
      id: 'LT004',
      name: 'Function Generator',
      category: 'electronics',
      description: '20MHz Arbitrary Function Generator',
      serialNumber: 'FG-2024-004',
      location: 'Electronics Lab - Bench 5',
      status: 'maintenance',
      condition: 'fair',
      lastMaintenance: '2025-01-18',
    },
    {
      id: 'LT005',
      name: 'Safety Goggles',
      category: 'safety',
      description: 'Chemical resistant safety goggles',
      serialNumber: 'SG-2024-005',
      location: 'Chemistry Lab - Safety Station',
      status: 'available',
      condition: 'excellent',
      lastMaintenance: '2025-01-20',
    },
  ]);

  const [requests, setRequests] = useState<BorrowRequest[]>([
    {
      id: 'BR001',
      toolId: 'LT001',
      toolName: 'Digital Multimeter',
      requestedBy: 'Sarah Wilson',
      requestedAt: '2025-01-22T09:00:00Z',
      purpose: 'Circuit analysis for final project',
      expectedDuration: '3 days',
      status: 'pending',
    },
    {
      id: 'BR002',
      toolId: 'LT002',
      toolName: 'Oscilloscope',
      requestedBy: 'John Student',
      requestedAt: '2025-01-20T10:00:00Z',
      purpose: 'Signal analysis experiment',
      expectedDuration: '5 days',
      status: 'approved',
      approvedBy: 'Lab Coordinator',
      borrowedAt: '2025-01-20T10:00:00Z',
    },
  ]);

  const categories = ['all', 'electronics', 'mechanical', 'software', 'measurement', 'safety'];
  const statuses = ['all', 'available', 'borrowed', 'maintenance', 'damaged'];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'borrowed':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
      case 'damaged':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'borrowed':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electronics':
        return '⚡';
      case 'mechanical':
        return '⚙️';
      case 'software':
        return '💻';
      case 'measurement':
        return '📏';
      case 'safety':
        return '🛡️';
      default:
        return '🔧';
    }
  };

  const handleBorrowRequest = (tool: LabTool) => {
    setSelectedTool(tool);
    setShowBorrowModal(true);
  };

  const handleCreateBorrowRequest = (requestData: any) => {
    const newRequest: BorrowRequest = {
      id: 'BR' + (Date.now() + Math.floor(Math.random() * 1000)),
      toolId: selectedTool?.id || '',
      toolName: selectedTool?.name || '',
      requestedBy: user?.name || 'Unknown',
      requestedAt: new Date().toISOString(),
      status: 'pending',
      ...requestData,
    };
    setRequests(prev => [newRequest, ...prev]);
    setShowBorrowModal(false);
    setSelectedTool(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Tool Lending</h1>
          <p className="mt-1 text-gray-600">Borrow and return lab tools with usage logs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Tools', value: tools.length, color: 'bg-blue-500' },
          { label: 'Available', value: tools.filter(t => t.status === 'available').length, color: 'bg-green-500' },
          { label: 'Borrowed', value: tools.filter(t => t.status === 'borrowed').length, color: 'bg-yellow-500' },
          { label: 'Maintenance', value: tools.filter(t => t.status === 'maintenance').length, color: 'bg-red-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'tools', label: 'Available Tools', icon: Package },
              { key: 'requests', label: 'My Requests', icon: Clock },
              { key: 'history', label: 'Borrow History', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'tools' && (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCategoryIcon(tool.category)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-600">{tool.serialNumber}</p>
                      </div>
                    </div>
                    {getStatusIcon(tool.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{tool.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tool.status)}`}>
                        {tool.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Condition:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getConditionColor(tool.condition)}`}>
                        {tool.condition}
                      </span>
                    </div>
                  </div>

                  {tool.status === 'borrowed' && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-blue-800">
                        <strong>Borrowed by:</strong> {tool.borrowedBy}
                      </p>
                      <p className="text-sm text-blue-800">
                        <strong>Due:</strong> {tool.dueDate ? new Date(tool.dueDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleBorrowRequest(tool)}
                    disabled={tool.status !== 'available'}
                    className={`w-full py-2 px-4 text-sm font-medium rounded-md ${
                      tool.status === 'available'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {tool.status === 'available' ? 'Request Borrow' : 'Not Available'}
                  </button>
                </div>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="p-6">
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{request.toolName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{request.purpose}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Requested:</span> {new Date(request.requestedAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {request.expectedDuration}
                        </div>
                      </div>

                      {request.approvedBy && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Approved by:</span> {request.approvedBy}
                        </div>
                      )}
                    </div>
                    
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {requests.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">You haven't made any borrow requests yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Borrow History</h3>
              <p className="text-gray-600">Your borrowing history will appear here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Borrow Request Modal */}
      {showBorrowModal && selectedTool && (
        <BorrowRequestModal
          tool={selectedTool}
          onClose={() => {
            setShowBorrowModal(false);
            setSelectedTool(null);
          }}
          onCreate={handleCreateBorrowRequest}
        />
      )}
    </div>
  );
};

interface BorrowRequestModalProps {
  tool: LabTool;
  onClose: () => void;
  onCreate: (request: any) => void;
}

const BorrowRequestModal: React.FC<BorrowRequestModalProps> = ({ tool, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    purpose: '',
    expectedDuration: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purpose || !formData.expectedDuration) return;
    
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" 
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Borrow Request</h2>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">{tool.name}</h3>
          <p className="text-sm text-gray-600">{tool.description}</p>
          <p className="text-sm text-gray-600">Serial: {tool.serialNumber}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe why you need this tool..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Duration</label>
            <select
              value={formData.expectedDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedDuration: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select duration</option>
              <option value="1 day">1 day</option>
              <option value="2 days">2 days</option>
              <option value="3 days">3 days</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
            </select>
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
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTools;
