"use client";

import React, { useState } from 'react';
import { 
  BookOpen,
  Search,
  Headphones,
  MessageSquare,
  Star,
  HelpCircle,
  FileText,
  Code,
  Globe,
  Mic,
  Volume2,
  Zap,
  ChevronRight,
  Download,
  Phone,
  Mail,
  Book,
  Languages,
  Target,
  Settings
} from 'lucide-react';
import CustomNavbar from '@/components/navBar';

const DocumentationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  
  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'dictionary', label: 'Dictionary Features', icon: BookOpen },
    { id: 'pronunciation', label: 'Pronunciation', icon: Volume2 },
    { id: 'account', label: 'Account & Settings', icon: Settings },
  ];
  
  const documentation = {
    'getting-started': [
      {
        id: 'welcome',
        title: 'Welcome to Language Dictionary',
        content: `A comprehensive dictionary app for learning and referencing words across multiple languages. Features include audio pronunciation, example sentences, and word lists.`,
        icon: Star
      },
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        content: `1. **Search for words** - Use the search bar to look up any word\n2. **Listen to pronunciation** - Tap the speaker icon for audio\n3. **Save words** - Bookmark words to review later\n4. **Explore features** - Try word of the day, history, and lists\n5. **Set preferences** - Adjust language and display settings`,
        icon: Zap
      },
      {
        id: 'navigation',
        title: 'App Navigation',
        content: `**Main Sections**:\n- **Search**: Look up words and phrases\n- **Favorites**: Access your saved words and lists\n- **History**: View your recent searches\n- **Word of Day**: Daily featured word\n- **Settings**: App preferences and account`,
        icon: Target
      }
    ],
    'dictionary': [
      {
        id: 'search-features',
        title: 'Search Features',
        content: `**Advanced Search Options**:\n- **Wildcards**: Use * for unknown letters\n- **Phrase search**: Use quotes for exact phrases\n- **Language filters**: Specify source/target language\n- **Part of speech**: Filter by noun, verb, adjective\n- **Advanced filters**: By word length, starting/ending letters`,
        icon: Search
      },
      {
        id: 'word-entries',
        title: 'Understanding Word Entries',
        content: `Each word entry includes:\n- **Headword** with pronunciation guide\n- **Audio pronunciation** from native speakers\n- **Multiple definitions** with usage labels\n- **Example sentences** in context\n- **Synonyms and antonyms**\n- **Word origin** and etymology\n- **Related words** and phrases`,
        icon: Book
      },
      {
        id: 'word-lists',
        title: 'Creating Word Lists',
        content: `Organize your vocabulary:\n- **Create custom lists** (e.g., "Travel Words", "Business Terms")\n- **Add words** from search results or history\n- **Share lists** with other users\n- **Export lists** as PDF or text files\n- **Practice mode** with flashcards from your lists`,
        icon: FileText
      }
    ],
    'pronunciation': [
      {
        id: 'audio-features',
        title: 'Audio Pronunciation',
        content: `**Pronunciation Features**:\n- **Native speaker recordings** for all words\n- **Multiple accents** where available\n- **Playback controls** (slow, normal, fast)\n- **Download audio** for offline use (Premium)\n- **Compare feature** with your own recording`,
        icon: Volume2
      },
      {
        id: 'speech-practice',
        title: 'Speech Practice',
        content: `Improve your pronunciation:\n- **Record yourself** and compare to native audio\n- **Get feedback** on accuracy and intonation\n- **Repeat exercises** for difficult sounds\n- **Tone practice** for tonal languages\n- **Phonetic breakdowns** of each sound`,
        icon: Mic
      }
    ],
    
    'account': [
      {
        id: 'profile',
        title: 'Profile & Settings',
        content: `**Manage Your Account**:\n- **Personal info**: Name, email, profile picture\n- **Language preferences**: Interface and learning languages\n- **Display settings**: Font size, theme\n- **Privacy controls**: Search history, shared data\n- **Notification preferences**: Word of day, updates`,
        icon: Settings
      },
      {
        id: 'subscription',
        title: 'Subscription Features',
        content: `**Premium Benefits**:\n- **Unlimited word saves** (vs. 100 for free)\n- **Offline dictionaries** - download complete language sets\n- **Advanced search filters**\n- **No ads**\n- **Priority support**\n- **Additional language packs**`,
        icon: Star
      }
    ],
    
  };
  
  const faqs = [
    {
      question: 'How many languages are supported?',
      answer: 'We currently offer dictionaries for 30+ languages, with more being added regularly.'
    },
    {
      question: 'Can I use the dictionary offline?',
      answer: 'Yes, with a Premium subscription you can download complete dictionaries for offline use.'
    },
    {
      question: 'Is there a limit to saving words?',
      answer: 'Free users can save up to 100 words. Premium users have unlimited saving capacity.'
    },
    {
      question: 'How accurate are the pronunciations?',
      answer: 'We use native speaker recordings for core vocabulary. All audio is verified by language experts.'
    },
    {
      question: 'Can I suggest new words or corrections?',
      answer: 'Yes! Use the "Suggest Edit" feature on any word entry. Our editorial team reviews all submissions.'
    }
  ];
  
  const resources = [
    { title: 'Dictionary API', icon: Code, link: '#' },
    { title: 'Mobile App Guide', icon: Phone, link: '#' },
    { title: 'Content Guidelines', icon: FileText, link: '#' }
  ];

  const filteredDocs = documentation[activeCategory].filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar/>
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <BookOpen size={32} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Naijawiki Documentation</h1>
            <p className="text-gray-600">
              Complete guide to using the language dictionary
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg p-4">
                <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
                <div className="space-y-1">
                  {categories.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveCategory(id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                        activeCategory === id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="p-1.5 bg-blue-100 rounded">
                        <Icon size={18} className="text-blue-600" />
                      </div>
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
                
                {/* Quick Links */}
                <div className="pt-6 mt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <Download size={18} className="text-gray-500 mr-3" />
                      <span>Download Apps</span>
                    </a>
                    <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <Mail size={18} className="text-gray-500 mr-3" />
                      <span>Contact Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <p className="text-gray-600">
                {filteredDocs.length} articles
              </p>
            </div>

            {/* Documentation Articles */}
            <div className="space-y-4">
              {filteredDocs.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div key={doc.id} className="bg-white rounded-lg p-5">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Icon className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {doc.title}
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                          {doc.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2">
                              {line.startsWith('**') ? (
                                <strong>{line.replace(/\*\*/g, '')}</strong>
                              ) : (
                                line
                              )}
                            </p>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Read more <ChevronRight className="inline ml-1" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQs */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg p-5">
                    <div className="flex items-start space-x-4">
                      <HelpCircle className="text-blue-600 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-gray-700">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Additional Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={index}
                      href={resource.link}
                      className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className="text-blue-600" size={24} />
                        <h4 className="font-bold text-gray-900">
                          {resource.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Detailed guides and reference materials
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <div className="mt-12 bg-blue-50 rounded-xl p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Still Need Help?</h3>
                <p className="text-gray-600 mb-6">
                  Contact our support team for assistance with the dictionary app.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="mailto:support@dictionaryapp.com" className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                    <Mail size={18} />
                    <span>Email Support</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                    <MessageSquare size={18} />
                    <span>Live Chat</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;