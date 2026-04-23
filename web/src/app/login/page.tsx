"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Identifiants invalides");
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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Connexion</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email"
              required
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
              required
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
            {loading ? "Chargement..." : "Se connecter"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-400 text-sm">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-white hover:underline">S'inscrire</Link>
        </p>
      </motion.div>
    </div>
  );
}
