"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'email passé dans l'URL depuis la Landing Page
    const searchParams = new URLSearchParams(window.location.search);
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setFormData((prev) => ({ ...prev, email: emailFromUrl }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/profiles");
    } catch (err: any) {
      setError(Array.isArray(err.message) ? err.message[0] : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Créer un compte</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nom complet</label>
            <input 
              type="text"
              name="name"
              required
              autoComplete="name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Jean Dupont"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email"
              name="email"
              required
              autoComplete="username"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="jean@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Mot de passe</label>
            <input 
              type="password"
              name="password"
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-[1.02] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-400 text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-white hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}
