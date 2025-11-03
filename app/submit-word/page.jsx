import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar'
import React from 'react'

const Submit = () => {
  return (
    <div>
        <CustomNavbar/>
        <main className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                </div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                    <form id="wordForm" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase*</label>
                                <input type="text" id="word" required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language*</label>
                                <select id="language" required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                    <option value="">Select Language</option>
                                    <option value="pidgin">Pidgin English</option>
                                    <option value="yoruba">Yoruba</option>
                                    <option value="igbo">Igbo</option>
                                    <option value="hausa">Hausa</option>
                                    <option value="other">Other Nigerian Language</option>
                                </select>
                            </div>
                        </div>
    {                  //  <!-- Meaning & Example -->
    }                    <div>
                            <label htmlFor="meaning"
                                className="block text-sm font-medium text-gray-700 mb-1">Meaning/Definition*</label>
                            <textarea id="meaning" rows="3" required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        <div>
                            <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                            <textarea id="example" rows="2"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="E.g., 'No wahala, I go do am'"></textarea>
                        </div>
    {                   // <!-- Category & Tags -->
    }                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select id="category"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                    <option value="">Select Category</option>
                                    <option value="slang">Slang</option>
                                    <option value="proverb">Proverb</option>
                                    <option value="greeting">Greeting</option>
                                    <option value="insult">Insult/Joke</option>
                                    <option value="food">Food Related</option>
                                    <option value="religious">Religious</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma
                                    separated)</label>
                                <input type="text" id="tags"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="E.g., youth,urban,music"/>
                            </div>
                        </div>
    {                   // <!-- Pronunciation -->
    }                    <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pronunciation</label>
                            <div className="flex items-center gap-4">
                                <input type="text" id="pronunciation"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Phonetic spelling"/>
                                <button type="button" id="recordBtn"
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors">
                                    <i data-feather="mic" className="text-primary"></i> Record </button>
                            </div>
                        </div>
    {                    //<!-- Additional Info -->
    }                    <div>
                            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional
                                Information</label>
                            <textarea id="additionalInfo" rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="Cultural context, variations, etc."></textarea>
                        </div>
    {                   // <!-- Contributor Info -->
    }                    <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">About You (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input type="text" id="name"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" id="email"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Your Connection to
                                    This Word</label>
                                <textarea id="origin" rows="2"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="How do you know this word? Where did you learn it?"></textarea>
                            </div>
                        </div>
    {                   // <!-- Submission -->
    }                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                            <button type="reset"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors">
                                Reset Form </button>
                            <button type="submit"
                                className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <i data-feather="send"></i> Submit Word </button>
                        </div>
                    </form>
                </div>
                <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i data-feather="info" className="h-5 w-5 text-blue-400"></i>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Submission Guidelines</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Please ensure the word is genuinely used in Nigerian contexts</li>
                                    <li>Provide accurate meanings and examples</li>
                                    <li>All submissions will be reviewed before publishing</li>
                                    <li>By submitting, you agree to our <a href="/terms.html"
                                            className="text-blue-600 hover:underline">Terms of Use</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <CustomFooter/>
        <script>
            {/* 
{            // Form submission handling
}            document.getElementById('wordForm').addEventListener('submit', function (e) {
                e.preventDefault();
                if (validateForm(this)) {
                    // In a real app, you would submit to a backend API
                    alert('Thank you for your contribution! Your word has been submitted for review.');
                    this.reset();
                }
            });

{            // Record button functionality
}            document.getElementById('recordBtn').addEventListener('click', function () {
                alert('Recording functionality would be implemented here in a production app');
            });

            feather.replace();*/}
        </script>
    </div>
  )
}

export default Submit