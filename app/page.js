import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col">
      <main>
        <CustomNavbar/>
                <section className="bg-gradient-to-r from-primary to-accent py-20 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold mb-6">Preserve Nigerian Languages & Culture</h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">Discover, learn, and contribute to the rich linguistic
                            heritage of Nigeria</p>
                        <div className="max-w-xl mx-auto relative">
                            <input type="text" placeholder="Search Naija words or phrases..."
                                className="w-full py-4 px-6 rounded-full text-gray-800 shadow-lg"></input>
                            <button className="absolute right-2 top-2 bg-secondary text-white p-2 rounded-full">
                                <i data-feather="search"></i>
                            </button>
                        </div>
                    </div>
                </section>
                <section className="py-16 container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">Trending Words This Week</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold text-secondary">Wahala</h3>
                                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">Pidgin</span>
                                </div>
                                <p className="mt-2 text-gray-600">Trouble or problem</p>
                                <div className="mt-4 flex items-center">
                                    <button className="flex items-center text-primary">
                                        <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold text-secondary">Omo</h3>
                                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">Yoruba</span>
                                </div>
                                <p className="mt-2 text-gray-600">Child or used as an exclamation</p>
                                <div className="mt-4 flex items-center">
                                    <button className="flex items-center text-primary">
                                        <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold text-secondary">Kai</h3>
                                    <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">Hausa</span>
                                </div>
                                <p className="mt-2 text-gray-600">Expression of surprise or emphasis</p>
                                <div className="mt-4 flex items-center">
                                    <button className="flex items-center text-primary">
                                        <i data-feather="play-circle" className="mr-2"></i> Listen </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 bg-secondary text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">Help preserve Nigerian languages by contributing words,
                            meanings, and pronunciations</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="/submit-word.html"
                                className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
                                Contribute a Word </a>
                            <a href="/explore.html"
                                className="bg-white hover:bg-gray-100 text-secondary font-bold py-3 px-6 rounded-full transition-colors">
                                Explore Words </a>
                        </div>
                    </div>
                </section>
            </main>
            <CustomFooter/>
            
    </div>
  );
}
