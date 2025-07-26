import React, { useState } from 'react';
import { Plus, Search, MapPin, Calendar, User, Phone, Eye } from 'lucide-react';

const LostAndFound: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [items, setItems] = useState([
    {
      id: 'LF001',
      title: 'iPhone 13 Pro - Black',
      description: 'Lost my black iPhone 13 Pro near the library. It has a blue case with my name sticker on the back.',
      type: 'lost' as const,
      category: 'Electronics',
      location: 'Library',
      date: '2025-01-20',
      contactPerson: 'John Student',
      contactDetails: 'john.student@college.edu | +1 (555) 123-4567',
      status: 'active' as const,
      images: ['iphone-case.jpg'],
      reward: '$50',
    },
    {
      id: 'LF002',
      title: 'Red Water Bottle',
      description: 'Found a red water bottle with "Sarah" written on it near the canteen. It has some stickers on it.',
      type: 'found' as const,
      category: 'Personal Items',
      location: 'Canteen',
      date: '2025-01-19',
      contactPerson: 'Mike Davis',
      contactDetails: 'mike.davis@college.edu | +1 (555) 987-6543',
      status: 'active' as const,
      images: [],
    },
    {
      id: 'LF003',
      title: 'Mechanical Engineering Textbook',
      description: 'Lost my Mechanical Engineering textbook "Machine Design" by R.S. Khurmi near the mechanical lab.',
      type: 'lost' as const,
      category: 'Books',
      location: 'Mechanical Lab',
      date: '2025-01-18',
      contactPerson: 'Alex Johnson',
      contactDetails: 'alex.johnson@college.edu | +1 (555) 456-7890',
      status: 'active' as const,
      images: [],
    },
    {
      id: 'LF004',
      title: 'Black Backpack - Nike',
      description: 'Found a black Nike backpack containing some notebooks and a calculator near the parking lot.',
      type: 'found' as const,
      category: 'Bags',
      location: 'Parking Lot',
      date: '2025-01-17',
      contactPerson: 'Security Office',
      contactDetails: 'security@college.edu | +1 (555) 111-2222',
      status: 'resolved' as const,
      images: ['backpack.jpg'],
    },
  ]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: '',
    location: '',
    date: '',
    contactPerson: '',
    contactDetails: '',
    reward: '',
  });
  const [formSuccess, setFormSuccess] = useState(false);

  const categories = ['All Categories', 'Electronics', 'Books', 'Personal Items', 'Bags', 'Accessories', 'Documents'];

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    return type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
          <p className="mt-1 text-gray-600">Report lost items or help others find their belongings</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Report Item
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'lost', label: 'Lost Items' },
              { key: 'found', label: 'Found Items' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by item name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-lg p-3">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lost Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.type === 'lost' && item.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Found Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.type === 'found' && item.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${getTypeColor(item.type)}`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                {item.type === 'lost' && item.reward && (
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md">
                    Reward: {item.reward}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{item.contactPerson}</span>
                </div>
              </div>

              {item.images && item.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    {item.images.map((image, index) => (
                      <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => { setSelectedItem(item); setShowContactModal(true); }}
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => { setSelectedItem(item); setShowDetailsModal(true); }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
        </div>
      )}
      {/* Report Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => { setShowCreateModal(false); setFormSuccess(false); }}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Report Lost/Found Item</h2>
            {formSuccess ? (
              <div className="mb-4 text-green-600 font-semibold">Item reported successfully!</div>
            ) : (
              <form onSubmit={e => {
                e.preventDefault();
                const newItem = {
                  ...form,
                  id: `LF${Math.floor(Math.random()*100000)}`,
                  status: 'active',
                  images: [],
                };
                setItems([newItem, ...items]);
                setForm({
                  title: '', description: '', type: 'lost', category: '', location: '', date: '', contactPerson: '', contactDetails: '', reward: '',
                });
                setFormSuccess(true);
                setTimeout(() => {
                  setShowCreateModal(false);
                  setFormSuccess(false);
                }, 1200);
              }}>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Title</label>
                  <input className="w-full border rounded px-2 py-1" required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea className="w-full border rounded px-2 py-1" required value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Type</label>
                  <select className="w-full border rounded px-2 py-1" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Category</label>
                  <input className="w-full border rounded px-2 py-1" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Location</label>
                  <input className="w-full border rounded px-2 py-1" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Date</label>
                  <input type="date" className="w-full border rounded px-2 py-1" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Contact Person</label>
                  <input className="w-full border rounded px-2 py-1" value={form.contactPerson} onChange={e => setForm(f => ({...f, contactPerson: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Contact Details</label>
                  <input className="w-full border rounded px-2 py-1" value={form.contactDetails} onChange={e => setForm(f => ({...f, contactDetails: e.target.value}))} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Reward (optional)</label>
                  <input className="w-full border rounded px-2 py-1" value={form.reward} onChange={e => setForm(f => ({...f, reward: e.target.value}))} />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Contact Modal */}
      {showContactModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowContactModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="mb-2"><span className="font-semibold">Contact Person:</span> {selectedItem.contactPerson}</div>
            <div className="mb-4"><span className="font-semibold">Contact Details:</span> {selectedItem.contactDetails}</div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowContactModal(false)}>Close</button>
          </div>
        </div>
      )}
      {/* View Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowDetailsModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-2">{selectedItem.title}</h2>
            <div className="mb-2 text-gray-600">{selectedItem.description}</div>
            <div className="mb-2"><span className="font-semibold">Category:</span> {selectedItem.category}</div>
            <div className="mb-2"><span className="font-semibold">Location:</span> {selectedItem.location}</div>
            <div className="mb-2"><span className="font-semibold">Date:</span> {formatDate(selectedItem.date)}</div>
            <div className="mb-2"><span className="font-semibold">Status:</span> {selectedItem.status}</div>
            <div className="mb-2"><span className="font-semibold">Contact:</span> {selectedItem.contactPerson} ({selectedItem.contactDetails})</div>
            {selectedItem.reward && <div className="mb-2"><span className="font-semibold">Reward:</span> {selectedItem.reward}</div>}
            <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={() => setShowDetailsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFound;