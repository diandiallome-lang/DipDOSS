"use client";
import { Play, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  year: number;
  type: string;
}

export default function Billboard({ content }: { content: FeaturedContent | null }) {
  if (!content) return <div className="h-[70vh] bg-black w-full" />;

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full">
      <div className="absolute inset-0">
        <Image 
          src={content.thumbnail} 
          alt={content.title} 
          layout="fill" 
          objectFit="cover" 
          priority 
          className="brightness-[0.6] object-top"
        />
        {/* Gradient overlays to blend smoothly into the content below */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
      </div>

      <div className="absolute bottom-[20%] left-4 md:left-12 w-[90%] md:w-[50%] lg:w-[40%] text-white">
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-2xl line-clamp-2">
          {content.title}
        </h1>
        <p className="text-lg text-gray-200 mb-6 drop-shadow-md line-clamp-3 md:line-clamp-4">
          {content.description}
        </p>
        <div className="flex gap-4">
          <Link href={content.type === 'EBOOK' ? `/read/${content.id}` : `/watch/${content.id}`} className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded hover:bg-white/80 transition-colors font-bold text-lg">
            <Play className="w-6 h-6 fill-current" /> Lecture
          </Link>
          <button className="flex items-center gap-2 bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-500/50 transition-colors font-bold text-lg">
            <Info className="w-6 h-6" /> Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}
