"use client";
import React, { useState } from 'react'

const SubmitWordForm = () => {
    
        const [word, setWord] = useState("");
        const [meaning, setMeaning] = useState("");
        const [language, setLanguage] =useState("");
        const [example, setExample] = useState("");
        const [category, setCategory] = useState("");
        const [tags, setTags] = useState("");  
        const [information, setInformation] = useState(""); 
        const [prononciation, setPrononciation] = useState(""); 
        const [creatorName, setCreatorName] = useState("");
        const [creatorEmail, setCreatorEmail] = useState("");
        const [creatorOrigin, setCreatorOrigin] = useState("");
    
        const handleSubmit = async (e) => {
                    console.log(word);
                    console.log(meaning, language, example, category, tags, information, prononciation, creatorName, creatorEmail, creatorOrigin);
                    e.preventDefault();
            
                     try {
                           const res = await fetch("http://wiki-server.giguild.com/api/words",
                         { method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            word, 
                            meaning, 
                            language, 
                            example, 
                            information,
                            creatorName,
                            tags,
                            creatorEmail,
                            creatorOrigin
                        })
                   });
                    if(!res.ok) {
                        console.log("Error submitting word");
                    }
                    return res.json()
                     }
            
                 catch(error) {
                    console.log(error);
                }
        }
  return (
    <div>
        <form onSubmit = {handleSubmit} id="wordForm" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase*</label>
                                <input type="text" id="word" required
                                onChange = {(e) => setWord(e.target.value )}
                                    value = {word}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language*</label>
                                <select id="language" required
                                   onChange = {(e) => setLanguage(e.target.value )}
                                   value={language}
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
                                onChange = {(e) => setMeaning(e.target.value)}
                                value = {meaning}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        <div>
                            <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                            <textarea id="example" rows="2"
                                onChange = {(e) => setExample(e.target.value)}
                                value = {example}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="E.g., 'No wahala, I go do am'"></textarea>
                        </div>
    {                   // <!-- Category & Tags -->
    }                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select id="category"
                                onChange = {(e) => setCategory(e.target.value)}
                                value = {category}
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
                                onChange = {(e) => setTags(e.target.value)}
                                value = {tags}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="E.g., youth,urban,music"/>
                            </div>
                        </div>
    {                   // <!-- Pronunciation -->
    }                    <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pronunciation</label>
                            <div className="flex items-center gap-4">
                                
                                <input type="text" id="pronunciation"
                                    onChange = {(e) => setPrononciation(e.target.value)}
                                    value = {prononciation} 
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
                                onChange = {(e) => setInformation(e.target.value)}
                                value = {information}
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
                                        onChange = {(e) => setCreatorName(e.target.value)}
                                        value = {creatorName}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" id="email"
                                    onChange = {(e) => setCreatorEmail(e.target.value)}
                                    value = {creatorEmail}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Your Connection to
                                    This Word</label>
                                <textarea id="origin" rows="2"
                                    onChange = {(e) => setCreatorOrigin(e.target.value)}
                                        value = {creatorOrigin}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="How do you know this word? Where did you learn it?"></textarea>
                            </div>
                        </div>
    {                   // <!-- Submission -->
    }                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                            <button type="reset"
                            onClick = {() => {
                                setWord("");
                                setMeaning("");
                                setLanguage("");
                                setExample("");
                                setCategory("");
                                setTags("");
                                setInformation("");
                                setPrononciation("");
                                setCreatorName("");
                                setCreatorEmail("");
                                setCreatorOrigin("");
                            }}

                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors">
                                Reset Form </button>
                            <button type="submit"
                                className="bg-primary btn btn-outline hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <i data-feather="send"></i> Submit Word </button>
                        </div>
                    </form>
    </div>
  )
}

export default SubmitWordForm