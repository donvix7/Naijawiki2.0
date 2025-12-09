// src/pages/DocumentationPage.jsx
"use client";

import React, { useState } from 'react';
import { 
  BookOpen,
  Search,
  Video,
  Headphones,
  MessageSquare,
  Trophy,
  Users,
  Clock,
  Star,
  HelpCircle,
  FileText,
  Code,
  Globe,
  Mic,
  Volume2,
  Award,
  Target,
  Zap,
  ChevronRight,
  ExternalLink,
  Download,
  Phone,
  Mail,
  Github,
  Twitter,
  Youtube
} from 'lucide-react';
import CustomNavbar from '@/components/navBar';

const DocumentationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  
  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap, color: 'bg-blue-500' },
    { id: 'features', label: 'Features', icon: Star, color: 'bg-purple-500' },
    { id: 'languages', label: 'Languages', icon: Globe, color: 'bg-green-500' },
    { id: 'learning', label: 'Learning Methods', icon: BookOpen, color: 'bg-yellow-500' },
    { id: 'technical', label: 'Technical', icon: Code, color: 'bg-red-500' },
    { id: 'community', label: 'Community', icon: Users, color: 'bg-pink-500' }
  ];
  
  const documentation = {
    'getting-started': [
      {
        id: 'welcome',
        title: 'Welcome to Language App',
        content: `Language App is an immersive platform for learning languages through interactive lessons, real-world practice, and community engagement. Our scientifically-proven methods help you achieve fluency faster.`,
        icon: Star
      },
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        content: `1. **Create your account** - Sign up with email or social login\n2. **Set your native language** - This helps us personalize your experience\n3. **Choose languages to learn** - Select from 40+ languages\n4. **Take the placement test** - Start at the right level\n5. **Set daily goals** - Consistency is key to language learning\n6. **Complete your first lesson** - Start with basic greetings`,
        icon: Zap
      },
      {
        id: 'dashboard',
        title: 'Understanding Your Dashboard',
        content: `Your dashboard is your learning command center:\n- **Daily Streak**: Track your consistency\n- **XP Progress**: Earn experience points for all activities\n- **Skill Tree**: Visualize your progress in each language\n- **Upcoming Lessons**: What to learn next\n- **Community Activity**: See what others are learning`,
        icon: Target
      }
    ],
    'features': [
      {
        id: 'interactive-lessons',
        title: 'Interactive Lessons',
        content: `Our lessons combine multiple learning methods:\n- **Listening**: Native speaker audio\n- **Speaking**: Voice recognition practice\n- **Reading**: Contextual comprehension\n- **Writing**: Character/word practice\n- **Grammar**: Interactive exercises`,
        icon: Headphones
      },
      {
        id: 'speech-recognition',
        title: 'Speech Recognition',
        content: `Practice pronunciation with real-time feedback:\n- **Accuracy scoring**: Get instant feedback on pronunciation\n- **Native comparisons**: Compare with native speakers\n- **Tone practice**: Essential for tonal languages\n- **Phonetic breakdown**: Understand how sounds are made`,
        icon: Mic
      },
      {
        id: 'gamification',
        title: 'Gamification Features',
        content: `Stay motivated with game-like elements:\n- **Streaks**: Daily learning rewards\n- **Achievements**: Unlock badges for milestones\n- **Leaderboards**: Compete with friends\n- **XP System**: Earn points for all activities\n- **Skill Trees**: Visual progress tracking`,
        icon: Trophy
      }
    ],
    'languages': [
      {
        id: 'supported-languages',
        title: 'Supported Languages',
        content: `We offer 40+ languages including:\n\n**Popular Languages**:\n- Spanish, French, German, Italian, Portuguese\n- Chinese (Mandarin), Japanese, Korean\n- Arabic, Russian, Hindi\n\n**African Languages**:\n- Yoruba, Igbo, Hausa, Swahili, Zulu\n- Amharic, Somali, Afrikaans\n\n**Less Common**:\n- Esperanto, Klingon, High Valyrian`,
        icon: Globe
      },
      {
        id: 'language-specific',
        title: 'Language-Specific Features',
        content: `Different languages have unique features:\n\n**Tonal Languages** (Chinese, Yoruba):\n- Tone practice exercises\n- Pitch contour visualization\n\n**Non-Latin Scripts** (Arabic, Japanese):\n- Character writing practice\n- Stroke order animation\n\n**Grammatical Cases** (German, Russian):\n- Case system visualizations\n- Declension practice`,
        icon: FileText
      }
    ],
    'learning': [
      {
        id: 'spaced-repetition',
        title: 'Spaced Repetition System',
        content: `Our algorithm optimizes your learning:\n- **Smart Review**: Words appear just before you forget them\n- **Adaptive Timing**: Adjusts based on your performance\n- **Focus Areas**: Identifies weak spots for extra practice\n- **Long-term Retention**: Optimized for memory consolidation`,
        icon: Clock
      },
      {
        id: 'immersion',
        title: 'Immersion Techniques',
        content: `Beyond traditional lessons:\n- **Interactive Stories**: Learn in context\n- **Podcasts**: Native content with transcripts\n- **News Articles**: Current events at your level\n- **Video Content**: Movies, shows with subtitles\n- **Chat Practice**: Talk with AI tutors`,
        icon: MessageSquare
      }
    ],
    'technical': [
      {
        id: 'requirements',
        title: 'System Requirements',
        content: `**Web Version**:\n- Modern browser (Chrome 80+, Firefox 75+, Safari 13+)\n- Microphone for speech practice\n- 2MB+ internet connection\n\n**Mobile Apps**:\n- iOS 13+ or Android 8+\n- 100MB free space for offline content\n- Headphones recommended`,
        icon: Phone
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        content: `**Common Issues**:\n\n**Microphone not working**:\n1. Check browser permissions\n2. Try a different browser\n3. Test on mobile app\n\n**Progress not saving**:\n1. Check internet connection\n2. Clear browser cache\n3. Update to latest version\n\n**Audio issues**:\n1. Check volume settings\n2. Try headphones\n3. Restart the app`,
        icon: HelpCircle
      }
    ],
    'community': [
      {
        id: 'forums',
        title: 'Community Forums',
        content: `Connect with other learners:\n- **Language Partners**: Find practice buddies\n- **Discussion Boards**: Ask questions, share tips\n- **Cultural Exchange**: Learn about cultures\n- **Group Challenges**: Join learning challenges\n- **Expert Q&A**: Sessions with language teachers`,
        icon: Users
      },
      {
        id: 'events',
        title: 'Live Events',
        content: `Weekly live sessions:\n- **Conversation Practice**: Group speaking sessions\n- **Grammar Workshops**: Deep dives into specific topics\n- **Cultural Lessons**: Native speakers share insights\n- **Q&A Sessions**: Get answers from experts\n- **Virtual Language Exchange**: Meet learners worldwide`,
        icon: Video
      }
    ]
  };
  
  const faqs = [
    {
      question: 'How much does Language App cost?',
      answer: 'We offer a free tier with basic lessons and a premium subscription with full access to all features, offline mode, and personalized learning plans.'
    },
    {
      question: 'Can I learn multiple languages at once?',
      answer: 'Yes! You can learn up to 5 languages simultaneously. We recommend focusing on 1-2 languages intensively and 1-3 for maintenance.'
    },
    {
      question: 'Is my progress saved across devices?',
      answer: 'Yes, your progress syncs across web and mobile apps. Just log in with the same account.'
    },
    {
      question: 'How does speech recognition work?',
      answer: 'We use advanced AI to analyze your pronunciation, compare it with native speakers, and provide instant feedback on accuracy.'
    },
    {
      question: 'Can I download lessons for offline use?',
      answer: 'Yes, with premium subscription you can download lessons, stories, and vocabulary for offline practice.'
    }
  ];
  
  const resources = [
    { title: 'Learning Science Research', icon: BookOpen, link: '#' },
    { title: 'Teacher Resources', icon: Users, link: '#' },
    { title: 'API Documentation', icon: Code, link: '#' },
    { title: 'Mobile App Guides', icon: Phone, link: '#' },
    { title: 'Content Guidelines', icon: FileText, link: '#' },
    { title: 'Accessibility Guide', icon: Award, link: '#' }
  ];

  const filteredDocs = documentation[activeCategory].filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <CustomNavbar/>
      {/* Hero Section */}
      <div className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
              <BookOpen size={32} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Language App Documentation</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Everything you need to master language learning with our platform
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {categories.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeCategory === id
                      ? 'bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${color} text-white`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              
              {/* Quick Links */}
              <div className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow transition">
                    <div className="flex items-center space-x-3">
                      <Download size={18} className="text-gray-500" />
                      <span>Download Mobile Apps</span>
                    </div>
                    <ExternalLink size={16} className="text-gray-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow transition">
                    <div className="flex items-center space-x-3">
                      <Mail size={18} className="text-gray-500" />
                      <span>Contact Support</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Documentation Content */}
          <div className="lg:col-span-3">
            {/* Category Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {filteredDocs.length} articles available
              </p>
            </div>

            {/* Documentation Articles */}
            <div className="space-y-6">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <doc.icon className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {doc.title}
                      </h3>
                      <div className="prose dark:prose-invert max-w-none">
                        {doc.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-2 text-gray-700 dark:text-gray-300">
                            {line.startsWith('**') ? (
                              <strong>{line.replace(/\*\*/g, '')}</strong>
                            ) : (
                              line
                            )}
                          </p>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                          Read more <ChevronRight className="inline ml-1" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <HelpCircle className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Additional Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <resource.icon className="text-blue-600 dark:text-blue-400" size={24} />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {resource.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Detailed guides and reference materials
                    </p>
                    <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
                      View Resource <ExternalLink className="inline ml-1" size={16} />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Our support team is here to help you with any questions about using Language App.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="#" className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition">
                    <Mail size={20} />
                    <span>Email Support</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-6 py-3 bg-white/20 border border-white rounded-lg hover:bg-white/30 transition">
                    <Twitter size={20} />
                    <span>Twitter</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-6 py-3 bg-white/20 border border-white rounded-lg hover:bg-white/30 transition">
                    <Github size={20} />
                    <span>GitHub</span>
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