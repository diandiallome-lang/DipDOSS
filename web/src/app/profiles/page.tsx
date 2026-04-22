"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, User as UserIcon } from "lucide-react";
import Image from "next/image";

interface Profile {
  id: string;
  name: string;
  avatar: string;
  isChild: boolean;
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileIsChild, setNewProfileIsChild] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchProfiles = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/profiles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error("Failed to fetch profiles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [router]);

  const handleSelectProfile = (profile: Profile) => {
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
    router.push("/dashboard");
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3001/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProfileName,
          isChild: newProfileIsChild,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création");
      }

      setProfiles([...profiles, data]);
      setShowAddModal(false);
      setNewProfileName("");
      setNewProfileIsChild(false);
    } catch (err: any) {
      setError(Array.isArray(err.message) ? err.message[0] : err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">Qui regarde ?</h1>

      <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => handleSelectProfile(profile)}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden mb-4 border-2 border-transparent group-hover:border-white transition-all relative bg-gray-800">
              <Image 
                src={profile.avatar} 
                alt={profile.name} 
                layout="fill"
                objectFit="cover"
              />
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors text-xl font-medium">
              {profile.name}
            </span>
          </motion.div>
        ))}

        {profiles.length < 5 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => setShowAddModal(true)}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center mb-4 border-2 border-gray-600 group-hover:border-white group-hover:bg-white/10 transition-all bg-transparent">
              <Plus className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors text-xl font-medium">
              Ajouter
            </span>
          </motion.div>
        )}
      </div>

      <button className="mt-16 px-6 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors text-lg uppercase tracking-widest font-medium">
        Gérer les profils
      </button>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Ajouter un profil</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleAddProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nom du profil</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Nom"
                />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="isChild"
                  className="w-5 h-5 rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-800"
                  checked={newProfileIsChild}
                  onChange={(e) => setNewProfileIsChild(e.target.checked)}
                />
                <label htmlFor="isChild" className="text-gray-300">Profil enfant (Contrôle parental)</label>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-transparent border border-gray-600 text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all"
                >
                  Continuer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
