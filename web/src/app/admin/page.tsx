"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Plus, Film, Book, Trash2, Edit, Upload, X, BarChart3, Users, PlayCircle } from "lucide-react";
import Navbar from "@/components/dashboard/Navbar";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, totalContent: 0, revenue: 0 });
  const [contentList, setContentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    type: "MOVIE",
    category: "Action",
    thumbnail: "",
    url: "",
    year: new Date().getFullYear(),
    rating: 5.0,
    duration: "",
    pages: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = (userStr && userStr !== "undefined") ? JSON.parse(userStr) : null;

    if (!token || !user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    fetchAdminData();
  }, [router]);

  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [statsRes, contentRes] = await Promise.all([
        fetch("http://localhost:3001/admin/stats", { headers }),
        fetch("http://localhost:3001/admin/content", { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (contentRes.ok) setContentList(await contentRes.json());
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data", error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'pdf' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10); // Simulated start

    const token = localStorage.getItem("token");
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch(`http://localhost:3001/admin/upload/${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ 
          ...prev, 
          [type === 'thumbnail' ? 'thumbnail' : 'url']: data.url 
        }));
        setUploadProgress(100);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isEdit = !!formData.id;
    
    const url = isEdit 
      ? `http://localhost:3001/admin/content/${formData.id}`
      : "http://localhost:3001/admin/content";

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ id: "", title: "", description: "", type: "MOVIE", category: "Action", thumbnail: "", url: "", year: 2024, rating: 5.0, duration: "", pages: 0 });
        fetchAdminData();
      }
    } catch (error) {
      console.error("Failed to save content", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce contenu ?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/admin/content/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) fetchAdminData();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading) return <div className="h-screen bg-black flex justify-center items-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Shield className="text-purple-500 w-10 h-10" /> Panneau CMS
            </h1>
            <p className="text-gray-400 mt-1 text-lg">Gérez votre catalogue et vos utilisateurs</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20"
          >
            <Plus className="w-6 h-6" /> Nouveau Contenu
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Users /></div>
              <span className="text-gray-400 font-medium">Utilisateurs</span>
            </div>
            <p className="text-4xl font-black">{stats.totalUsers}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Film /></div>
              <span className="text-gray-400 font-medium">Contenus</span>
            </div>
            <p className="text-4xl font-black">{stats.totalContent}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><BarChart3 /></div>
              <span className="text-gray-400 font-medium">Revenus (Simulés)</span>
            </div>
            <p className="text-4xl font-black">{stats.revenue} €</p>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/10 text-gray-300 text-sm">
                <th className="p-4 font-bold uppercase tracking-wider">Contenu</th>
                <th className="p-4 font-bold uppercase tracking-wider">Type</th>
                <th className="p-4 font-bold uppercase tracking-wider">Catégorie</th>
                <th className="p-4 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contentList.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={item.thumbnail} alt="" className="w-16 h-10 object-cover rounded shadow-md" />
                      <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.type === 'EBOOK' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{item.category}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setFormData(item); setIsModalOpen(true); }}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-transparent">
              <h2 className="text-2xl font-black">{formData.id ? 'Modifier' : 'Ajouter'} un contenu</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Titre</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Type</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="MOVIE">Film</option>
                    <option value="SERIES">Série</option>
                    <option value="EBOOK">Ebook</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Description</label>
                <textarea 
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Catégorie</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Année</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">Fichiers multimédia</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">VIGNETTE (IMAGE)</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'thumbnail')}
                        className="hidden" id="thumb-upload"
                      />
                      <label htmlFor="thumb-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-purple-500/50 transition">
                        {formData.thumbnail ? (
                          <img src={formData.thumbnail} className="w-full h-20 object-cover rounded-lg" alt="" />
                        ) : (
                          <><Upload className="w-6 h-6 text-gray-500 mb-2" /><span className="text-xs text-gray-500">Cliquez pour uploader</span></>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">
                      {formData.type === 'EBOOK' ? 'FICHIER PDF' : 'FICHIER VIDÉO'}
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept={formData.type === 'EBOOK' ? '.pdf' : 'video/*'}
                        onChange={e => handleFileUpload(e, formData.type === 'EBOOK' ? 'pdf' : 'video')}
                        className="hidden" id="content-upload"
                      />
                      <label htmlFor="content-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-purple-500/50 transition">
                        {formData.url ? (
                          <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase">
                            <CheckCircle2 className="w-4 h-4" /> Fichier chargé
                          </div>
                        ) : (
                          <><PlayCircle className="w-6 h-6 text-gray-500 mb-2" /><span className="text-xs text-gray-500">Cliquez pour uploader</span></>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {isUploading && (
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-purple-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-xl transition-all shadow-lg"
                >
                  {formData.id ? 'Mettre à jour' : 'Publier le contenu'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-xl transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
