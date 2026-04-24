"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Billboard from "@/components/dashboard/Billboard";
import ContentRow from "@/components/dashboard/ContentRow";
import Footer from "@/components/dashboard/Footer";

export default function Dashboard() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [actionMovies, setActionMovies] = useState<any[]>([]);
  const [comedies, setComedies] = useState<any[]>([]);
  const [scifi, setScifi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const profileStr = localStorage.getItem("selectedProfile");
    if (!profileStr || profileStr === "undefined") {
      router.push("/profiles");
      return;
    }

    let profile;
    try {
      profile = JSON.parse(profileStr);
    } catch (e) {
      console.error("Failed to parse profile", e);
      router.push("/profiles");
      return;
    }

    const fetchContent = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all categories in parallel
        const [featRes, trendRes, actRes, comRes, sciRes, contRes] = await Promise.all([
          fetch("http://localhost:3001/content/featured", { headers }),
          fetch("http://localhost:3001/content/trending", { headers }),
          fetch("http://localhost:3001/content/category/MOVIE/Action", { headers }),
          fetch("http://localhost:3001/content/category/MOVIE/Comédie", { headers }),
          fetch("http://localhost:3001/content/category/MOVIE/Sci-Fi", { headers }),
          fetch(`http://localhost:3001/content/continue-watching/${profile.id}`, { headers }),
        ]);

        if (featRes.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        // Filter helper to exclude Ebooks from general video rows
        const filterVideos = (items: any[]) => items.filter(item => item.type !== 'EBOOK');

        setFeatured(await featRes.json());
        setTrending(filterVideos(await trendRes.json()));
        setActionMovies(filterVideos(await actRes.json()));
        setComedies(filterVideos(await comRes.json()));
        setScifi(filterVideos(await sciRes.json()));
        setContinueWatching(filterVideos(await contRes.json()));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content", error);
        setLoading(false);
      }
    };

    fetchContent();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  // Get profile name for personalization
  const profileName = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("selectedProfile") || '{}').name : '';

  return (
    <div className="relative min-h-screen bg-[#141414] text-white">
      <Navbar />
      
      <main className="pb-24">
        <Billboard content={featured} />
        
        <div className="relative z-20 -mt-24 md:-mt-32 space-y-8">
          {continueWatching.length > 0 && (
            <ContentRow title={`Reprendre avec le profil de ${profileName || 'Dian'}`} items={continueWatching} />
          )}
          
          <ContentRow title="Top 10 des programmes aujourd'hui : France" items={trending.slice(0, 10)} isTop10 />
          
          <ContentRow title="On pense que vous allez adorer..." items={trending} />
          
          <ContentRow title="Pépites pour vous" items={trending.slice().reverse()} />
          
          <ContentRow title="Séries dramatiques saluées par la critique" items={scifi} />
          
          <ContentRow title="Action et suspense à regarder sans modération" items={actionMovies} />
          
          <ContentRow title="Séries US hallucinantes" items={scifi.slice().reverse()} />
          
          <ContentRow title="Comédies pour toute la famille" items={comedies} />

          <ContentRow title="En mode hibernation : Science-fiction et Fantastique" items={scifi} />
          
          <ContentRow title="Séries policières US saluées par la critique" items={actionMovies.slice().reverse()} />
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
