"use client";

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Video,
  FileText,
  Globe,
  Users,
  Settings,
  Smartphone,
  CreditCard,
  Shield,
  Download,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  ExternalLink,
  Filter,
  Star,
  Bookmark,
  AlertCircle,
  CheckCircle,
  Zap,
  TrendingUp,
  Lock,
  UserPlus,
  Languages,
  Headphones,
  Eye
} from 'lucide-react';
import CustomNavbar from '@/components/navBar';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      color: 'bg-blue-500',
      description: 'New user guides and basics'
    },
    {
      id: 'learning',
      title: 'Learning Features',
      icon: BookOpen,
      color: 'bg-purple-500',
      description: 'How to use learning tools'
    },
    {
      id: 'account',
      title: 'Account & Settings',
      icon: Settings,
      color: 'bg-green-500',
      description: 'Manage your account'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Smartphone,
      color: 'bg-orange-500',
      description: 'Troubleshooting guides'
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: CreditCard,
      color: 'bg-red-500',
      description: 'Payment and subscription help'
    },
    {
      id: 'community',
      title: 'Community & Social',
      icon: Users,
      color: 'bg-pink-500',
      description: 'Connect with others'
    }
  ];

  const articles = {
    'getting-started': [
      {
        id: 'create-account',
        title: 'Creating Your Account',
        content: `
          <h3>Sign Up Process</h3>
          <p>Getting started with our language learning platform is simple:</p>
          <ol>
            <li>Click the "Sign Up" button in the top right corner</li>
            <li>Choose your sign-up method:
              <ul>
                <li>Email and password</li>
                <li>Google account</li>
                <li>Apple ID</li>
              </ul>
            </li>
            <li>Verify your email address (check your inbox)</li>
            <li>Complete your profile setup</li>
          </ol>
          
          <h3>Profile Setup</h3>
          <p>After creating your account, we recommend completing your profile:</p>
          <ul>
            <li><strong>Choose your native language</strong> - This helps personalize your experience</li>
            <li><strong>Select languages to learn</strong> - You can learn multiple languages simultaneously</li>
            <li><strong>Set learning goals</strong> - Define your daily time commitment</li>
            <li><strong>Upload a profile picture</strong> (optional)</li>
          </ul>
          
          <h3>Platform Tour</h3>
          <p>Take our interactive tour to learn about key features:</p>
          <ul>
            <li>Dashboard navigation</li>
            <li>Lesson structure</li>
            <li>Progress tracking</li>
            <li>Community features</li>
          </ul>
        `,
        tags: ['beginner', 'setup', 'account'],
        popularity: 95,
        lastUpdated: '2024-01-15'
      },
      {
        id: 'first-lesson',
        title: 'Taking Your First Lesson',
        content: `
          <h3>Lesson Structure</h3>
          <p>Each lesson is designed to be interactive and engaging:</p>
          <ul>
            <li><strong>Vocabulary Introduction</strong> - Learn new words with images and audio</li>
            <li><strong>Listening Exercises</strong> - Practice understanding spoken language</li>
            <li><strong>Speaking Practice</strong> - Use our speech recognition to practice pronunciation</li>
            <li><strong>Writing Exercises</strong> - Practice writing characters or sentences</li>
            <li><strong>Grammar Points</strong> - Learn important grammar rules in context</li>
          </ul>
          
          <h3>Tips for Success</h3>
          <ul>
            <li>Complete lessons in order - they build on previous knowledge</li>
            <li>Use headphones for best audio quality</li>
            <li>Speak clearly during pronunciation exercises</li>
            <li>Review vocabulary regularly using our spaced repetition system</li>
            <li>Take notes in your digital notebook</li>
          </ul>
          
          <h3>Lesson Navigation</h3>
          <p>Use the following controls during lessons:</p>
          <ul>
            <li><strong>Play/Pause</strong> - Control audio playback</li>
            <li><strong>Repeat</strong> - Listen to audio again</li>
            <li><strong>Slow Down</strong> - Reduce audio speed for difficult passages</li>
            <li><strong>Transcript</strong> - View text of audio content</li>
            <li><strong>Hint</strong> - Get help with difficult questions</li>
          </ul>
        `,
        tags: ['lessons', 'beginner', 'practice'],
        popularity: 88,
        lastUpdated: '2024-01-10'
      },
      {
        id: 'language-selection',
        title: 'Choosing Languages to Learn',
        content: `
          <h3>Available Languages</h3>
          <p>We offer 50+ languages including:</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            
            <div class="bg-gray-100 p-2 rounded">Yoruba 🇳🇬</div>
            <div class="bg-gray-100 p-2 rounded">Igbo 🇳🇬</div>
            <div class="bg-gray-100 p-2 rounded">Hausa 🇳🇬</div>
          </div>
          
          <h3>How to Choose</h3>
          <p>Consider these factors when selecting languages:</p>
          <ul>
            <li><strong>Your Goals</strong> - Travel, work, cultural interest</li>
            <li><strong>Time Commitment</strong> - Some languages require more study time</li>
            <li><strong>Language Family</strong> - Related languages are easier to learn together</li>
            <li><strong>Available Content</strong> - Check our course catalog for available materials</li>
          </ul>
          
          <h3>Adding/Removing Languages</h3>
          <p>You can manage your languages at any time:</p>
          <ol>
            <li>Go to Settings > Languages</li>
            <li>Click "Add Language" to browse available options</li>
            <li>Use the toggle to activate/deactivate languages</li>
            <li>Set daily goals for each active language</li>
          </ol>
        `,
        tags: ['languages', 'selection', 'setup'],
        popularity: 76,
        lastUpdated: '2024-01-05'
      }
    ],
    'learning': [
      {
        id: 'speech-recognition',
        title: 'Using Speech Recognition',
        content: `
          <h3>How It Works</h3>
          <p>Our advanced speech recognition technology:</p>
          <ul>
            <li>Analyzes your pronunciation in real-time</li>
            <li>Compares with native speaker samples</li>
            <li>Provides instant feedback on accuracy</li>
            <li>Tracks improvement over time</li>
          </ul>
          
          <h3>Tips for Better Results</h3>
          <ul>
            <li>Use a quiet environment</li>
            <li>Speak clearly and at normal pace</li>
            <li>Use headphones with a built-in microphone</li>
            <li>Practice difficult sounds multiple times</li>
            <li>Check microphone permissions in browser settings</li>
          </ul>
          
          <h3>Troubleshooting</h3>
          <p>If speech recognition isn't working:</p>
          <ol>
            <li>Check browser microphone permissions</li>
            <li>Try a different browser (Chrome works best)</li>
            <li>Update your browser to latest version</li>
            <li>Test microphone in system settings</li>
            <li>Try our mobile app for better results</li>
          </ol>
        `,
        tags: ['speech', 'pronunciation', 'technical'],
        popularity: 92,
        lastUpdated: '2024-01-12'
      },
      {
        id: 'spaced-repetition',
        title: 'Spaced Repetition System',
        content: `
          <h3>What is Spaced Repetition?</h3>
          <p>Our algorithm uses scientifically-proven memory techniques:</p>
          <ul>
            <li><strong>Optimal Timing</strong> - Words appear just before you forget them</li>
            <li><strong>Adaptive Learning</strong> - Adjusts based on your performance</li>
            <li><strong>Focus Areas</strong> - Identifies words needing more practice</li>
            <li><strong>Long-term Retention</strong> - Designed for permanent memory</li>
          </ul>
          
          <h3>How to Use It Effectively</h3>
          <ul>
            <li>Review vocabulary daily for best results</li>
            <li>Be honest when rating your knowledge</li>
            <li>Focus on difficult words when prompted</li>
            <li>Use mobile app for on-the-go reviews</li>
            <li>Set daily review goals in settings</li>
          </ul>
          
          <h3>Review Sessions</h3>
          <p>During review sessions:</p>
          <ul>
            <li><strong>Easy</strong> - Shows card again in 4 days</li>
            <li><strong>Good</strong> - Shows card again in 2 days</li>
            <li><strong>Hard</strong> - Shows card again in 1 day</li>
            <li><strong>Again</strong> - Shows card again in current session</li>
          </ul>
        `,
        tags: ['vocabulary', 'memory', 'learning'],
        popularity: 85,
        lastUpdated: '2024-01-08'
      }
    ],
    'account': [
      {
        id: 'profile-settings',
        title: 'Managing Profile Settings',
        content: `
          <h3>Accessing Settings</h3>
          <p>To access your profile settings:</p>
          <ol>
            <li>Click your profile picture in top right</li>
            <li>Select "Settings" from dropdown menu</li>
            <li>Navigate through different setting categories</li>
          </ol>
          
          <h3>Available Settings</h3>
          <ul>
            <li><strong>Profile Information</strong> - Name, email, profile picture</li>
            <li><strong>Learning Preferences</strong> - Daily goals, notification settings</li>
            <li><strong>Privacy Controls</strong> - What others can see</li>
            <li><strong>Notification Settings</strong> - Email and push notifications</li>
            <li><strong>Language Settings</strong> - Interface language, learning languages</li>
          </ul>
          
          <h3>Privacy Settings</h3>
          <p>Control what information is visible to others:</p>
          <ul>
            <li><strong>Public Profile</strong> - Show/hide your profile to other users</li>
            <li><strong>Activity Feed</strong> - Control what appears in community feed</li>
            <li><strong>Learning Statistics</strong> - Share your progress with friends</li>
            <li><strong>Contact Information</strong> - Who can message you</li>
          </ul>
        `,
        tags: ['settings', 'profile', 'privacy'],
        popularity: 78,
        lastUpdated: '2024-01-10'
      }
    ]
  };

  const faqs = [
    {
      question: 'How much does it cost to use the platform?',
      answer: 'We offer both free and premium plans. The free plan includes basic lessons and limited features. Premium plans start at $12.99/month and include unlimited lessons, offline access, personalized learning plans, and advanced features.',
      category: 'billing'
    },
    {
      question: 'Can I learn multiple languages at once?',
      answer: 'Yes! You can learn up to 5 languages simultaneously. We recommend focusing on 1-2 languages intensively while maintaining others with regular practice sessions.',
      category: 'learning'
    },
    {
      question: 'Is my progress saved across devices?',
      answer: 'Yes, your progress automatically syncs across web, iOS, and Android devices when you\'re logged into the same account. Make sure you have an internet connection for syncing.',
      category: 'technical'
    },
    {
      question: 'How does the speech recognition work?',
      answer: 'We use advanced AI technology to analyze your pronunciation, compare it with native speaker samples, and provide instant feedback. It works best with Chrome browser and a good quality microphone.',
      category: 'learning'
    },
    {
      question: 'Can I download lessons for offline use?',
      answer: 'Yes, with a premium subscription you can download lessons, stories, and vocabulary for offline practice. This is available on both iOS and Android apps.',
      category: 'technical'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel anytime from your account settings. Go to Settings > Billing > Manage Subscription. Your access will continue until the end of your current billing period.',
      category: 'billing'
    }
  ];

  const popularGuides = [
    {
      title: '30-Day Learning Challenge',
      description: 'Complete guide to making language learning a daily habit',
      icon: TrendingUp,
      views: '12.5k'
    },
    {
      title: 'Pronunciation Mastery Guide',
      description: 'Techniques for perfecting accent and pronunciation',
      icon: Headphones,
      views: '8.7k'
    },
    {
      title: 'Grammar Quick Reference',
      description: 'Essential grammar rules for common languages',
      icon: BookOpen,
      views: '15.2k'
    },
    {
      title: 'Cultural Learning Tips',
      description: 'How to learn language through culture immersion',
      icon: Globe,
      views: '6.3k'
    }
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: Mail,
      responseTime: '24 hours',
      link: 'mailto:support@languageapp.com'
    },
    {
      title: 'Community Forum',
      description: 'Get help from other learners',
      icon: Users,
      responseTime: '1 hour',
      link: '/community/forum'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      responseTime: 'Instant',
      link: '/tutorials'
    }
  ];

  const filteredArticles = articles[activeCategory]?.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <CustomNavbar/>
      {/* Hero Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
              <HelpCircle size={32} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Find answers, guides, and support for your language learning journey
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Found {filteredArticles?.length || 0} articles and {filteredFaqs.length} FAQs matching "{searchQuery}"
            </p>
          )}
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactOptions.map((option, index) => (
            <a
              key={index}
              href={option.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${option.badge ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <option.icon className={option.badge ? 'text-blue-600' : 'text-gray-600'} size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{option.title}</h3>
                    {option.badge && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    Avg. response: {option.responseTime}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                          activeCategory === category.id
                            ? 'bg-white shadow-md text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:bg-white/50 hover:border hover:border-gray-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <Icon size={18} className="text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{category.title}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Guides */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Popular Guides</h3>
                <div className="space-y-4">
                  {popularGuides.map((guide, index) => {
                    const Icon = guide.icon;
                    return (
                      <a
                        key={index}
                        href="#"
                        className="block p-3 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon size={16} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">{guide.title}</div>
                            <div className="text-xs text-gray-600 mb-2">{guide.description}</div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Eye size={12} className="mr-1" />
                              {guide.views} views
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {categories.find(c => c.id === activeCategory)?.title}
                  </h2>
                  <p className="text-gray-600">
                    {filteredArticles?.length || 0} articles available
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter size={18} className="text-gray-500" />
                  <select className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Most Popular</option>
                    <option>Recently Updated</option>
                    <option>Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-6 mb-12">
              {filteredArticles?.map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Star size={14} className="mr-1 text-yellow-500" />
                          {article.popularity}% helpful
                        </span>
                        <span>Updated {article.lastUpdated}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Bookmark size={20} />
                    </button>
                  </div>

                  <div 
                    className="prose max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                      Read full guide
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <span className="text-sm text-gray-600">{filteredFaqs.length} questions</span>
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <HelpCircle size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{faq.question}</h3>
                          <span className="text-sm text-gray-500">{faq.category}</span>
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className={`text-gray-400 transition-transform ${
                          expandedFaq === index ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-6 pb-6">
                        <div className="pl-12">
                          <div className="prose max-w-none">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                          <div className="mt-4 flex items-center space-x-4">
                            <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                              <CheckCircle size={14} className="mr-1" />
                              This answered my question
                            </button>
                            <button className="flex items-center text-sm text-gray-600 hover:text-gray-700">
                              <AlertCircle size={14} className="mr-1" />
                              Still need help?
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Still Need Help Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our support team is available 24/7 to help you with any questions or issues you're experiencing.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  
                  <a
                    href="mailto:support@languageapp.com"
                    className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    <Mail size={20} />
                    <span>Email Support</span>
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    <Phone size={20} />
                    <span>Call Support</span>
                  </a>
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  <p>Average response time: <span className="font-medium">5 minutes</span></p>
                  <p>Available languages: English, Spanish, French, German</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/blog"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FileText size={24} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Blog & Articles</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Read the latest language learning tips, success stories, and research insights.
              </p>
              <div className="text-blue-600 font-medium">Visit Blog →</div>
            </a>
            
            <a
              href="/tutorials"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Video size={24} className="text-purple-600" />
                <h3 className="font-bold text-gray-900">Video Tutorials</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Watch step-by-step video guides for all platform features and learning techniques.
              </p>
              <div className="text-blue-600 font-medium">Watch Tutorials →</div>
            </a>
            
            <a
              href="/community"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Users size={24} className="text-green-600" />
                <h3 className="font-bold text-gray-900">Community Help</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Connect with other learners, ask questions, and share your language learning journey.
              </p>
              <div className="text-blue-600 font-medium">Join Community →</div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;