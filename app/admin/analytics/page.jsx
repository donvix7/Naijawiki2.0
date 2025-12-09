"use client";

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Users,
  Globe,
  Activity,
  Zap,
  Trophy,
  Star,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus,
  FileText,
  DollarSign,
  Shield,
  BookOpen,
  Languages,
  MessageSquare,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import AdminNavbar from '@/components/adminNavbar';
import AdminSidebar from '@/components/adminSideBar';

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Mock admin-specific data
  const platformGrowthData = [
    { month: 'Jan', users: 1200, submissions: 450, revenue: 12000 },
    { month: 'Feb', users: 1450, submissions: 520, revenue: 14500 },
    { month: 'Mar', users: 1680, submissions: 610, revenue: 16800 },
    { month: 'Apr', users: 1920, submissions: 720, revenue: 19200 },
    { month: 'May', users: 2150, submissions: 810, revenue: 21500 },
    { month: 'Jun', users: 2400, submissions: 920, revenue: 24000 },
    { month: 'Jul', users: 2650, submissions: 1050, revenue: 26500 }
  ];
  
  const userDistributionData = [
    { role: 'Students', value: 45, color: '#3B82F6' },
    { role: 'Teachers', value: 25, color: '#8B5CF6' },
    { role: 'Professionals', value: 15, color: '#10B981' },
    { role: 'Casual Learners', value: 10, color: '#F59E0B' },
    { role: 'Researchers', value: 5, color: '#EF4444' }
  ];
  
  const languagePopularityData = [
    { language: 'Spanish', users: 1200, submissions: 450, color: '#3B82F6' },
    { language: 'French', users: 980, submissions: 320, color: '#8B5CF6' },
    { language: 'Yoruba', users: 750, submissions: 280, color: '#10B981' },
    { language: 'Japanese', users: 620, submissions: 210, color: '#EF4444' },
    { language: 'Arabic', users: 540, submissions: 180, color: '#F59E0B' },
    { language: 'German', users: 420, submissions: 150, color: '#8B5CF6' }
  ];
  
  const activityByTimeData = [
    { time: '6AM', users: 120, submissions: 45 },
    { time: '9AM', users: 450, submissions: 180 },
    { time: '12PM', users: 680, submissions: 320 },
    { time: '3PM', users: 520, submissions: 240 },
    { time: '6PM', users: 890, submissions: 420 },
    { time: '9PM', users: 720, submissions: 380 },
    { time: '12AM', users: 210, submissions: 95 }
  ];
  
  const pendingReviewsData = [
    { category: 'Word Submissions', count: 45, avgTime: '2h', priority: 'High' },
    { category: 'User Reports', count: 12, avgTime: '4h', priority: 'Medium' },
    { category: 'Content Flags', count: 8, avgTime: '6h', priority: 'High' },
    { category: 'Feature Requests', count: 23, avgTime: '24h', priority: 'Low' },
    { category: 'Bug Reports', count: 5, avgTime: '8h', priority: 'High' }
  ];
  
  const revenueData = [
    { month: 'Jan', subscriptions: 1200, marketplace: 450, total: 1650 },
    { month: 'Feb', subscriptions: 1450, marketplace: 520, total: 1970 },
    { month: 'Mar', subscriptions: 1680, marketplace: 610, total: 2290 },
    { month: 'Apr', subscriptions: 1920, marketplace: 720, total: 2640 },
    { month: 'May', subscriptions: 2150, marketplace: 810, total: 2960 },
    { month: 'Jun', subscriptions: 2400, marketplace: 920, total: 3320 }
  ];
  
  const userEngagementData = [
    { metric: 'Daily Active Users', value: '2,450', change: '+12%', trend: 'up' },
    { metric: 'Avg Session Duration', value: '24m', change: '+8%', trend: 'up' },
    { metric: 'Lesson Completion', value: '78%', change: '+5%', trend: 'up' },
    { metric: 'User Retention', value: '65%', change: '-3%', trend: 'down' },
    { metric: 'Churn Rate', value: '4.2%', change: '-0.8%', trend: 'down' }
  ];
  
  const topContributors = [
    { rank: 1, name: 'Alex Chen', role: 'Teacher', submissions: 245, approved: 220, languages: 5 },
    { rank: 2, name: 'Maria Garcia', role: 'Linguist', submissions: 198, approved: 185, languages: 4 },
    { rank: 3, name: 'John Smith', role: 'Student', submissions: 156, approved: 142, languages: 3 },
    { rank: 4, name: 'Lisa Wong', role: 'Researcher', submissions: 134, approved: 128, languages: 2 },
    { rank: 5, name: 'David Kim', role: 'Professional', submissions: 112, approved: 98, languages: 4 }
  ];
  
  const systemHealthData = [
    { component: 'API Response', status: 'Healthy', latency: '120ms', uptime: '99.9%' },
    { component: 'Database', status: 'Healthy', latency: '45ms', uptime: '99.95%' },
    { component: 'CDN', status: 'Warning', latency: '210ms', uptime: '99.8%' },
    { component: 'Authentication', status: 'Healthy', latency: '85ms', uptime: '99.9%' },
    { component: 'Payment Gateway', status: 'Critical', latency: '350ms', uptime: '99.5%' }
  ];
  
  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];
  
  const adminViews = [
    { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
    { id: 'users', label: 'User Analytics', icon: Users },
    { id: 'content', label: 'Content Analytics', icon: FileText },
    { id: 'revenue', label: 'Revenue & Finance', icon: DollarSign },
    { id: 'system', label: 'System Health', icon: Shield },
    { id: 'moderation', label: 'Moderation Queue', icon: CheckCircle }
  ];
  
  // Admin Stats Overview Cards
  const adminStats = [
    {
      title: 'Total Users',
      value: '2,650',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Daily Submissions',
      value: '92',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: '$26.5K',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Reviews',
      value: '45',
      change: '-5.2%',
      trend: 'down',
      icon: CheckCircle,
      color: 'bg-yellow-500'
    }
  ];
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const renderAdminChart = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Platform Growth Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
                  <p className="text-sm text-gray-600">Monthly growth metrics</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter size={18} className="text-gray-500" />
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    {timeRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platformGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                        if (name === 'users') return [`${value} users`, 'Users'];
                        return [`${value} submissions`, 'Submissions'];
                      }}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      name="Users"
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="submissions" 
                      name="Submissions"
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* User Distribution & Language Popularity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#374151',
                          borderRadius: '8px'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Language Popularity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={languagePopularityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="language" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="users" name="Active Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="submissions" name="Submissions" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'users':
        return (
          <div className="space-y-6">
            {/* User Engagement Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">User Engagement Metrics</h3>
              <div className="space-y-4">
                {userEngagementData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{item.value}</span>
                        <span className={`text-sm font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.trend === 'up' ? <ChevronUp size={16} className="inline" /> : <ChevronDown size={16} className="inline" />}
                          {item.change}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.trend === 'up' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ 
                          width: item.metric === 'Churn Rate' 
                            ? `${parseFloat(item.value) * 20}%` 
                            : `${parseFloat(item.value.replace('%', '').replace('m', ''))}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Contributors */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Download size={16} />
                  <span>Export List</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">Contributor</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Submissions</th>
                      <th className="pb-3">Approved</th>
                      <th className="pb-3">Languages</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topContributors.map((user) => (
                      <tr key={user.rank} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            {user.rank <= 3 ? (
                              <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                                user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {user.rank}
                              </span>
                            ) : (
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                                {user.rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-blue-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 block">{user.name}</span>
                              <span className="text-sm text-gray-500">{user.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-gray-900">{user.submissions}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-green-600">{user.approved}</span>
                            <span className="text-sm text-gray-500">
                              ({((user.approved / user.submissions) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {user.languages} languages
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors" title="View Profile">
                              <Eye size={16} />
                            </button>
                            <button className="p-1.5 text-gray-600 hover:text-green-600 transition-colors" title="Message">
                              <MessageSquare size={16} />
                            </button>
                            <button className="p-1.5 text-gray-600 hover:text-yellow-600 transition-colors" title="Edit Permissions">
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'content':
        return (
          <div className="space-y-6">
            {/* Content Activity by Time */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Activity by Time of Day</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityByTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="users" name="Active Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="submissions" name="Submissions" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Content Quality Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Quality Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Approval Rate</span>
                    <CheckCircle size={20} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">84.5%</p>
                  <p className="text-sm text-blue-700">+2.3% from last month</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900">Avg Review Time</span>
                    <Clock size={20} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">3.2h</p>
                  <p className="text-sm text-green-700">-0.8h faster</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-900">Content Duplicates</span>
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">2.1%</p>
                  <p className="text-sm text-purple-700">-0.5% from last month</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'revenue':
        return (
          <div className="space-y-6">
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
                  <p className="text-sm text-gray-600">Monthly revenue streams</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(3320)}</p>
                  <p className="text-sm text-green-600">+15.3% from last month</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'total') return [formatCurrency(value), 'Total Revenue'];
                        if (name === 'subscriptions') return [formatCurrency(value), 'Subscriptions'];
                        return [formatCurrency(value), 'Marketplace'];
                      }}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="subscriptions" name="Subscriptions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="marketplace" name="Marketplace" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      name="Total Revenue"
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">MRR</span>
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(26500)}</p>
                <p className="text-xs text-green-600">+12.5% growth</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">ARR</span>
                  <DollarSign size={16} className="text-blue-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(318000)}</p>
                <p className="text-xs text-blue-600">Projected</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Avg. Revenue/User</span>
                  <Users size={16} className="text-purple-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(10)}</p>
                <p className="text-xs text-purple-600">+$1.20 from last month</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <TrendingUp size={16} className="text-yellow-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">4.8%</p>
                <p className="text-xs text-yellow-600">+0.3% improvement</p>
              </div>
            </div>
          </div>
        );
        
      case 'system':
        return (
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Health Dashboard</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3">Component</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Latency</th>
                      <th className="pb-3">Uptime</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemHealthData.map((component, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              component.status === 'Healthy' ? 'bg-green-100' :
                              component.status === 'Warning' ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              <Shield size={16} className={
                                component.status === 'Healthy' ? 'text-green-600' :
                                component.status === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                              } />
                            </div>
                            <span className="font-medium text-gray-900">{component.component}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(component.status)}`}>
                            {component.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`font-medium ${
                            parseFloat(component.latency) > 300 ? 'text-red-600' :
                            parseFloat(component.latency) > 200 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {component.latency}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="font-medium text-gray-900">{component.uptime}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors" title="View Logs">
                              <FileText size={16} />
                            </button>
                            <button className="p-1.5 text-gray-600 hover:text-yellow-600 transition-colors" title="Restart">
                              <RefreshCw size={16} />
                            </button>
                            <button className="p-1.5 text-gray-600 hover:text-red-600 transition-colors" title="Alert">
                              <XCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'moderation':
        return (
          <div className="space-y-6">
            {/* Pending Reviews */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Moderation Queue</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <CheckCircle size={16} />
                  <span>Process Batch</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {pendingReviewsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{item.category}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Pending:</span>
                          <span className="font-bold text-gray-900">{item.count}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Avg. Time:</span>
                          <span className="font-medium text-gray-900">{item.avgTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        Review
                      </button>
                      <button className="p-1.5 text-gray-600 hover:text-red-600 transition-colors" title="Dismiss">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <AdminNavbar/>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold"> Aalytics Dashboard</h1>
              <p className="text-blue-100 mt-2">Monitor platform performance and user engagement</p>
            </div>
            <div className='flex flex-col gap-3'>
                <div className="flex items-center space-x-4">
                <Calendar size={24} className="text-white/80" />
                <span className="text-lg font-medium">Week 48, 2024</span>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-800 rounded-lg hover:bg-yellow-100 transition">
                    <a href='/admin/dashboard'>
                    <ArrowRight size={16} />
                    <span>Back to main</span>
                    </a>

                </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Admin Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ChevronUp size={16} className="text-green-500" />
                      ) : (
                        <ChevronDown size={16} className="text-red-500" />
                      )}
                      <span className={`text-sm font-medium ml-1 ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change} this month
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {adminViews.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeView === id
                      ? 'bg-white shadow-md text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-white/50 hover:border hover:border-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              
              {/* Time Range Selector */}
              <div className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Time Range</h3>
                <div className="space-y-2">
                  {timeRangeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRange(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        timeRange === option.value
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Admin Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow transition">
                    <div className="flex items-center space-x-3">
                      <Download size={18} className="text-gray-500" />
                      <span>Export Reports</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow transition">
                    <div className="flex items-center space-x-3">
                      <UserPlus size={18} className="text-gray-500" />
                      <span>Add Moderator</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow transition">
                      <a href='/settings'>
                    
                    <div className="flex items-center space-x-3">
                        <Shield size={18} className="text-gray-500" />
                      <span>System Settings</span>
                    </div>
                      </a>

                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analytics Content */}
          <div className="lg:col-span-3">
            {renderAdminChart()}
            
            {/* Admin Insights Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Activity size={24} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Admin Insights</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp size={18} className="text-green-500" />
                    <span className="font-medium text-gray-900">Peak Usage Times</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Platform sees highest activity between 6-9 PM. Consider scheduling maintenance outside these hours.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target size={18} className="text-blue-500" />
                    <span className="font-medium text-gray-900">Content Review Backlog</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Word submissions are growing 25% faster than review capacity. Consider adding more moderators.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign size={18} className="text-purple-500" />
                    <span className="font-medium text-gray-900">Revenue Growth</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Subscription revenue growing steadily. Marketplace sales show potential for 40% growth with marketing.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe size={18} className="text-yellow-500" />
                    <span className="font-medium text-gray-900">Regional Opportunities</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Strong growth in African language learners. Consider partnerships with educational institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalyticsPage;