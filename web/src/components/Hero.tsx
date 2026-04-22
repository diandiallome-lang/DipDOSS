"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Dans une vraie application, on passe l'email à la page d'inscription
      router.push(`/register?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Background avec effet collage de posters et dégradés */}
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: `url('https://assets.nflxext.com/ffe/siteui/vlv3/150c4b42-11f6-4576-a00f-c631308b1e43/web/FR-fr-20231218-POP_SIGNUP_TWO_WEEKS-perspective_WEB_c6af27c3-9dee-440e-9d22-1b6016e3fc97_large.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dégradés pour assombrir et donner l'effet vignette */}
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
      </div>

      {/* Header de la Landing Page */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="text-4xl md:text-5xl font-black text-[#E50914] tracking-wider cursor-pointer">
          DipDOSS
        </div>
        <div className="flex items-center gap-4">
          <select className="hidden md:block bg-black/40 text-white border border-gray-600 rounded px-4 py-1.5 focus:ring-2 focus:ring-white focus:outline-none appearance-none cursor-pointer">
            <option>Français</option>
            <option>English</option>
          </select>
          <Link 
            href="/login"
            className="bg-[#E50914] hover:bg-[#c10711] text-white px-4 py-1.5 rounded font-medium transition-colors whitespace-nowrap"
          >
            S'identifier
          </Link>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] px-4 text-center max-w-4xl mx-auto mt-[-5vh]">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-[4rem] font-black mb-4 leading-tight"
        >
          Films et séries en illimité, et bien plus
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-medium mb-6"
        >
          À partir de 7,99 €. Annulable à tout moment.
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl mb-6 font-normal"
        >
          Prêt à regarder DipDOSS ? Saisissez votre adresse e-mail pour vous abonner ou réactiver votre abonnement.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleStart}
          className="flex flex-col md:flex-row items-center gap-2 w-full max-w-3xl"
        >
          {/* Input E-mail style flottant */}
          <div className="relative w-full h-14">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full h-full bg-black/60 border border-gray-600 rounded px-4 pt-5 pb-1 text-white focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-all placeholder-transparent"
              placeholder="Adresse e-mail"
              id="emailInput"
            />
            <label 
              htmlFor="emailInput"
              className="absolute left-4 top-4 text-gray-400 text-base transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-valid:top-1 peer-valid:text-xs pointer-events-none"
            >
              Adresse e-mail
            </label>
          </div>
          
          <button 
            type="submit"
            className="w-full md:w-auto h-14 md:min-w-[220px] flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#c10711] text-white text-2xl font-bold py-2 px-6 rounded transition-colors whitespace-nowrap mt-2 md:mt-0"
          >
            Commencer <ChevronRight className="w-6 h-6 stroke-[3px]" />
          </button>
        </motion.form>
      </main>

      {/* Ligne décorative en bas (facultatif) */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#E50914]/50 to-transparent shadow-[0_0_15px_rgba(229,9,20,0.5)]" />
    </div>
  );
}
