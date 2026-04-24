import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const links = [
    "Audiodescription", "Centre d'aide", "Cartes cadeaux", "Presse",
    "Relations Investisseurs", "Recrutement", "Boutique DipDOSS", "Conditions d'utilisation",
    "Confidentialité", "Informations légales", "Préférences de cookies", "Mentions légales",
    "Nous contacter", "Choix liés à la pub"
  ];

  return (
    <footer className="max-w-5xl mx-auto px-4 md:px-12 py-16 text-gray-500 text-sm">
      <div className="flex gap-6 mb-6 text-white">
        <Facebook className="cursor-pointer hover:text-gray-300" />
        <Instagram className="cursor-pointer hover:text-gray-300" />
        <Twitter className="cursor-pointer hover:text-gray-300" />
        <Youtube className="cursor-pointer hover:text-gray-300" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {links.map((link) => (
          <a key={link} href="#" className="hover:underline">{link}</a>
        ))}
      </div>

      <button className="border border-gray-500 px-2 py-1 mb-6 hover:text-white transition">
        Code de service
      </button>

      <p className="text-[10px]">© 1997-2026 DipDOSS, Inc.</p>
    </footer>
  );
}
