"use client";
import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TRENDING_ITEMS = [
  { id: 1, img: "https://picsum.photos/seed/movie1/400/600" },
  { id: 2, img: "https://picsum.photos/seed/movie2/400/600" },
  { id: 3, img: "https://picsum.photos/seed/movie3/400/600" },
  { id: 4, img: "https://picsum.photos/seed/movie4/400/600" },
  { id: 5, img: "https://picsum.photos/seed/movie5/400/600" },
  { id: 6, img: "https://picsum.photos/seed/movie6/400/600" },
  { id: 7, img: "https://picsum.photos/seed/movie7/400/600" },
  { id: 8, img: "https://picsum.photos/seed/movie8/400/600" },
  { id: 9, img: "https://picsum.photos/seed/movie9/400/600" },
  { id: 10, img: "https://picsum.photos/seed/movie10/400/600" },
];

export default function TrendingCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mt-12">
      <h2 className="text-2xl font-bold mb-6">Tendances actuelles</h2>
      
      <div className="group relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-r-lg"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x relative z-10 pb-8 pt-4 -mt-4 px-2 -mx-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TRENDING_ITEMS.map((item, index) => (
            <div 
              key={item.id} 
              className="relative flex-none w-36 md:w-48 lg:w-56 aspect-[2/3] snap-start hover:scale-105 transition-transform duration-300 origin-bottom"
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden ml-8">
                <Image 
                  src={item.img} 
                  alt={`Tendance ${item.id}`} 
                  layout="fill" 
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <span 
                className="absolute -left-4 -bottom-6 text-[100px] md:text-[140px] font-black leading-none tracking-tighter"
                style={{
                  WebkitTextStroke: '2px #555',
                  color: 'black',
                  textShadow: '0 0 20px rgba(0,0,0,0.8)'
                }}
              >
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
