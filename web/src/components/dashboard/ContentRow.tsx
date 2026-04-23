"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  year: number;
  rating: number;
  duration: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
}

export default function ContentRow({ title, items }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<ContentItem | null>(null);

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-1 md:space-y-2 px-4 md:px-12 mt-8">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
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
          className="flex items-center space-x-1.5 md:space-x-2.5 overflow-x-hidden scrollbar-hide py-4"
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] hover:z-50"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Image 
                src={item.thumbnail}
                alt={item.title}
                layout="fill"
                className="rounded-sm object-cover md:rounded"
              />

              {/* Hover Card Effect */}
              <AnimatePresence>
                {hoveredItem?.id === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1.15 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-8 -left-4 w-[220px] md:w-[320px] bg-[#181818] rounded-md shadow-xl overflow-hidden z-50 border border-gray-800"
                  >
                    <div className="relative h-32 md:h-40 w-full">
                      <Image src={item.thumbnail} alt={item.title} layout="fill" className="object-cover" />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/80">
                            <Play className="w-4 h-4 md:w-5 md:h-5 text-black fill-current" />
                          </button>
                          <button className="w-8 h-8 md:w-10 md:h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 text-white">
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button className="w-8 h-8 md:w-10 md:h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 text-white">
                            <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                        <button className="w-8 h-8 md:w-10 md:h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 text-white">
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                      
                      <div className="text-white text-sm font-bold flex gap-2 items-center">
                        <span className="text-green-500">{item.rating * 20}% Recommandé</span>
                        <span className="border border-gray-500 px-1 text-xs">16+</span>
                        <span>{item.duration || item.year}</span>
                      </div>
                      
                      <div className="text-white text-sm line-clamp-1">{item.title}</div>
                    </div>
                  </motion.div>
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
