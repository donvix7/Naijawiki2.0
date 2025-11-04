import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar'
import React from 'react'

const volunteer = () => {
  return (
    <div>
        <CustomNavbar/>
    <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Volunteer With Us</h1>
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-6">Help Preserve Nigerian Languages</h2>
                <p className="text-gray-700 mb-6">NaijaLingo relies on volunteers to help document, verify, and expand our
                    collection of Nigerian words and phrases. Join our team of language enthusiasts!</p>
                <h3 className="text-xl font-bold text-secondary mb-4">Volunteer Roles</h3>
                <div className="space-y-4 mb-8">
                    <div className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="font-bold">Language Contributor</h4>
                        <p className="text-gray-600 text-sm">Add new words and meanings from your native language</p>
                    </div>
                    <div className="border-l-4 border-secondary pl-4 py-2">
                        <h4 className="font-bold">Content Moderator</h4>
                        <p className="text-gray-600 text-sm">Review and verify submissions for accuracy</p>
                    </div>
                    <div className="border-l-4 border-accent pl-4 py-2">
                        <h4 className="font-bold">Translation Specialist</h4>
                        <p className="text-gray-600 text-sm">Help translate content between languages</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-4">Volunteer Application</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                        <input type="text" required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                        <input type="email" required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Languages You Speak*</label>
                        <textarea required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="List all Nigerian languages you're fluent in"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Volunteer Role(s) Interested
                            In*</label>
                        <select multiple
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                            <option>Language Contributor</option>
                            <option>Content Moderator</option>
                            <option>Translation Specialist</option>
                            <option>Community Outreach</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer with
                            us?*</label>
                        <textarea required rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <button type="submit"
                        className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Submit Application </button>
                </form>
            </div>
        </div>
    </main>
    <CustomFooter/>
     </div>
  )
}

export default volunteer