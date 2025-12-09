"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Users,
  FileText,
  DollarSign,
  Shield,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  ArrowRight
} from 'lucide-react';
import {
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

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeView, setActiveView] = useState('overview');
  
  // Platform growth data
  const platformGrowthData = [
    { month: 'Jan', users: 1200, submissions: 450 },
    { month: 'Feb', users: 1450, submissions: 520 },
    { month: 'Mar', users: 1680, submissions: 610 },
    { month: 'Apr', users: 1920, submissions: 720 },
    { month: 'May', users: 2150, submissions: 810 },
    { month: 'Jun', users: 2400, submissions: 920 }
  ];
  
  // User distribution data
  const userDistributionData = [
    { role: 'Students', value: 45, color: '#3B82F6' },
    { role: 'Teachers', value: 25, color: '#8B5CF6' },
    { role: 'Professionals', value: 15, color: '#10B981' },
    { role: 'Researchers', value: 5, color: '#EF4444' }
  ];
  
  // Top contributors
  const topContributors = [
    { rank: 1, name: 'Alex Chen', submissions: 245, approved: 220 },
    { rank: 2, name: 'Maria Garcia', submissions: 198, approved: 185 },
    { rank: 3, name: 'John Smith', submissions: 156, approved: 142 },
    { rank: 4, name: 'Lisa Wong', submissions: 134, approved: 128 }
  ];
  
  // System health data
  const systemHealthData = [
    { component: 'API Response', status: 'Healthy', latency: '120ms' },
    { component: 'Database', status: 'Healthy', latency: '45ms' },
    { component: 'Authentication', status: 'Healthy', latency: '85ms' },
    { component: 'Payment Gateway', status: 'Critical', latency: '350ms' }
  ];
  
  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];
  
  const adminViews = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'system', label: 'System', icon: Shield }
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
      title: 'Approval Rate',
      value: '84.5%',
      change: '+2.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Reviews',
      value: '45',
      change: '-5.2%',
      trend: 'down',
      icon: Shield,
      color: 'bg-yellow-500'
    }
  ];
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
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
                  <p className="text-sm text-gray-600">Monthly metrics</p>
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
            
            {/* User Distribution */}
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
          </div>
        );
        
      case 'users':
        return (
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Submissions</th>
                      <th className="pb-3">Approved</th>
                      <th className="pb-3">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topContributors.map((user) => (
                      <tr key={user.rank} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                              user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                              user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {user.rank}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-blue-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-gray-900">{user.submissions}</span>
                        </td>
                        <td className="py-4">
                          <span className="font-medium text-green-600">{user.approved}</span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-500">
                            {((user.approved / user.submissions) * 100).toFixed(1)}%
                          </span>
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
            {/* Content Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Statistics</h3>
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
                    <span className="font-medium text-green-900">Daily Submissions</span>
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">92</p>
                  <p className="text-sm text-green-700">+8.2% increase</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-900">Unique Languages</span>
                    <TrendingUp size={20} className="text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">28</p>
                  <p className="text-sm text-purple-700">Active in platform</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'system':
        return (
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Health</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3">Component</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemHealthData.map((component, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              component.status === 'Healthy' ? 'bg-green-100' :
                              component.status === 'Critical' ? 'bg-red-100' : 'bg-yellow-100'
                            }`}>
                              <Shield size={16} className={
                                component.status === 'Healthy' ? 'text-green-600' :
                                component.status === 'Critical' ? 'text-red-600' : 'text-yellow-600'
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
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-yellow-100 mt-2">Monitor platform performance</p>
            </div>
            <div className='flex flex-col gap-3'>
              <div className="flex items-center space-x-4">
                <Calendar size={24} className="text-white/80" />
                <span className="text-lg font-medium">Week 48, 2024</span>
              </div>
              <a 
                href='/admin/dashboard'
                className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-800 rounded-lg hover:bg-yellow-100 transition"
              >
                <ArrowRight size={16} />
                <span>Back to main</span>
              </a>
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
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => alert('Export started')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Download size={18} className="text-gray-500" />
                      <span>Export Reports</span>
                    </div>
                  </button>
                  <a 
                    href='/settings'
                    className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield size={18} className="text-gray-500" />
                      <span>Settings</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analytics Content */}
          <div className="lg:col-span-3">
            {renderAdminChart()}
            
            {/* Admin Insights */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp size={24} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp size={18} className="text-green-500" />
                    <span className="font-medium text-gray-900">Growth Trend</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    User growth is steady at 12.5% monthly. Submissions are increasing at 8.2%.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield size={18} className="text-blue-500" />
                    <span className="font-medium text-gray-900">System Status</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Most systems are healthy. Payment gateway needs attention due to high latency.
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