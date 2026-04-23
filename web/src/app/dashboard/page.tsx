"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Billboard from "@/components/dashboard/Billboard";
import ContentRow from "@/components/dashboard/ContentRow";

export default function Dashboard() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
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
    if (!profileStr) {
      router.push("/profiles");
      return;
    }

    const fetchContent = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all categories in parallel
        const [featRes, trendRes, actRes, comRes, sciRes] = await Promise.all([
          fetch("http://localhost:3001/content/featured", { headers }),
          fetch("http://localhost:3001/content/trending", { headers }),
          fetch("http://localhost:3001/content/category/MOVIE/Action", { headers }),
          fetch("http://localhost:3001/content/category/MOVIE/Comédie", { headers }),
          fetch("http://localhost:3001/content/category/MOVIE/Sci-Fi", { headers }),
        ]);

        if (featRes.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        setFeatured(await featRes.json());
        setTrending(await trendRes.json());
        setActionMovies(await actRes.json());
        setComedies(await comRes.json());
        setScifi(await sciRes.json());
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

  return (
    <div className="relative min-h-screen bg-[#141414] text-white">
      <Navbar />
      
      <main className="pb-24">
        <Billboard content={featured} />
        
        <div className="relative z-20 -mt-24 md:-mt-32 space-y-8">
          <ContentRow title="Tendances actuelles" items={trending} />
          <ContentRow title="Action & Aventure" items={actionMovies} />
          <ContentRow title="Comédies" items={comedies} />
          <ContentRow title="Science-Fiction" items={scifi} />
        </div>
      </main>
    </div>
  );
}
