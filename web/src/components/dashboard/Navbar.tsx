"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  name: string;
  avatar: string | null;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    const savedProfile = localStorage.getItem("selectedProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedProfile");
    router.push("/");
  };

  const handleSwitchProfile = () => {
    localStorage.removeItem("selectedProfile");
    router.push("/profiles");
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center gap-8">
        <Link href="/dashboard">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent cursor-pointer">
            DipDOSS
          </h1>
        </Link>
        <div className="hidden md:flex gap-5 text-sm font-medium text-gray-200">
          <Link href="/dashboard" className="hover:text-white transition-colors text-white font-bold">Accueil</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Séries</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Films</Link>
          <Link href="/ebooks" className="hover:text-white transition-colors">Ebooks</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Ma Liste</Link>
        </div>
      </div>

      <div className="flex items-center gap-6 text-white">
        <Search className="w-6 h-6 cursor-pointer" />
        <Bell className="w-6 h-6 cursor-pointer" />
        
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded overflow-hidden relative">
              {profile?.avatar ? (
                <Image src={profile.avatar} alt="Profile" layout="fill" objectFit="cover" />
              ) : (
                <User className="w-full h-full p-1 bg-gray-800" />
              )}
            </div>
            <span className="hidden md:block text-sm">{profile?.name}</span>
          </div>
          
          <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="bg-black/90 border border-gray-800 rounded-md py-2 w-48 shadow-xl">
              <button onClick={handleSwitchProfile} className="w-full text-left px-4 py-2 text-sm hover:underline flex items-center gap-2">
                <User className="w-4 h-4" /> Gérer les profils
              </button>
              <div className="h-px bg-gray-800 my-2"></div>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:underline flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
