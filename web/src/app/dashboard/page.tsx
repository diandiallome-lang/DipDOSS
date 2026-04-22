"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Book, LogOut, User } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const profileStr = localStorage.getItem("selectedProfile");
    if (!profileStr) {
      router.push("/profiles");
      return;
    }

    try {
      setActiveProfile(JSON.parse(profileStr));
    } catch {
      router.push("/profiles");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedProfile");
    router.push("/login");
  };

  const handleSwitchProfile = () => {
    localStorage.removeItem("selectedProfile");
    router.push("/profiles");
  };

  if (!activeProfile) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Sidebar / Topbar */}
      <nav className="border-b border-white/10 p-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent cursor-pointer">
          DipDOSS
        </h1>
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleSwitchProfile}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-white transition-colors relative">
              {activeProfile.avatar ? (
                <Image src={activeProfile.avatar} alt={activeProfile.name} layout="fill" objectFit="cover" />
              ) : (
                <User className="w-full h-full p-2 bg-gray-800 text-gray-400" />
              )}
            </div>
            <span className="hidden md:block font-medium text-gray-300 group-hover:text-white transition-colors">
              {activeProfile.name}
            </span>
          </div>

          <div className="w-px h-6 bg-white/20"></div>

          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="p-8">
        <header className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Bonjour, {activeProfile.name}</h2>
          <p className="text-gray-400">Prêt à explorer notre catalogue ?</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Streaming Section Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/20 flex flex-col justify-between h-64 cursor-pointer"
          >
            <div>
              <Film className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold">Streaming Vidéo</h3>
              <p className="text-gray-400">Films, séries et documentaires en 4K.</p>
            </div>
            <button className="text-purple-400 font-semibold hover:underline">Accéder →</button>
          </motion.div>

          {/* Ebooks Section Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 flex flex-col justify-between h-64 cursor-pointer"
          >
            <div>
              <Book className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold">Bibliothèque Ebooks</h3>
              <p className="text-gray-400">Des milliers de livres et livres audio.</p>
            </div>
            <button className="text-blue-400 font-semibold hover:underline">Accéder →</button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
