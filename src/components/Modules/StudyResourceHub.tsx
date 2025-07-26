import React, { useState } from 'react';
import { Plus, Search, Download, Star, Filter, BookOpen, FileText, GraduationCap, User, Calendar, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudyResourceHub: React.FC = () => {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [resources, setResources] = useState([
    {
      id: 'SR001',
      title: 'Database Management Systems - Complete Notes',
      description: 'Comprehensive notes covering all DBMS concepts including SQL, normalization, transactions, and indexing.',
      subject: 'Database Management Systems',
      department: 'Computer Science',
      year: '3rd Year',
      type: 'notes' as const,
      uploadedBy: 'Dr. Sarah Johnson',
      uploadedAt: '2025-01-15T10:30:00Z',
      fileUrl: 'dbms-notes.pdf',
      downloads: 234,
      rating: 4.8,
      fileSize: '2.5 MB',
    },
    {
      id: 'SR002',
      title: 'Data Structures Mid-Sem Question Paper 2024',
      description: 'Previous year mid-semester examination question paper with solutions for Data Structures course.',
      subject: 'Data Structures',
      department: 'Computer Science',
      year: '2nd Year',
      type: 'question-paper' as const,
      uploadedBy: 'Academic Office',
      uploadedAt: '2025-01-12T14:15:00Z',
      fileUrl: 'ds-midsem-2024.pdf',
      downloads: 156,
      rating: 4.6,
      fileSize: '1.8 MB',
    },
    {
      id: 'SR003',
      title: 'Introduction to Machine Learning - eBook',
      description: 'Complete eBook covering fundamentals of machine learning, algorithms, and practical implementations.',
      subject: 'Machine Learning',
      department: 'Computer Science',
      year: '4th Year',
      type: 'ebook' as const,
      uploadedBy: 'Prof. Michael Chen',
      uploadedAt: '2025-01-10T09:45:00Z',
      fileUrl: 'ml-ebook.pdf',
      downloads: 89,
      rating: 4.9,
      fileSize: '12.3 MB',
    },
    {
      id: 'SR004',
      title: 'Software Engineering Project Assignment',
      description: 'Assignment questions and guidelines for the software engineering project including requirements and deliverables.',
      subject: 'Software Engineering',
      department: 'Computer Science',
      year: '3rd Year',
      type: 'assignment' as const,
      uploadedBy: 'Dr. Lisa Wang',
      uploadedAt: '2025-01-08T16:20:00Z',
      fileUrl: 'se-assignment.pdf',
      downloads: 67,
      rating: 4.4,
      fileSize: '856 KB',
    },
  ]);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    subject: '',
    department: '',
    year: '',
    type: 'notes',
    file: null as File | null,
    fileSize: '',
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const types = ['notes', 'question-paper', 'ebook', 'assignment'];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || resource.department === selectedDepartment;
    const matchesYear = selectedYear === 'all' || resource.year === selectedYear;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesDepartment && matchesYear && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notes': return <BookOpen className="w-5 h-5" />;
      case 'question-paper': return <FileText className="w-5 h-5" />;
      case 'ebook': return <GraduationCap className="w-5 h-5" />;
      case 'assignment': return <FileText className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notes': return 'bg-blue-100 text-blue-800';
      case 'question-paper': return 'bg-green-100 text-green-800';
      case 'ebook': return 'bg-purple-100 text-purple-800';
      case 'assignment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const canUpload = user?.role === 'faculty' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Resource Hub</h1>
          <p className="mt-1 text-gray-600">Access notes, papers, eBooks, and study materials</p>
        </div>
        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Resource
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notes</p>
              <p className="text-2xl font-bold text-gray-900">
                {resources.filter(r => r.type === 'notes').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Papers</p>
              <p className="text-2xl font-bold text-gray-900">
                {resources.filter(r => r.type === 'question-paper').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">eBooks</p>
              <p className="text-2xl font-bold text-gray-900">
                {resources.filter(r => r.type === 'ebook').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">
                {resources.reduce((sum, r) => sum + r.downloads, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${getTypeColor(resource.type)}`}>
                    {resource.type.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(resource.rating)}
                  <span className="text-sm text-gray-600 ml-1">({resource.rating})</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{resource.subject}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">{resource.fileSize}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>{resource.department}</span>
                  <span>{resource.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{resource.uploadedBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(resource.uploadedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{resource.downloads}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                    onClick={() => { setSelectedResource(resource); setShowPreviewModal(true); }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    className="bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                    onClick={() => {
                      // Simulate download and increment download count
                      setResources((prev) => prev.map(r => r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r));
                      alert('Download simulated: ' + resource.fileUrl);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => { setShowUploadModal(false); setUploadSuccess(false); }}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
            {uploadSuccess ? (
              <div className="mb-4 text-green-600 font-semibold">Resource uploaded successfully!</div>
            ) : (
              <form onSubmit={e => {
                e.preventDefault();
                const newResource = {
                  id: `SR${Math.floor(Math.random()*100000)}`,
                  title: uploadForm.title,
                  description: uploadForm.description,
                  subject: uploadForm.subject,
                  department: uploadForm.department,
                  year: uploadForm.year,
                  type: uploadForm.type,
                  uploadedBy: user?.name || 'You',
                  uploadedAt: new Date().toISOString(),
                  fileUrl: uploadForm.file ? uploadForm.file.name : 'uploaded-file.pdf',
                  downloads: 0,
                  rating: 0,
                  fileSize: uploadForm.file ? `${(uploadForm.file.size/1024/1024).toFixed(2)} MB` : 'Unknown',
                };
                setResources([newResource, ...resources]);
                setUploadForm({ title: '', description: '', subject: '', department: '', year: '', type: 'notes', file: null, fileSize: '' });
                setUploadSuccess(true);
                setTimeout(() => {
                  setShowUploadModal(false);
                  setUploadSuccess(false);
                }, 1200);
              }}>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Title</label>
                  <input className="w-full border rounded px-2 py-1" required value={uploadForm.title} onChange={e => setUploadForm(f => ({...f, title: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea className="w-full border rounded px-2 py-1" required value={uploadForm.description} onChange={e => setUploadForm(f => ({...f, description: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Subject</label>
                  <input className="w-full border rounded px-2 py-1" required value={uploadForm.subject} onChange={e => setUploadForm(f => ({...f, subject: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Department</label>
                  <input className="w-full border rounded px-2 py-1" required value={uploadForm.department} onChange={e => setUploadForm(f => ({...f, department: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Year</label>
                  <input className="w-full border rounded px-2 py-1" required value={uploadForm.year} onChange={e => setUploadForm(f => ({...f, year: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Type</label>
                  <select className="w-full border rounded px-2 py-1" value={uploadForm.type} onChange={e => setUploadForm(f => ({...f, type: e.target.value}))}>
                    <option value="notes">Notes</option>
                    <option value="question-paper">Question Paper</option>
                    <option value="ebook">eBook</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">File</label>
                  <input type="file" className="w-full" onChange={e => setUploadForm(f => ({...f, file: e.target.files ? e.target.files[0] : null}))} />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Preview Modal */}
      {showPreviewModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowPreviewModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-2">{selectedResource.title}</h2>
            <div className="mb-2 text-gray-600">{selectedResource.description}</div>
            <div className="mb-2"><span className="font-semibold">Subject:</span> {selectedResource.subject}</div>
            <div className="mb-2"><span className="font-semibold">Department:</span> {selectedResource.department}</div>
            <div className="mb-2"><span className="font-semibold">Year:</span> {selectedResource.year}</div>
            <div className="mb-2"><span className="font-semibold">Type:</span> {selectedResource.type}</div>
            <div className="mb-2"><span className="font-semibold">Uploaded By:</span> {selectedResource.uploadedBy}</div>
            <div className="mb-2"><span className="font-semibold">Uploaded At:</span> {formatDate(selectedResource.uploadedAt)}</div>
            <div className="mb-2"><span className="font-semibold">File:</span> {selectedResource.fileUrl}</div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={() => setShowPreviewModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyResourceHub;