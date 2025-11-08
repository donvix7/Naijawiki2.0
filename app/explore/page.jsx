import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar'
import React from 'react'

export default function page() {
  return (
    <div>
        <CustomNavbar />
    <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
                <h1 className="text-4xl font-bold text-secondary mb-2">Explore Nigerian Words</h1>
                <p className="text-gray-600">Discover and learn words from various Nigerian languages</p>
            </div>
            <div className="w-full md:w-auto">
                <a href="/submit-word.html"
                    className="inline-flex items-center bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
                    <i data-feather="plus" className="mr-2"></i> Add New Word </a>
            </div>
        </div>
{       // <!-- Filters -->
}        <div className="bg-white p-6 rounded-xl shadow-md mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
{             //   <!-- Language Filter -->
}                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select id="language"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                        <option value="">All Languages</option>
                        <option value="pidgin">Pidgin English</option>
                        <option value="yoruba">Yoruba</option>
                        <option value="igbo">Igbo</option>
                        <option value="hausa">Hausa</option>
                        <option value="other">Other</option>
                    </select>
                </div>
{            //    <!-- Category Filter -->
}                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select id="category"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                        <option value="">All Categories</option>
                        <option value="slang">Slang</option>
                        <option value="proverb">Proverb</option>
                        <option value="phrase">Common Phrase</option>
                        <option value="greeting">Greeting</option>
                    </select>
                </div>
{             //   <!-- Status Filter -->
}                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                        <option value="">All Statuses</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="disputed">Disputed</option>
                    </select>
                </div>
{              //  <!-- Search -->
}                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                        <input type="text" id="search" placeholder="Search words..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        <i data-feather="search" className="absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>
{      //  <!-- Word Grid -->
}        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
{         //   <!-- Word Card 1 -->
}            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-secondary">Wahala</h3>
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">Pidgin</span>
                    </div>
                    <p className="mt-2 text-gray-600">Trouble or problem</p>
                    <div className="mt-4 flex items-center justify-between">
                        <button className="flex items-center text-primary">
                            <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                        <a href="/word-detail.html" className="text-accent hover:underline">View details</a>
                    </div>
                </div>
            </div>
{        //    <!-- Word Card 2 -->
}            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-secondary">Omo</h3>
                        <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">Yoruba</span>
                    </div>
                    <p className="mt-2 text-gray-600">Child or used as an exclamation</p>
                    <div className="mt-4 flex items-center justify-between">
                        <button className="flex items-center text-primary">
                            <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                        <a href="/word-detail.html" className="text-accent hover:underline">View details</a>
                    </div>
                </div>
            </div>
{         //   <!-- Word Card 3 -->
}            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-secondary">Kai</h3>
                        <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">Hausa</span>
                    </div>
                    <p className="mt-2 text-gray-600">Expression of surprise or emphasis</p>
                    <div className="mt-4 flex items-center justify-between">
                        <button className="flex items-center text-primary">
                            <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                        <a href="/word-detail.html" className="text-accent hover:underline">View details</a>
                    </div>
                </div>
            </div>
{           // <!-- Word Card 4 -->
}            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-secondary">Abeg</h3>
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">Pidgin</span>
                    </div>
                    <p className="mt-2 text-gray-600">"Please" or "I beg you"</p>
                    <div className="mt-4 flex items-center justify-between">
                        <button className="flex items-center text-primary">
                            <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                        <a href="/word-detail.html" className="text-accent hover:underline">View details</a>
                    </div>
                </div>
            </div>
{          //  <!-- Word Card 5 -->
}            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-black">Nne</h3>
                        <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">Igbo</span>
                    </div>
                    <p className="mt-2 text-gray-600">Term of endearment meaning "mother"</p>
                    <div className="mt-4 flex items-center justify-between">
                        <button className="flex items-center text-primary">
                            <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                        <a href="/word-detail.html" className="text-accent hover:underline">View details</a>
                    </div>
                </div>
            </div>
{         //   <!-- Word Card 6 -->
}            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-secondary">Gbera</h3>
                        <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">Yoruba</span>
                    </div>
                    <p className="mt-2 text-gray-600">To rise up or get up</p>
                    <div className="mt-4 flex items-center justify-between">
                        <button className="flex items-center text-primary">
                            <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                        <a href="/word-detail.html" className="text-accent hover:underline">View details</a>
                    </div>
                </div>
            </div>
        </div>
{      //  <!-- Pagination -->
}        <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#"
                    className="inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <i data-feather="chevron-left" className="h-4 w-4"></i>
                </a>
                <a href="#"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-primary bg-gray-100">
                    1 </a>
                <a href="#"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2 </a>
                <a href="#"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3 </a>
                <span
                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ... </span>
                <a href="#"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    8 </a>
                <a href="#"
                    className="inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <i data-feather="chevron-right" className="h-4 w-4"></i>
                </a>
            </nav>
        </div>
    </main>
    <CustomFooter/>
     </div>
  );
}

