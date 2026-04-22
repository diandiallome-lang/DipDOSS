"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      router.push(`/register?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <footer className="w-full">
      {/* Bottom Email Form */}
      <div className="max-w-4xl mx-auto px-4 mt-12 mb-16 text-center">
        <p className="text-lg md:text-xl mb-4 font-normal text-white">
          Prêt à regarder DipDOSS ? Saisissez votre adresse e-mail pour vous abonner ou réactiver votre abonnement.
        </p>

        <form 
          onSubmit={handleStart}
          className="flex flex-col md:flex-row items-center justify-center gap-2 w-full mx-auto max-w-3xl"
        >
          <div className="relative w-full md:flex-1 h-14">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full h-full bg-black/60 border border-gray-600 rounded px-4 pt-5 pb-1 text-white focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-all placeholder-transparent"
              placeholder="Adresse e-mail"
              id="footerEmailInput"
            />
            <label 
              htmlFor="footerEmailInput"
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
        </form>
      </div>

      {/* Footer Links */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-0 py-8 text-gray-400 text-sm">
        <p className="mb-6">Des questions ? Appelez le 0805 98 06 66</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">FAQ</Link></li>
            <li><Link href="#" className="hover:underline">Relations Investisseurs</Link></li>
            <li><Link href="#" className="hover:underline">Acheter des cartes cadeaux</Link></li>
            <li><Link href="#" className="hover:underline">Préférences de cookies</Link></li>
            <li><Link href="#" className="hover:underline">Garantie légale</Link></li>
          </ul>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">Centre d'aide</Link></li>
            <li><Link href="#" className="hover:underline">Recrutement</Link></li>
            <li><Link href="#" className="hover:underline">Modes de lecture</Link></li>
            <li><Link href="#" className="hover:underline">Mentions légales</Link></li>
            <li><Link href="#" className="hover:underline">Informations légales</Link></li>
          </ul>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">Compte</Link></li>
            <li><Link href="#" className="hover:underline">Boutique DipDOSS</Link></li>
            <li><Link href="#" className="hover:underline">Conditions d'utilisation</Link></li>
            <li><Link href="#" className="hover:underline">Nous contacter</Link></li>
            <li><Link href="#" className="hover:underline">Seulement sur DipDOSS</Link></li>
          </ul>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">Presse</Link></li>
            <li><Link href="#" className="hover:underline">Utiliser des cartes cadeaux</Link></li>
            <li><Link href="#" className="hover:underline">Confidentialité</Link></li>
            <li><Link href="#" className="hover:underline">Test de vitesse</Link></li>
            <li><Link href="#" className="hover:underline">Choix liés à la pub</Link></li>
          </ul>
        </div>
        
        <select className="bg-black/40 text-white border border-gray-600 rounded px-4 py-1.5 focus:ring-2 focus:ring-white focus:outline-none appearance-none cursor-pointer mb-6">
          <option>Français</option>
          <option>English</option>
        </select>
        
        <p>DipDOSS France</p>
        <p className="mt-4 text-xs text-gray-500">
          Cette page est protégée par Google reCAPTCHA pour nous assurer que vous n'êtes pas un robot.
        </p>
      </div>
    </footer>
  );
}
