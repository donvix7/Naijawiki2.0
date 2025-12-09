"use client";

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Save,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  Download,
  Globe,
  Lock
} from 'lucide-react';
import CustomFooter from '@/components/customFooter';
import CustomNavbar from '@/components/navBar';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // User profile state
  const [profile, setProfile] = useState({
    displayName: 'Language Learner',
    email: 'learner@example.com',
    bio: '',
    language: 'en'
  });
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: true,
    weeklyReports: true,
    communityUpdates: false
  });
  
  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    reduceAnimations: false
  });
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    allowMessages: true,
    dataSharing: false
  });

  // Available languages for interface
  const interfaceLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  // Update profile field
  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Toggle notification setting
  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Update appearance setting
  const updateAppearance = (key, value) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  // Update privacy setting
  const updatePrivacy = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      profile,
      notifications,
      appearance,
      privacy
    };
    localStorage.setItem('app-settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  // Reset settings to defaults
  const resetSettings = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      localStorage.removeItem('app-settings');
      window.location.reload();
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Profile Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => updateProfile('displayName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interface Language
                  </label>
                  <select
                    value={profile.language}
                    onChange={(e) => updateProfile('language', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {interfaceLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email Updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Receive email notifications</div>
                  </div>
                  <button
                    onClick={() => toggleNotification('emailUpdates')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      notifications.emailUpdates ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      notifications.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Browser notifications</div>
                  </div>
                  <button
                    onClick={() => toggleNotification('pushNotifications')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      notifications.pushNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Weekly Reports</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Weekly progress summary</div>
                  </div>
                  <button
                    onClick={() => toggleNotification('weeklyReports')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      notifications.weeklyReports ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Community Updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Updates from community</div>
                  </div>
                  <button
                    onClick={() => toggleNotification('communityUpdates')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      notifications.communityUpdates ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      notifications.communityUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Theme Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => updateAppearance('theme', 'light')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    appearance.theme === 'light' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      appearance.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Sun size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Light</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Clean and bright</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => updateAppearance('theme', 'dark')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    appearance.theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      appearance.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Moon size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Dark</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Easy on the eyes</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => updateAppearance('theme', 'auto')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    appearance.theme === 'auto' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      appearance.theme === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Globe size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">System</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Follow system</div>
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Size
                  </label>
                  <select
                    value={appearance.fontSize}
                    onChange={(e) => updateAppearance('fontSize', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Reduce Animations</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Minimize motion effects</div>
                  </div>
                  <button
                    onClick={() => updateAppearance('reduceAnimations', !appearance.reduceAnimations)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      appearance.reduceAnimations ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      appearance.reduceAnimations ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Privacy Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => updatePrivacy('profileVisibility', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Allow Messages</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Allow users to message you</div>
                  </div>
                  <button
                    onClick={() => updatePrivacy('allowMessages', !privacy.allowMessages)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      privacy.allowMessages ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      privacy.allowMessages ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Data Sharing</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Help improve the app</div>
                  </div>
                  <button
                    onClick={() => updatePrivacy('dataSharing', !privacy.dataSharing)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      privacy.dataSharing ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Data Management
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => alert('Data export started!')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Download size={20} className="text-gray-600 dark:text-gray-400" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Download your data</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Delete all your data? This cannot be undone.')) {
                      alert('Account deletion started');
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                    <div className="text-left">
                      <div className="font-medium text-red-700 dark:text-red-300">Delete Account</div>
                      <div className="text-sm text-red-600 dark:text-red-400">Permanently delete all data</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <CustomNavbar />
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-blue-100 mt-2">Customize your experience</p>
            </div>
            <SettingsIcon size={32} className="text-white/80" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeTab === id
                      ? 'bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              
              <div className="pt-6 space-y-3">
                <button
                  onClick={saveSettings}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  <Save size={20} />
                  <span>Save Changes</span>
                </button>
                
                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <RefreshCw size={20} />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </main>
      
      <CustomFooter />
    </div>
  );
};

export default SettingsPage;