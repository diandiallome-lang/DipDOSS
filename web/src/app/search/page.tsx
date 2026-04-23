"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3001/content/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          setResults(await res.json());
        }
        setLoading(false);
      } catch (error) {
        console.error("Error searching content", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return <div className="flex items-center justify-center h-[50vh]">
      <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-4">
      {results.length > 0 ? (
        results.map((item) => (
          <div key={item.id} className="relative group">
            <div 
              className="relative h-28 md:h-40 w-full cursor-pointer transition duration-200 ease-out hover:scale-105"
              onClick={() => router.push(item.type === 'EBOOK' ? `/read/${item.id}` : `/watch/${item.id}`)}
            >
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="rounded-md object-cover w-full h-full shadow-lg"
              />
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-semibold truncate">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.year} • {item.category}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center h-[40vh] text-gray-500 text-center">
          <p className="text-xl">Aucun résultat pour "{query}"</p>
          <p className="text-sm mt-2">Essayez avec d'autres mots-clés ou explorez les catégories.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="relative min-h-screen bg-[#141414] text-white">
      <Navbar />
      
      <main className="pt-24 pb-24 px-4 md:px-12">
        <Suspense fallback={<div>Chargement...</div>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
