"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Users,
  FileText,
  Shield,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  ArrowRight,
  AlertCircle,
  Clock,
  Star,
  Eye
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
import ModeratorNavbar from '@/components/moderatorNavbar';

const ModeratorAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeView, setActiveView] = useState('overview');
  
  // Moderation activity data
  const moderationActivityData = [
    { day: 'Mon', reviewed: 45, pending: 12 },
    { day: 'Tue', reviewed: 52, pending: 8 },
    { day: 'Wed', reviewed: 48, pending: 10 },
    { day: 'Thu', reviewed: 61, pending: 5 },
    { day: 'Fri', reviewed: 55, pending: 7 },
    { day: 'Sat', reviewed: 38, pending: 9 },
    { day: 'Sun', reviewed: 42, pending: 6 }
  ];
  
  // Content types data
  const contentTypesData = [
    { type: 'Word Definitions', value: 42, color: '#3B82F6' },
    { type: 'Example Sentences', value: 28, color: '#8B5CF6' },
    { type: 'Pronunciations', value: 15, color: '#10B981' },
    { type: 'Corrections', value: 10, color: '#EF4444' },
    { type: 'Other', value: 5, color: '#F59E0B' }
  ];
  
  // Top moderators
  const topModerators = [
    { rank: 1, name: 'Alex Chen', reviewed: 245, accuracy: 94.5 },
    { rank: 2, name: 'Maria Garcia', reviewed: 198, accuracy: 92.3 },
    { rank: 3, name: 'John Smith', reviewed: 156, accuracy: 91.2 },
    { rank: 4, name: 'Lisa Wong', reviewed: 134, accuracy: 95.7 }
  ];
  
  // Queue status data
  const queueStatusData = [
    { language: 'Yoruba', pending: 15, avgTime: '2h' },
    { language: 'Igbo', pending: 8, avgTime: '1.5h' },
    { language: 'Hausa', pending: 12, avgTime: '3h' },
    { language: 'Pidgin', pending: 5, avgTime: '1h' }
  ];
  
  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];
  
  const moderatorViews = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'queue', label: 'Queue Status', icon: Clock },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'content', label: 'Content Stats', icon: FileText }
  ];
  
  // Moderator Stats Overview Cards
  const moderatorStats = [
    {
      title: 'Pending Reviews',
      value: '45',
      change: '-12.5%',
      trend: 'down',
      icon: AlertCircle,
      color: 'bg-orange-500'
    },
    {
      title: 'Reviewed Today',
      value: '52',
      change: '+18.2%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Approval Rate',
      value: '87.5%',
      change: '+3.2%',
      trend: 'up',
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      title: 'Avg. Review Time',
      value: '12m',
      change: '-2.1m',
      trend: 'down',
      icon: Clock,
      color: 'bg-purple-500'
    }
  ];
  
  const renderModeratorChart = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Moderation Activity Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
                  <p className="text-sm text-gray-600">Content reviewed vs pending</p>
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
                  <BarChart data={moderationActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" />
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
                    <Bar 
                      dataKey="reviewed" 
                      name="Reviewed"
                      fill="#10B981" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="pending" 
                      name="Pending"
                      fill="#EF4444" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Content Types Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Content Types</h3>
                  <p className="text-sm text-gray-600">Distribution of submissions</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={contentTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contentTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} items`, 'Count']}
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
        
      case 'queue':
        return (
          <div className="space-y-6">
            {/* Queue Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Language Queue Status</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm">
                  <Eye size={16} />
                  <span>View All</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3">Language</th>
                      <th className="pb-3">Pending</th>
                      <th className="pb-3">Avg. Wait Time</th>
                      <th className="pb-3">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queueStatusData.map((item, index) => {
                      const priority = item.pending > 10 ? 'High' : item.pending > 5 ? 'Medium' : 'Low';
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {item.language.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">{item.language}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.pending > 10 ? 'bg-red-100 text-red-800' :
                              item.pending > 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.pending} items
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`font-medium ${
                              item.avgTime.includes('3') ? 'text-red-600' :
                              item.avgTime.includes('2') ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {item.avgTime}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              priority === 'High' ? 'bg-red-100 text-red-800' :
                              priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {priority}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'performance':
        return (
          <div className="space-y-6">
            {/* Top Moderators */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Moderators</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
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
                      <th className="pb-3">Reviewed</th>
                      <th className="pb-3">Accuracy</th>
                      <th className="pb-3">Avg. Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topModerators.map((moderator) => (
                      <tr key={moderator.rank} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                              moderator.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                              moderator.rank === 2 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {moderator.rank}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {moderator.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{moderator.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-gray-900">{moderator.reviewed}</span>
                        </td>
                        <td className="py-4">
                          <span className={`font-medium ${
                            moderator.accuracy > 95 ? 'text-green-600' :
                            moderator.accuracy > 90 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {moderator.accuracy}%
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-500">12.4m</span>
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
            {/* Content Quality Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Quality Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Approval Rate</span>
                    <CheckCircle size={20} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">87.5%</p>
                  <p className="text-sm text-blue-700">+3.2% from last week</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900">Quality Score</span>
                    <Star size={20} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">8.7/10</p>
                  <p className="text-sm text-green-700">User feedback average</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-900">Rejection Rate</span>
                    <AlertCircle size={20} className="text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">12.5%</p>
                  <p className="text-sm text-purple-700">-1.8% improvement</p>
                </div>
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
      <ModeratorNavbar/>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Moderation Analytics</h1>
              <p className="text-amber-100 mt-2">Monitor moderation performance & queue status</p>
            </div>
            <div className='flex flex-col gap-3'>
              <div className="flex items-center space-x-4">
                <Calendar size={24} className="text-white/80" />
                <span className="text-lg font-medium">Today's Activity</span>
              </div>
              <a 
                href='/moderator/dashboard'
                className="flex items-center space-x-2 px-4 py-2 bg-white text-orange-800 rounded-lg hover:bg-amber-100 transition"
              >
                <ArrowRight size={16} />
                <span>Back to dashboard</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Moderator Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {moderatorStats.map((stat, index) => {
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
                        {stat.change}
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
              {moderatorViews.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeView === id
                      ? 'bg-white shadow-md text-orange-600 border border-orange-200'
                      : 'text-gray-700 hover:bg-white/50 hover:border hover:border-gray-200'
                  }`}
                >
                  <Icon size={20} className={activeView === id ? 'text-orange-500' : 'text-gray-500'} />
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
                          ? 'bg-orange-100 text-orange-600'
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
                    onClick={() => alert('Starting review session...')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Eye size={18} className="text-gray-500" />
                      <span>Start Reviewing</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => alert('Report generated')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Download size={18} className="text-gray-500" />
                      <span>Export Report</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analytics Content */}
          <div className="lg:col-span-3">
            {renderModeratorChart()}
            
            {/* Moderator Insights */}
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp size={24} className="text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp size={18} className="text-green-500" />
                    <span className="font-medium text-gray-900">Efficiency Up</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Average review time decreased by 2.1 minutes. Team is processing content faster.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle size={18} className="text-orange-500" />
                    <span className="font-medium text-gray-900">Queue Alert</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Yoruba content queue has 15 pending reviews. Consider prioritizing this language.
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

export default ModeratorAnalyticsPage;