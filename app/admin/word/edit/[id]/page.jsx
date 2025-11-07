"use client";
import AdminNavbar from '@/components/adminNavbar'
import AdminSideBar from '@/components/adminSideBar'
import React, { useState } from 'react'

const page = () => {
    
const [time, setTime] = useState("");
const [word, setWord] = useState("");
const [language, setLanguage] = useState("");
const [meaning, setMeaning] = useState("");
const [example, setExample] = useState("");
const [status, setStatus] = useState("");
const [category, setCategory] = useState("");
const [creator, setCreator] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("", {
            method: "PUT",
            headers: {
               " Content-Type": "application/json"},
            body: JSON.stringify({
                word: word,
                language: language,
                meaning: meaning,
                example: example,
                category: category,
                status: status,

            })

        })
    }
  return (
    <div>
        <AdminNavbar/>
    <div className="flex">
    <AdminSideBar/>
        <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Edit Word</h1>
                <a href="/admin/words.html" className="text-primary hover:underline flex items-center gap-2">
                    <i data-feather="arrow-left"></i> Back to Words </a>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                        <i data-feather="edit-2" className="text-primary"></i>
                    </div>
                    <div>
                        <h2 className="font-bold">Wahala</h2>
                        <p className="text-gray-500 text-sm">Pidgin English</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase*</label>
                            <input type="text"
                            onChange = {(e) => setWord(e.target.value)}
                             value={word} required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language*</label>
                            <select required
                            onChange = {(e) => setLanguage(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                <option value="pidgin" selected>Pidgin</option>
                                <option value="yoruba">Yoruba</option>
                                <option value="igbo">Igbo</option>
                                <option value="hausa">Hausa</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meaning*</label>
                        <textarea rows="3" required
                        onChange = {(e) => setMeaning(e.target.value)}
                        value = {meaning}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">Trouble or problem</textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                        <textarea rows="2"
                        onChange = {(e) => setExample(e.target.value)}
                        value = {example}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">"No wahala" means "No problem"</textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                            onChange = {(e) => setCategory(e.target.value)}

                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                <option value="">Select Category</option>
                                <option value="slang" selected>Slang</option>
                                <option value="proverb">Proverb</option>
                                <option value="greeting">Greeting</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                            <select required
                            onChange = {(e) => setStatus(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                <option value="approved" selected>Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium mb-4">Metadata</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                                <input type="text" 
                                onChange={(e) => setCreator(e.target.value)}
                                value = {creator}
                                readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                <input type="text" onChange = {(e) => setTime} value={time} readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button"
                            className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                            <i data-feather="trash-2"></i> Delete </button>
                        <button type="submit"
                            className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                            <i data-feather="save"></i> Save Changes </button>
                    </div>
                </form>
            </div>
        </main>
    </div>   
    </div>
  )
}

export default page