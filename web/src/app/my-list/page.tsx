"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import ContentRow from "@/components/dashboard/ContentRow";

export default function MyListPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const profileStr = localStorage.getItem("selectedProfile");
    const profile = JSON.parse(profileStr || "{}");

    if (!profile.id) {
      router.push("/profiles");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:3001/content/list/${profile.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          setFavorites(await res.json());
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites", error);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="relative min-h-screen bg-[#141414] text-white">
      <Navbar />
      
      <main className="pt-24 pb-24 px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Ma Liste</h1>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-4">
            {/* We can use ContentRow logic here or just a simple grid of cards */}
            {/* For now, let's wrap them in a ContentRow for consistency if we want the hover effect, 
                but ContentRow is horizontal. Let's just render the grid items manually or 
                refactor the HoverCard into a separate component. 
                Since we want to be fast, I'll use a simple grid layout for now. */}
            {favorites.map((item) => (
              <div key={item.id} className="relative group">
                <div className="relative h-28 md:h-40 w-full cursor-pointer transition duration-200 ease-out hover:scale-105">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="rounded-md object-cover w-full h-full shadow-lg"
                    onClick={() => router.push(item.type === 'EBOOK' ? `/read/${item.id}` : `/watch/${item.id}`)}
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.year} • {item.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <p className="text-xl">Votre liste est vide.</p>
            <p className="text-sm mt-2">Ajoutez des films et des livres pour les retrouver ici.</p>
          </div>
        )}
      </main>
    </div>
  );
}
