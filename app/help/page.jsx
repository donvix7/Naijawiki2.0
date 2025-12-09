"use client";

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  MessageSquare,
  FileText,
  Globe,
  Users,
  Settings,
  ChevronRight,
  Star,
  Bookmark,
  Zap,
  Languages,
  Volume2,
  Download,
  Mail,
  Phone,
  History,
  Filter,
  Mic,
  Video
} from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      description: 'Basics and first steps'
    },
    {
      id: 'search',
      title: 'Search & Lookup',
      icon: Search,
      description: 'Finding words and phrases'
    },
    {
      id: 'dictionary',
      title: 'Dictionary Features',
      icon: BookOpen,
      description: 'Understanding word entries'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation',
      icon: Volume2,
      description: 'Audio and speech features'
    },
    {
      id: 'languages',
      title: 'Languages',
      icon: Languages,
      description: 'Supported languages info'
    },
    {
      id: 'account',
      title: 'Account & Settings',
      icon: Settings,
      description: 'Manage your preferences'
    }
  ];

  const articles = {
    'getting-started': [
      {
        id: 'welcome-guide',
        title: 'Welcome to Our Dictionary',
        content: 'Learn how to make the most of our comprehensive language dictionary with native pronunciations, example sentences, and advanced search features.',
        icon: Star,
        readTime: '3 min read'
      },
      {
        id: 'quick-tips',
        title: 'Quick Tips for Beginners',
        content: 'Discover essential features like bookmarking words, using voice search, and accessing your search history to enhance your learning experience.',
        icon: Zap,
        readTime: '2 min read'
      }
    ],
    'search': [
      {
        id: 'basic-search',
        title: 'How to Search for Words',
        content: 'Type in the search bar to find words with auto-suggestions. Use advanced filters for specific languages, parts of speech, or word forms.',
        icon: Search,
        readTime: '4 min read'
      },
      {
        id: 'advanced-filters',
        title: 'Using Search Filters',
        content: 'Refine your searches with filters for language, difficulty level, word type, and more. Save filter combinations for quick access.',
        icon: Filter,
        readTime: '5 min read'
      },
      {
        id: 'search-history',
        title: 'Managing Search History',
        content: 'Review your recent searches, clear history, or save searches for future reference. History syncs across your devices.',
        icon: History,
        readTime: '3 min read'
      }
    ],
    'dictionary': [
      {
        id: 'word-entries',
        title: 'Understanding Word Entries',
        content: 'Each entry includes definitions, pronunciations, example sentences, synonyms, word origin, and usage notes. Learn how to navigate complex entries.',
        icon: BookOpen,
        readTime: '6 min read'
      },
      {
        id: 'bookmarking',
        title: 'Saving and Organizing Words',
        content: 'Bookmark words to study later. Create custom lists, organize by topic, and export your collections for offline study.',
        icon: Bookmark,
        readTime: '4 min read'
      }
    ],
    'pronunciation': [
      {
        id: 'audio-features',
        title: 'Using Audio Pronunciation',
        content: 'Listen to native speaker recordings, adjust playback speed, and compare different accents. Premium users can download audio for offline use.',
        icon: Volume2,
        readTime: '4 min read'
      },
      {
        id: 'voice-search',
        title: 'Voice Search Feature',
        content: 'Search by speaking instead of typing. Our voice recognition supports multiple languages and accents for convenient lookups.',
        icon: Mic,
        readTime: '3 min read'
      }
    ],
    'languages': [
      {
        id: 'supported-langs',
        title: 'Supported Languages',
        content: 'We support 50+ languages with comprehensive dictionaries. Some languages include special features like character writing guides and tone practice.',
        icon: Globe,
        readTime: '5 min read'
      },
      {
        id: 'language-packs',
        title: 'Language Packs & Offline Use',
        content: 'Download complete language dictionaries for offline access. Choose which languages to store on your device for travel or areas with poor connectivity.',
        icon: Download,
        readTime: '3 min read'
      }
    ],
    'account': [
      {
        id: 'profile-settings',
        title: 'Profile & Preferences',
        content: 'Customize your dictionary experience with language preferences, display settings, notification preferences, and privacy controls.',
        icon: Settings,
        readTime: '4 min read'
      },
      {
        id: 'subscription',
        title: 'Subscription Benefits',
        content: 'Premium features include unlimited bookmarks, offline dictionaries, advanced search filters, ad-free experience, and priority support.',
        icon: Star,
        readTime: '3 min read'
      }
    ]
  };

  const faqs = [
    {
      question: 'How many languages are supported?',
      answer: 'We currently support 50+ languages including major world languages and several regional languages. New languages are added regularly.',
      category: 'languages'
    },
    {
      question: 'Can I use the dictionary offline?',
      answer: 'Yes, with a Premium subscription you can download complete dictionaries for offline use. Free users can save individual words offline.',
      category: 'account'
    },
    {
      question: 'Is there a word saving limit?',
      answer: 'Free users can save up to 100 words. Premium users have unlimited saving capacity across all devices.',
      category: 'dictionary'
    },
    {
      question: 'How accurate are pronunciations?',
      answer: 'We use native speaker recordings for core vocabulary. All audio is verified by language experts for accuracy.',
      category: 'pronunciation'
    },
    {
      question: 'Can I suggest word additions?',
      answer: 'Yes! Use the "Suggest Edit" feature on any entry or contact us directly with suggestions. Our team reviews all submissions.',
      category: 'dictionary'
    },
    {
      question: 'Do you offer API access?',
      answer: 'Yes, we provide API access for developers. Contact our sales team for pricing and documentation.',
      category: 'technical'
    }
  ];

  const quickLinks = [
    {
      title: 'Contact Support',
      description: 'Email our support team',
      icon: Mail,
      link: 'mailto:support@dictionary.com'
    },
    {
      title: 'Community Forum',
      description: 'Ask other users for help',
      icon: Users,
      link: '/community'
    },
    {
      title: 'Feedback',
      description: 'Suggest improvements',
      icon: FileText,
      link: '/feedback'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      link: '/tutorials'
    }
  ];

  const filteredArticles = articles[activeCategory]?.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-6">
              <HelpCircle className="text-blue-600" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Dictionary Help Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to your questions about using our language dictionary features
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
            <input
              type="text"
              placeholder="What do you need help with? Search articles, FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-100 focus:border-blue-400 text-lg shadow-sm hover:border-gray-300 transition"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              Found {filteredArticles.length} articles and {filteredFaqs.length} FAQs
            </p>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.link}
                className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                    <Icon className="text-blue-600" size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h2 className="font-bold text-gray-900 mb-4 text-lg">Help Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeCategory === category.id
                            ? 'bg-blue-50 border border-blue-200 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:border hover:border-gray-200'
                        }`}
                      >
                        <Icon size={20} className={activeCategory === category.id ? 'text-blue-500' : 'text-gray-500'} />
                        <div className="text-left">
                          <div className="font-medium">{category.title}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Articles */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Popular Articles</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Advanced Search Tips', views: '2.4k' },
                    { title: 'Saving Words Offline', views: '1.8k' },
                    { title: 'Pronunciation Guide', views: '3.1k' },
                    { title: 'Creating Word Lists', views: '1.5k' }
                  ].map((article, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                    >
                      <span className="text-sm text-gray-700">{article.title}</span>
                      <span className="text-xs text-gray-500">{article.views} views</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {categories.find(c => c.id === activeCategory)?.title}
                </h2>
                <p className="text-gray-600">
                  {filteredArticles.length} articles in this category
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100">
                  <option>Most Recent</option>
                  <option>Most Helpful</option>
                  <option>A-Z</option>
                </select>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {filteredArticles.map((article) => {
                const Icon = article.icon;
                return (
                  <div
                    key={article.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                        <Icon className="text-blue-600" size={22} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{article.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{article.readTime}</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                            Read article
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQs Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <span className="text-sm text-gray-600">{filteredFaqs.length} questions</span>
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <HelpCircle className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{faq.question}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`text-gray-400 transition-transform ${
                          expandedFaq === index ? 'rotate-90' : ''
                        }`}
                        size={20}
                      />
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-6 pb-6">
                        <div className="pl-12">
                          <p className="text-gray-700 mb-4">{faq.answer}</p>
                          <div className="flex items-center space-x-4">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Was this helpful?
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 text-sm">
                              Share feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our support team is here to help you with any questions about using our dictionary app.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="mailto:support@dictionary.com"
                    className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-medium"
                  >
                    <Mail size={20} />
                    <span>Email Support</span>
                  </a>
                  <a
                    href="tel:+18001234567"
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    <Phone size={20} />
                    <span>Call Support</span>
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  Average response time: 2 hours • Available Monday-Friday, 9AM-6PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;