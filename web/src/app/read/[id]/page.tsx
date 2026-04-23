"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Maximize } from "lucide-react";

export default function ReadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [content, setContent] = useState<any>(null);
  
  useEffect(() => {
    const fetchContent = async () => {
      const token = localStorage.getItem("token");
      const profileStr = localStorage.getItem("selectedProfile");
      const profile = (profileStr && profileStr !== "undefined") ? JSON.parse(profileStr) : {};

      if (!token) {
        router.push("/login");
        return;
      }

      const url = new URL(`http://localhost:3001/content/${id}`);
      if (profile.id) url.searchParams.append("profileId", profile.id);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setContent(await res.json());
      } else {
        router.push("/ebooks");
      }
    };
    
    fetchContent();
  }, [id, router]);

  const getPdfUrl = () => {
    if (!content) return "";
    let url = content.url;
    if (content.progress) {
      url += `#page=${content.progress}`;
    } else {
      url += "#view=FitH";
    }
    return url;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!content) return <div className="h-screen bg-[#141414] flex justify-center items-center"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-screen w-screen bg-[#141414] flex flex-col overflow-hidden text-white">
      {/* Top Bar */}
      <div className="h-16 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft className="w-6 h-6" />
            <span className="hidden md:inline text-sm font-medium">Retour</span>
          </button>
          <div className="w-px h-6 bg-gray-700 mx-2"></div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h1 className="text-lg font-bold line-clamp-1">{content.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition" title="Plein écran">
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* PDF Reader Area */}
      <div className="flex-1 bg-white relative w-full h-full">
        <iframe 
          src={getPdfUrl()} 
          className="w-full h-full border-none absolute inset-0"
          title={content.title}
        />
      </div>
    </div>
  );
}
