import React, { useState } from 'react';
import { Plus, Award, Star, TrendingUp, Target, BookOpen, Code, Palette, Users, Zap, Edit, Trash2, Filter, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'creative' | 'academic';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiency: number; // 0-100
  description?: string;
  certifications?: string[];
  projects?: string[];
  addedAt: string;
  lastUpdated: string;
}

interface SkillGoal {
  id: string;
  skillName: string;
  currentLevel: string;
  targetLevel: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

const Skills: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'skills' | 'goals' | 'recommendations'>('skills');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 'SKILL001',
      name: 'JavaScript',
      category: 'technical',
      level: 'advanced',
      proficiency: 85,
      description: 'Proficient in modern JavaScript, ES6+, async/await, and frameworks',
      certifications: ['JavaScript Algorithms and Data Structures'],
      projects: ['E-commerce Website', 'Task Management App'],
      addedAt: '2024-01-15T10:00:00Z',
      lastUpdated: '2025-01-20T14:30:00Z',
    },
    {
      id: 'SKILL002',
      name: 'React',
      category: 'technical',
      level: 'advanced',
      proficiency: 80,
      description: 'Building complex web applications with React, Redux, and hooks',
      certifications: ['React Developer Certification'],
      projects: ['Campus Portal', 'Social Media Dashboard'],
      addedAt: '2024-02-10T09:00:00Z',
      lastUpdated: '2025-01-18T16:45:00Z',
    },
    {
      id: 'SKILL003',
      name: 'Python',
      category: 'technical',
      level: 'intermediate',
      proficiency: 70,
      description: 'Data analysis, web development with Django/Flask, and automation',
      certifications: ['Python for Data Science'],
      projects: ['Data Analysis Tool', 'Web Scraper'],
      addedAt: '2024-03-05T11:30:00Z',
      lastUpdated: '2025-01-15T12:20:00Z',
    },
    {
      id: 'SKILL004',
      name: 'Communication',
      category: 'soft',
      level: 'advanced',
      proficiency: 88,
      description: 'Excellent verbal and written communication skills',
      certifications: ['Public Speaking Certificate'],
      projects: ['Team Lead Projects', 'Presentation Workshops'],
      addedAt: '2024-01-20T08:00:00Z',
      lastUpdated: '2025-01-10T10:15:00Z',
    },
    {
      id: 'SKILL005',
      name: 'Leadership',
      category: 'soft',
      level: 'intermediate',
      proficiency: 75,
      description: 'Leading teams and managing projects effectively',
      projects: ['Student Council President', 'Hackathon Team Lead'],
      addedAt: '2024-04-12T14:00:00Z',
      lastUpdated: '2025-01-12T09:30:00Z',
    },
    {
      id: 'SKILL006',
      name: 'Spanish',
      category: 'language',
      level: 'intermediate',
      proficiency: 65,
      description: 'Conversational Spanish with focus on business communication',
      certifications: ['DELE B2 Certificate'],
      addedAt: '2024-05-01T16:00:00Z',
      lastUpdated: '2025-01-08T11:45:00Z',
    },
    {
      id: 'SKILL007',
      name: 'UI/UX Design',
      category: 'creative',
      level: 'intermediate',
      proficiency: 72,
      description: 'Creating user-centered designs with Figma and Adobe XD',
      certifications: ['Google UX Design Certificate'],
      projects: ['Mobile App Redesign', 'Website UI Overhaul'],
      addedAt: '2024-06-15T13:20:00Z',
      lastUpdated: '2025-01-05T15:10:00Z',
    },
    {
      id: 'SKILL008',
      name: 'Data Structures & Algorithms',
      category: 'academic',
      level: 'advanced',
      proficiency: 82,
      description: 'Strong foundation in DSA with competitive programming experience',
      certifications: ['Data Structures Specialization'],
      projects: ['Algorithm Visualizer', 'Competitive Programming Solutions'],
      addedAt: '2024-02-28T10:45:00Z',
      lastUpdated: '2025-01-22T13:25:00Z',
    },
  ]);

  const [skillGoals, setSkillGoals] = useState<SkillGoal[]>([
    {
      id: 'GOAL001',
      skillName: 'Machine Learning',
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      targetDate: '2025-06-30',
      progress: 35,
      status: 'active',
    },
    {
      id: 'GOAL002',
      skillName: 'Node.js',
      currentLevel: 'beginner',
      targetLevel: 'advanced',
      targetDate: '2025-08-15',
      progress: 20,
      status: 'active',
    },
    {
      id: 'GOAL003',
      skillName: 'German',
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      targetDate: '2025-12-31',
      progress: 15,
      status: 'active',
    },
  ]);

  const categories = ['all', 'technical', 'soft', 'language', 'creative', 'academic'];

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Code className="w-5 h-5" />;
      case 'soft':
        return <Users className="w-5 h-5" />;
      case 'language':
        return <BookOpen className="w-5 h-5" />;
      case 'creative':
        return <Palette className="w-5 h-5" />;
      case 'academic':
        return <Award className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'soft':
        return 'bg-green-100 text-green-800';
      case 'language':
        return 'bg-purple-100 text-purple-800';
      case 'creative':
        return 'bg-pink-100 text-pink-800';
      case 'academic':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-red-100 text-red-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      case 'expert':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'bg-green-500';
    if (proficiency >= 60) return 'bg-blue-500';
    if (proficiency >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleAddSkill = (skillData: any) => {
    const newSkill: Skill = {
      id: 'SKILL' + (Date.now() + Math.floor(Math.random() * 1000)),
      ...skillData,
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setSkills(prev => [newSkill, ...prev]);
    setShowAddModal(false);
    setEditingSkill(null);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setShowAddModal(true);
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const handleAddGoal = (goalData: any) => {
    const newGoal: SkillGoal = {
      id: 'GOAL' + (Date.now() + Math.floor(Math.random() * 1000)),
      ...goalData,
      progress: 0,
      status: 'active',
    };
    setSkillGoals(prev => [newGoal, ...prev]);
    setShowGoalModal(false);
  };

  const getSkillStats = () => {
    const totalSkills = skills.length;
    const expertSkills = skills.filter(s => s.level === 'expert').length;
    const advancedSkills = skills.filter(s => s.level === 'advanced').length;
    const averageProficiency = skills.reduce((sum, skill) => sum + skill.proficiency, 0) / totalSkills;
    
    return {
      totalSkills,
      expertSkills,
      advancedSkills,
      averageProficiency: Math.round(averageProficiency),
    };
  };

  const stats = getSkillStats();

  const recommendedSkills = [
    { name: 'Docker', category: 'technical', reason: 'Complements your backend development skills' },
    { name: 'AWS', category: 'technical', reason: 'Essential for cloud deployment' },
    { name: 'TypeScript', category: 'technical', reason: 'Natural progression from JavaScript' },
    { name: 'Project Management', category: 'soft', reason: 'Builds on your leadership skills' },
    { name: 'French', category: 'language', reason: 'Adds to your language portfolio' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills Portfolio</h1>
          <p className="mt-1 text-gray-600">Track and develop your professional skills</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowGoalModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
          >
            <Target className="w-4 h-4 mr-2" />
            Add Goal
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Skills', value: stats.totalSkills, color: 'bg-blue-500', icon: Award },
          { label: 'Expert Level', value: stats.expertSkills, color: 'bg-green-500', icon: Star },
          { label: 'Advanced Level', value: stats.advancedSkills, color: 'bg-purple-500', icon: TrendingUp },
          { label: 'Avg Proficiency', value: `${stats.averageProficiency}%`, color: 'bg-orange-500', icon: Target },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
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
              { key: 'skills', label: 'My Skills', icon: Award },
              { key: 'goals', label: 'Learning Goals', icon: Target },
              { key: 'recommendations', label: 'Recommendations', icon: TrendingUp },
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

        {activeTab === 'skills' && (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
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
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <div key={skill.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${getCategoryColor(skill.category)} p-2 rounded-lg`}>
                        {getCategoryIcon(skill.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(skill.category)}`}>
                            {skill.category}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Proficiency Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Proficiency</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)}`}
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>

                  {skill.description && (
                    <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                  )}

                  {skill.certifications && skill.certifications.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {skill.certifications.map((cert, index) => (
                          <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skill.projects && skill.projects.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Projects:</p>
                      <div className="flex flex-wrap gap-1">
                        {skill.projects.map((project, index) => (
                          <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredSkills.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or add a new skill.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="p-6">
            <div className="space-y-4">
              {skillGoals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.skillName}</h3>
                      <p className="text-sm text-gray-600">
                        {goal.currentLevel} → {goal.targetLevel} by {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      goal.status === 'active' ? 'bg-green-100 text-green-800' :
                      goal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {skillGoals.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No learning goals set</h3>
                <p className="text-gray-600">Set learning goals to track your skill development progress.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="p-6">
            <div className="space-y-4">
              {recommendedSkills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${getCategoryColor(skill.category)} p-2 rounded-lg`}>
                        {getCategoryIcon(skill.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <p className="text-sm text-gray-600">{skill.reason}</p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getCategoryColor(skill.category)}`}>
                          {skill.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Skill Modal */}
      {showAddModal && (
        <AddSkillModal
          skill={editingSkill}
          onClose={() => {
            setShowAddModal(false);
            setEditingSkill(null);
          }}
          onSave={handleAddSkill}
        />
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <AddGoalModal
          onClose={() => setShowGoalModal(false)}
          onSave={handleAddGoal}
        />
      )}
    </div>
  );
};

interface AddSkillModalProps {
  skill?: Skill | null;
  onClose: () => void;
  onSave: (skill: any) => void;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({ skill, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || 'technical',
    level: skill?.level || 'beginner',
    proficiency: skill?.proficiency || 0,
    description: skill?.description || '',
    certifications: skill?.certifications?.join(', ') || '',
    projects: skill?.projects?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      certifications: formData.certifications ? formData.certifications.split(',').map(s => s.trim()) : [],
      projects: formData.projects ? formData.projects.split(',').map(s => s.trim()) : [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{skill ? 'Edit Skill' : 'Add New Skill'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="technical">Technical</option>
              <option value="soft">Soft Skills</option>
              <option value="language">Language</option>
              <option value="creative">Creative</option>
              <option value="academic">Academic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Proficiency ({formData.proficiency}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.proficiency}
              onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Certifications (comma-separated)</label>
            <input
              type="text"
              value={formData.certifications}
              onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., AWS Certified, Google Analytics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Projects (comma-separated)</label>
            <input
              type="text"
              value={formData.projects}
              onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., E-commerce App, Portfolio Website"
            />
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
              {skill ? 'Update' : 'Add'} Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddGoalModalProps {
  onClose: () => void;
  onSave: (goal: any) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    skillName: '',
    currentLevel: 'beginner',
    targetLevel: 'intermediate',
    targetDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Learning Goal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Skill Name</label>
            <input
              type="text"
              value={formData.skillName}
              onChange={(e) => setFormData(prev => ({ ...prev, skillName: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Machine Learning"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Level</label>
              <select
                value={formData.currentLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, currentLevel: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Level</label>
              <select
                value={formData.targetLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, targetLevel: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Skills;
