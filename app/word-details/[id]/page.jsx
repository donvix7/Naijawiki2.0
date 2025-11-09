import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar';
import React from 'react'

 const getWordById = async(id) => {
    try {
        const res = await fetch(`http://wiki-server.giguild.com/api/word/${id}`,{
            cache: "no-store",
        });
        if(!res.ok) {
            console.log("something went wrong")
            throw new Error("Failed to fetch")
        }
        return res.json();
        console.log(res);

    }catch(error) {
        console.log(error)
    }
 }
export default async function  page(params) {
    const id = params;
    const word = await getWordById(id);
  return (
    <div>

    <CustomNavbar/>
    <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <a href="/explore " className="text-primary hover:underline flex items-center gap-2">
                    <i data-feather="arrow-left"></i> Back to Explore </a>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">Pidgin</span>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-4xl font-bold text-secondary">{word.word}</h1>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-primary">
                            <i data-feather="bookmark"></i>
                            <span className="text-sm">Save</span>
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-secondary mb-2">Meaning</h2>
                            <p className="text-gray-700">{word.meaning}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary mb-2">Pronunciation</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">{word.prononciation}</span>
                                <button className="flex items-center gap-2 text-primary">
                                    <i data-feather="play-circle"></i>
                                    <span>Listen</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary mb-2">Example Usage</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 mb-2">{word.example}</p>
                                <p className="text-gray-500 text-sm">(Meaning: "No problem, I'll do it.")</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary mb-2">Cultural Context</h2>
                            <p className="text-gray-700">{word.information}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary mb-2">Related Words</h2>
                            <div className="flex flex-wrap gap-2">
                                <a href="/word-detail "
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{word.related}</a>
                                <a href="/word-detail "
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{word.related}</a>
                                <a href="/word-detail "
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{word.related}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-700">Submitted by:</h3>
                            <p className="text-gray-600">user123</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-green-600">
                                <i data-feather="thumbs-up"></i>
                                <span>32</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-600">
                                <i data-feather="thumbs-down"></i>
                                <span>2</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                                <i data-feather="flag"></i>
                                <span>Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-secondary mb-6">Add Your Contribution</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Meaning</label>
                        <textarea
                        onChange = {(e) => setAlternativeMeaning(e.target.value)}   
                            value={alternativeMeaning}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                        <textarea
                        onChange = {(e) => setExample(e.target.value)}
                        value={example}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (Optional)</label>
                        <input type="text"
                        onChange = {(e) => setContributorName(e.target.value)}
                        value = {contributorName}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                    </div>
                    <button type="submit"
                        className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Submit Contribution </button>
                </form>
            </div>
        </div>
    </main>
    <CustomFooter/>
    </div>
  )
}

