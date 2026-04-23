"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [content, setContent] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        const data = await res.json();
        setContent(data);
        
        // Initial seek to saved position
        if (data.progress && videoRef.current) {
          videoRef.current.currentTime = parseFloat(data.progress);
        }
      } else {
        router.push("/dashboard");
      }
    };
    
    fetchContent();
  }, [id, router]);

  useEffect(() => {
    if (!content) return;

    const interval = setInterval(() => {
      saveProgress();
    }, 10000); // Save every 10 seconds

    return () => {
      clearInterval(interval);
      saveProgress(); // Final save on unmount
    };
  }, [content]);

  const saveProgress = async () => {
    if (!videoRef.current || !content) return;

    const profileStr = localStorage.getItem("selectedProfile");
    const profile = (profileStr && profileStr !== "undefined") ? JSON.parse(profileStr) : {};
    const token = localStorage.getItem("token");

    if (!profile.id || !token) return;

    const position = videoRef.current.currentTime.toString();
    const completed = videoRef.current.currentTime > videoRef.current.duration * 0.95;

    try {
      await fetch("http://localhost:3001/content/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: profile.id,
          contentId: content.id,
          position,
          completed,
        }),
      });
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && isFinite(videoRef.current.duration)) {
      const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  if (!content) return <div className="h-screen bg-black flex justify-center items-center"><div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div ref={containerRef} className="relative h-screen w-screen bg-black overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={content.url}
        autoPlay
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      ></video>

      {/* Overlay Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="p-8 flex items-center gap-6 bg-gradient-to-b from-black/80 to-transparent">
              <button onClick={() => router.back()} className="text-white hover:text-gray-300 transition">
                <ArrowLeft className="w-10 h-10" />
              </button>
              <h1 className="text-white text-2xl font-bold">{content.title}</h1>
            </div>

            {/* Bottom Bar */}
            <div className="p-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4">
              <div className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="h-full bg-[#E50914] rounded-full transition-all duration-100 ease-linear relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#E50914] rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-6">
                  <button onClick={togglePlay} className="hover:scale-110 transition">
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                  </button>
                  <button onClick={toggleMute} className="hover:scale-110 transition">
                    {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                  </button>
                </div>
                <div>
                  <button onClick={toggleFullscreen} className="hover:scale-110 transition">
                    <Maximize className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
