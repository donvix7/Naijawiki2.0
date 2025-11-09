import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar'
import React from 'react'
import feather from "feather-icons";

const about = () => {
  return (
    <div>
        <CustomNavbar/>
    <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-secondary mb-8 text-center">About NaijaLingo</h1>
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-6">NaijaLingo is dedicated to preserving and celebrating the rich linguistic
                    heritage of Nigeria. We aim to create a comprehensive resource for Nigerian languages, including
                    Pidgin, Yoruba, Igbo, Hausa, and more.</p>
                <h2 className="text-2xl font-bold text-secondary mb-4">What We Do</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                    <li>Document Nigerian words, phrases, and proverbs</li>
                    <li>Provide accurate meanings and pronunciations</li>
                    <li>Offer cultural context for language usage</li>
                    <li>Build a community of language enthusiastnpms</li>
                </ul>
                <h2 className="text-2xl font-bold text-secondary mb-4">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                            <i data-feather="user" className="text-primary"></i>
                        </div>
                        <h3 className="font-bold">Adebayo Adeleke</h3>
                        <p className="text-sm text-gray-600">Founder & CEO</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                            <i data-feather="book" className="text-primary"></i>
                        </div>
                        <h3 className="text-primary font-bold">Chioma Okeke</h3>
                        <p className="text-sm text-gray-600">Linguistics Director</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                            <i data-feather="code" className="text-primary"></i>
                        </div>
                        <h3 className="font-bold">Emeka Okafor</h3>
                        <p className="text-sm text-gray-600">Tech Lead</p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Join Our Community</h2>
                <p className="text-gray-700 mb-4">We welcome contributors, volunteers, and language enthusiasts to help grow
                    this resource.</p>
                <a href="/volunteer"
                    className="inline-block bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors btn-outline">
                    Become a Volunteer </a>
            </div>
        </div>
    </main>
    <CustomFooter/>
     </div>
  )
}

export default about