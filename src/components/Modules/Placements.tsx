import React, { useState } from 'react';
import { Plus, Briefcase, Building, MapPin, DollarSign, Calendar, Clock, Filter, Search, CheckCircle, XCircle, AlertTriangle, Eye, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'internship' | 'part-time' | 'contract';
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicationDeadline: string;
  status: 'open' | 'closed' | 'filled';
  applicationsCount: number;
  companyLogo?: string;
  isApplied?: boolean;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'submitted' | 'under-review' | 'shortlisted' | 'interview-scheduled' | 'rejected' | 'selected';
  interviewDate?: string;
  feedback?: string;
  nextStep?: string;
}

const Placements: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'interviews' | 'profile'>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'JOB001',
      title: 'Software Engineer',
      company: 'TechCorp Solutions',
      location: 'Bangalore',
      type: 'full-time',
      salary: '₹8-12 LPA',
      description: 'We are looking for a passionate Software Engineer to join our dynamic team. You will be working on cutting-edge technologies and building scalable applications.',
      requirements: ['Bachelor\'s in Computer Science', '3.5+ years experience', 'Proficiency in React, Node.js', 'Strong problem-solving skills'],
      postedDate: '2025-01-20',
      applicationDeadline: '2025-02-15',
      status: 'open',
      applicationsCount: 45,
      isApplied: false,
    },
    {
      id: 'JOB002',
      title: 'Data Analyst Intern',
      company: 'DataInsights Inc',
      location: 'Mumbai',
      type: 'internship',
      salary: '₹25,000/month',
      description: 'Join our data analytics team as an intern and gain hands-on experience with real-world data projects.',
      requirements: ['Currently pursuing Bachelor\'s/Master\'s', 'Knowledge of Python, SQL', 'Understanding of statistics', 'Excel proficiency'],
      postedDate: '2025-01-18',
      applicationDeadline: '2025-02-10',
      status: 'open',
      applicationsCount: 78,
      isApplied: true,
    },
    {
      id: 'JOB003',
      title: 'Frontend Developer',
      company: 'WebCraft Studios',
      location: 'Hyderabad',
      type: 'full-time',
      salary: '₹6-9 LPA',
      description: 'Create amazing user experiences with modern frontend technologies. Work with a creative team on innovative web applications.',
      requirements: ['2+ years experience', 'Expert in React/Vue.js', 'CSS/SASS proficiency', 'UI/UX understanding'],
      postedDate: '2025-01-15',
      applicationDeadline: '2025-02-05',
      status: 'open',
      applicationsCount: 32,
      isApplied: false,
    },
    {
      id: 'JOB004',
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'Delhi',
      type: 'full-time',
      salary: '₹15-20 LPA',
      description: 'Lead product development from conception to launch. Work with cross-functional teams to deliver exceptional products.',
      requirements: ['MBA or equivalent', '5+ years experience', 'Product management experience', 'Strong analytical skills'],
      postedDate: '2025-01-12',
      applicationDeadline: '2025-01-30',
      status: 'closed',
      applicationsCount: 156,
      isApplied: false,
    },
  ]);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'APP001',
      jobId: 'JOB002',
      jobTitle: 'Data Analyst Intern',
      company: 'DataInsights Inc',
      appliedAt: '2025-01-19T10:00:00Z',
      status: 'interview-scheduled',
      interviewDate: '2025-01-28T14:00:00Z',
      nextStep: 'Technical interview with the data science team',
    },
    {
      id: 'APP002',
      jobId: 'JOB005',
      jobTitle: 'Backend Developer',
      company: 'CloudSystems Ltd',
      appliedAt: '2025-01-16T15:30:00Z',
      status: 'under-review',
      nextStep: 'Application is being reviewed by the hiring team',
    },
  ]);

  const jobTypes = ['all', 'full-time', 'internship', 'part-time', 'contract'];
  const locations = ['all', 'Bangalore', 'Mumbai', 'Hyderabad', 'Delhi', 'Chennai', 'Pune'];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'filled':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'filled':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'interview-scheduled':
        return 'bg-indigo-100 text-indigo-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'selected':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'internship':
        return 'bg-green-100 text-green-800';
      case 'part-time':
        return 'bg-yellow-100 text-yellow-800';
      case 'contract':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplyJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, isApplied: true, applicationsCount: job.applicationsCount + 1 }
        : job
    ));

    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newApplication: Application = {
        id: 'APP' + (Date.now() + Math.floor(Math.random() * 1000)),
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: new Date().toISOString(),
        status: 'submitted',
        nextStep: 'Application submitted successfully. You will be notified about the next steps.',
      };
      setApplications(prev => [newApplication, ...prev]);
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Placement Tracker</h1>
          <p className="mt-1 text-gray-600">Browse jobs, apply, and track applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Available Jobs', value: jobs.filter(j => j.status === 'open').length, color: 'bg-blue-500' },
          { label: 'Applications', value: applications.length, color: 'bg-green-500' },
          { label: 'Interviews', value: applications.filter(a => a.status === 'interview-scheduled').length, color: 'bg-purple-500' },
          { label: 'Selected', value: applications.filter(a => a.status === 'selected').length, color: 'bg-yellow-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <Briefcase className="w-6 h-6 text-white" />
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
              { key: 'jobs', label: 'Job Openings', icon: Briefcase },
              { key: 'applications', label: 'My Applications', icon: Clock },
              { key: 'interviews', label: 'Interviews', icon: Calendar },
              { key: 'profile', label: 'Profile', icon: Building },
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

        {activeTab === 'jobs' && (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
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
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Building className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(job.type)}`}>
                          {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                          <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                          <span>{job.applicationsCount} applications</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleApplyJob(job.id)}
                        disabled={job.status !== 'open' || job.isApplied}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          job.status === 'open' && !job.isApplied
                            ? 'text-white bg-blue-600 hover:bg-blue-700'
                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        }`}
                      >
                        {job.isApplied ? 'Applied' : job.status === 'open' ? 'Apply' : 'Closed'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="p-6">
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{application.jobTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Applied:</span> {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                        {application.interviewDate && (
                          <div>
                            <span className="font-medium">Interview:</span> {new Date(application.interviewDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {application.nextStep && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Next Step:</strong> {application.nextStep}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(application.status)}`}>
                      {application.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">You haven't applied to any jobs yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="p-6">
            <div className="space-y-4">
              {applications.filter(app => app.status === 'interview-scheduled').map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{application.jobTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                      
                      {application.interviewDate && (
                        <div className="flex items-center space-x-2 text-sm text-blue-800 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            <strong>Interview Date:</strong> {new Date(application.interviewDate).toLocaleDateString()} at {new Date(application.interviewDate).toLocaleTimeString()}
                          </span>
                        </div>
                      )}

                      {application.nextStep && (
                        <p className="text-sm text-blue-800">
                          <strong>Details:</strong> {application.nextStep}
                        </p>
                      )}
                    </div>
                    
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(application.status)}`}>
                      Interview Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {applications.filter(app => app.status === 'interview-scheduled').length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
                <p className="text-gray-600">Your upcoming interviews will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Management</h3>
              <p className="text-gray-600">Manage your placement profile, resume, and preferences.</p>
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
          onApply={() => {
            handleApplyJob(selectedJob.id);
            setShowJobModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onApply: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onApply }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" 
          onClick={onClose}
        >
          ×
        </button>
        
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Building className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-lg text-gray-600">{job.company}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 text-sm rounded-full ${getTypeColor(job.type)}`}>
              {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {job.applicationsCount} applications received
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={onApply}
                disabled={job.status !== 'open' || job.isApplied}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  job.status === 'open' && !job.isApplied
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
              >
                {job.isApplied ? 'Already Applied' : job.status === 'open' ? 'Apply Now' : 'Position Closed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placements;
