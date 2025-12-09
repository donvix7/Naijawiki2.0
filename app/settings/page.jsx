"use client";

// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Palette,
  Volume2,
  Download,
  Moon,
  Sun,
  Shield,
  BookOpen,
  Target,
  Clock,
  Flag,
  Smartphone,
  Save,
  AlertCircle,
  Languages,
  RefreshCw,
  Check
} from 'lucide-react';
import CustomFooter from '@/components/customFooter';
import CustomNavbar from '@/components/navBar';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: 'Language Learner',
    email: 'learner@example.com',
    level: 'Intermediate',
    streak: 42,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LanguageLearner'
  });

  // Language Preferences
  const [learningLanguages, setLearningLanguages] = useState([
    { code: 'es', name: 'Spanish', level: 'B1', dailyGoal: 30, active: true },
    { code: 'fr', name: 'French', level: 'A2', dailyGoal: 20, active: true },
    { code: 'yo', name: 'Yoruba', level: 'Beginner', dailyGoal: 15, active: false },
    { code: 'ig', name: 'Igbo', level: 'Beginner', dailyGoal: 15, active: true }
  ]);

  const [nativeLanguage, setNativeLanguage] = useState({ code: 'en', name: 'English' });
  
  // App Settings
  const [settings, setSettings] = useState({
    theme: 'light',
    soundEffects: true,
    autoPlayAudio: true,
    showTransliteration: true,
    showRomanization: true,
    dailyReminder: true,
    reminderTime: '19:00',
    vibration: true,
    dataSaving: false,
    offlineMode: true
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    streakReminder: true,
    lessonReminder: true,
    achievement: true,
    weeklyReport: true,
    friendActivity: false,
    communityUpdates: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showStreak: true,
    showLevel: true,
    showLanguages: true,
    allowFriendRequests: true,
    allowMessages: true
  });

  // Available languages
  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  // Toggle setting
  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle notification
  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle privacy
  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  

  // Save settings
  const saveSettings = () => {
    const allSettings = {
      user,
      nativeLanguage,
      settings,
      notifications,
      privacy
    };
    localStorage.setItem('languageApp-settings', JSON.stringify(allSettings));
    
    // Show success message
    alert('Settings saved successfully!');
  };

  // Reset to defaults
  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('languageApp-settings');
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Information
              </h3>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-blue-100 dark:border-blue-900"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                    <User size={16} />
                  </button>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      Level {user.level}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                      🔥 {user.streak} day streak
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell us about your language learning journey..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Learning Style
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option>Visual Learner</option>
                    <option>Auditory Learner</option>
                    <option>Kinesthetic Learner</option>
                    <option>Mixed Style</option>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => {
                  const labels = {
                     weeklyReport: 'Weekly Progress Report',
                    communityUpdates: 'Community Updates'
                  };
                  
                  const descriptions = {
                     weeklyReport: 'Send weekly learning report',
                    communityUpdates: 'Updates from language communities'
                  };
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {labels[key]}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {descriptions[key]}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleNotification(key)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                          value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Theme
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
                  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
                  { id: 'auto', label: 'Auto', icon: RefreshCw, desc: 'Follow system' }
                ].map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setSettings({...settings, theme: id})}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      settings.theme === id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        settings.theme === id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Text Size
              </h3>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  {['Small', 'Medium', 'Large', 'X-Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {}}
                      className="flex-1 py-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500"
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      High Contrast Mode
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Enhanced visibility
                    </div>
                  </div>
                  <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600">
                    <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-1" />
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Privacy Settings
              </h3>
              
              <div className="space-y-4">
                {Object.entries(privacy).map(([key, value]) => {
                  const labels = {
                    profilePublic: 'Public Profile',
                    allowMessages: 'Allow Messages'
                  };
                  
                  const descriptions = {
                    profilePublic: 'Make your profile visible to other learners',
                    allowMessages: 'Allow users to send you direct messages'
                  };
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {labels[key]}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {descriptions[key]}
                        </div> 
                      </div>
                      <button
                        onClick={() => togglePrivacy(key)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                          value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Data Management
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => alert('Data exported!')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Download size={20} className="text-gray-600 dark:text-gray-400" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">Export My Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Download all your learning data</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('This will delete all your data permanently. Are you sure?')) {
                      alert('Account deletion initiated');
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
      <CustomNavbar/>
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className='text-white'>
              <h1 className="text-3xl font-bold"> Settings</h1>
              <p className=" mt-2">Customize your learning experience</p>
            </div>
            <SettingsIcon size={32} className="" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
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
              
              {/* Action Buttons */}
              <div className="pt-6 space-y-3">
                <button
                  onClick={saveSettings}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  <Save size={20} />
                  <span>Save All Changes</span>
                </button>
                
                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <RefreshCw size={20} />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <CustomFooter/>
    </div>
  );
};

export default SettingsPage;