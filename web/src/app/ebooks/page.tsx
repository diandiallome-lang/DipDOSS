"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Billboard from "@/components/dashboard/Billboard";
import ContentRow from "@/components/dashboard/ContentRow";

export default function EbooksPage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any>(null);
  const [continueReading, setContinueReading] = useState<any[]>([]);
  const [romans, setRomans] = useState<any[]>([]);
  const [scifi, setScifi] = useState<any[]>([]);
  const [devPerso, setDevPerso] = useState<any[]>([]);
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
    const profile = JSON.parse(profileStr);

    const fetchContent = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [featRes, romRes, sciRes, devRes, contRes] = await Promise.all([
          // In a real app we'd have an endpoint for a featured ebook specifically
          fetch("http://localhost:3001/content/category/EBOOK/Roman", { headers }),
          fetch("http://localhost:3001/content/category/EBOOK/Roman", { headers }),
          fetch("http://localhost:3001/content/category/EBOOK/Science-Fiction", { headers }),
          fetch("http://localhost:3001/content/category/EBOOK/Développement Personnel", { headers }),
          fetch(`http://localhost:3001/content/continue-watching/${profile.id}`, { headers }),
        ]);

        if (featRes.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        const featData = await featRes.json();
        setFeatured(featData.length > 0 ? featData[0] : null);
        setRomans(featData);
        setScifi(await sciRes.json());
        setDevPerso(await devRes.json());
        
        const contData = await contRes.json();
        setContinueReading(contData.filter((item: any) => item.type === 'EBOOK'));
        
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
          {continueReading.length > 0 && (
            <ContentRow title="Reprendre la lecture" items={continueReading} />
          )}
          <ContentRow title="Romans populaires" items={romans} />
          <ContentRow title="Science-Fiction" items={scifi} />
          <ContentRow title="Développement Personnel" items={devPerso} />
        </div>
      </main>
    </div>
  );
}
