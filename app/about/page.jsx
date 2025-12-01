"use client";
import CustomFooter from '@/components/customFooter';
import CustomNavbar from '@/components/navBar';
import React, { useEffect } from 'react';
import feather from "feather-icons";

const About = () => {
  useEffect(() => {
    feather.replace(); // initialize feather icons
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomNavbar/>
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                About NaijaLingo
              </h1>
              <p className="text-gray-600 text-base font-normal">
                Preserving Nigeria's rich linguistic heritage for future generations
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              {/* Mission Section */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  NaijaLingo is dedicated to preserving and celebrating the rich linguistic heritage of Nigeria. 
                  We aim to create a comprehensive resource for Nigerian languages, including Pidgin, Yoruba, Igbo, Hausa, and more.
                </p>
              </section>

              {/* What We Do Section */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">What We Do</h2>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start gap-3">
                    <i data-feather="check-circle" className="w-4 h-4 text-yellow-500500 mt-0.5 flex-shrink-0"></i>
                    <span className="text-base">Document Nigerian words, phrases, and proverbs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i data-feather="check-circle" className="w-4 h-4 text-yellow-500500 mt-0.5 flex-shrink-0"></i>
                    <span className="text-base">Provide accurate meanings and pronunciations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i data-feather="check-circle" className="w-4 h-4 text-yellow-500500 mt-0.5 flex-shrink-0"></i>
                    <span className="text-base">Offer cultural context for language usage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i data-feather="check-circle" className="w-4 h-4 text-yellow-500500 mt-0.5 flex-shrink-0"></i>
                    <span className="text-base">Build a community of language enthusiasts</span>
                  </li>
                </ul>
              </section>

              {/* Team Section */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <div className="bg-yellow-500500/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                      <i data-feather="user" className="text-yellow-500500 w-6 h-6"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">Adebayo Adeleke</h3>
                    <p className="text-sm text-gray-600 font-normal">Founder & CEO</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <div className="bg-yellow-500500/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                      <i data-feather="book" className="text-yellow-500500 w-6 h-6"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">Chioma Okeke</h3>
                    <p className="text-sm text-gray-600 font-normal">Linguistics Director</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <div className="bg-yellow-500500/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                      <i data-feather="code" className="text-yellow-500500 w-6 h-6"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">Emeka Okafor</h3>
                    <p className="text-sm text-gray-600 font-normal">Tech Lead</p>
                  </div>
                </div>
              </section>

              {/* Join Community Section */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Join Our Community</h2>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  We welcome contributors, volunteers, and language enthusiasts to help grow this resource.
                </p>
                <a href="/signup"
                   className="inline-block bg-yellow-500 hover:bg-yellow-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base hover:shadow-md">
                   Join us
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default About;