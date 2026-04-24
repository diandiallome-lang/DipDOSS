"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Plus, Check, ThumbsUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  year: number;
  rating: number;
  duration: string;
  type: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  isTop10?: boolean;
}

export default function ContentRow({ title, items, isTop10 }: ContentRowProps) {
  const router = useRouter();
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<ContentItem | null>(null);
  const [localFavorites, setLocalFavorites] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const profileStr = localStorage.getItem("selectedProfile");
    const profile = (profileStr && profileStr !== "undefined") ? JSON.parse(profileStr) : {};

    if (!token || !profile.id) return;

    try {
      const res = await fetch("http://localhost:3001/content/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profileId: profile.id, contentId: item.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setLocalFavorites(prev => ({ ...prev, [item.id]: data.isFavorite }));
        
        // Show toast
        setToast({ 
          message: data.isFavorite ? `Ajouté à votre liste : ${item.title}` : `Retiré de votre liste : ${item.title}`, 
          visible: true 
        });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const isItemFavorite = (item: ContentItem) => {
    if (localFavorites[item.id] !== undefined) return localFavorites[item.id];
    return item.isFavorite;
  };

  return (
    <div className="space-y-1 md:space-y-2 px-4 md:px-12 mt-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-6 py-3 rounded shadow-2xl font-bold flex items-center gap-2"
          >
            <Check className="w-5 h-5 text-green-600" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <h2 className="w-full cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      
      <div className="group relative md:-ml-2">
        <button 
          className={`absolute left-0 top-0 bottom-0 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/40 hover:bg-black/80 ${!isMoved && "hidden"}`}
          onClick={() => handleClick("left")}
        >
          <ChevronLeft className="mx-auto h-9 w-9" />
        </button>

        <div 
          ref={rowRef} 
          className={`flex items-center space-x-1.5 md:space-x-2.5 overflow-x-hidden scrollbar-hide py-4 ${isTop10 ? "md:space-x-8" : ""}`}
        >
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`relative cursor-pointer transition duration-200 ease-out hover:z-50 flex items-end ${
                item.type === 'EBOOK' 
                  ? "h-40 min-w-[110px] md:h-52 md:min-w-[140px] hover:scale-125" 
                  : isTop10 
                    ? "h-36 min-w-[200px] md:h-48 md:min-w-[280px]"
                    : "h-28 min-w-[180px] md:h-36 md:min-w-[260px]"
              }`}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Giant Number for Top 10 */}
              {isTop10 && (
                <div className="absolute -left-6 bottom-0 z-0 select-none">
                  <span className="text-[120px] md:text-[180px] font-black text-black leading-none" style={{ WebkitTextStroke: "2px #555" }}>
                    {index + 1}
                  </span>
                </div>
              )}

              <div className={`relative w-full h-full ${isTop10 ? "ml-12 md:ml-20" : ""}`}>
                <Image 
                  src={item.thumbnail}
                  alt={item.title}
                  layout="fill"
                  className="rounded-sm object-cover md:rounded shadow-lg"
                />

                {/* Merchandising Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                  {(isTop10 || Math.random() > 0.8) && (
                    <div className="bg-red-600 text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-xl flex items-center gap-1">
                      <span className="text-[10px] md:text-[12px]">10</span>
                      <div className="flex flex-col leading-none">
                        <span>TOP</span>
                      </div>
                    </div>
                  )}
                  {Math.random() > 0.8 && (
                    <div className="bg-white text-black text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-xl">
                      Nouveau
                    </div>
                  )}
                </div>

                {/* Progress Bar (Simulated for 'Reprendre') */}
                {title.includes("Reprendre") && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600 rounded-b overflow-hidden">
                    <div 
                      className="bg-red-600 h-full" 
                      style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Hover Card Effect */}
              <AnimatePresence>
                {hoveredItem?.id === item.id && item.type !== 'EBOOK' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1.15 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-8 left-0 w-[220px] md:w-[320px] bg-[#181818] rounded-md shadow-xl overflow-hidden z-50 border border-gray-800"
                  >
                    <div className="relative h-32 md:h-40 w-full">
                      <Image src={item.thumbnail} alt={item.title} layout="fill" className="object-cover" />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Link href={`/watch/${item.id}`} className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/80">
                            <Play className="w-4 h-4 md:w-5 md:h-5 text-black fill-current ml-1" />
                          </Link>
                          <button 
                            onClick={(e) => handleToggleFavorite(e, item)}
                            className="w-8 h-8 md:w-10 md:h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 text-white"
                          >
                            {isItemFavorite(item) ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
                          </button>
                        </div>
                        <button className="w-8 h-8 md:w-10 md:h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 text-white">
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                      
                      <div className="text-white text-sm font-bold flex gap-2 items-center">
                        <span className="text-green-500">{Math.floor(item.rating * 20)}% Recommandé</span>
                        <span className="border border-gray-500 px-1 text-xs">16+</span>
                        <span>{item.duration || item.year}</span>
                      </div>
                      
                      <div className="text-white text-sm line-clamp-1">{item.title}</div>
                    </div>
                  </motion.div>
                )}
                
                {/* Specific Click Handler for Ebooks */}
                {hoveredItem?.id === item.id && item.type === 'EBOOK' && (
                  <div 
                    className="absolute inset-0 z-[60] flex items-center justify-center"
                    onClick={() => router.push(`/read/${item.id}`)}
                  >
                    <div className="bg-black/60 p-2 rounded-full backdrop-blur-sm">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <button 
          className="absolute right-0 top-0 bottom-0 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/40 hover:bg-black/80"
          onClick={() => handleClick("right")}
        >
          <ChevronRight className="mx-auto h-9 w-9" />
        </button>
      </div>
    </div>
  );
}
