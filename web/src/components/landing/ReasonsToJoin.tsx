"use client";
import { Monitor, Download, Telescope, Smile } from "lucide-react";

const REASONS = [
  {
    title: "Regardez DipDOSS sur votre TV",
    desc: "Regardez DipDOSS sur votre Smart TV, PlayStation, Xbox, Chromecast, Apple TV, lecteur Blu-ray et bien plus.",
    icon: Monitor,
  },
  {
    title: "Téléchargez vos séries pour les regarder hors connexion",
    desc: "Enregistrez vos programmes préférés et ayez toujours quelque chose à regarder.",
    icon: Download,
  },
  {
    title: "Où que vous soyez",
    desc: "Regardez des films et séries en accès illimité sur votre TV, smartphone, tablette et ordinateur.",
    icon: Telescope,
  },
  {
    title: "Créez des profils pour les enfants",
    desc: "Les enfants découvrent de nouvelles aventures et retrouvent leurs personnages préférés dans un espace bien à eux, déjà inclus dans votre abonnement.",
    icon: Smile,
  },
];

export default function ReasonsToJoin() {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Encore plus de raisons de vous abonner</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REASONS.map((reason, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-[#1E1B4B] to-[#0f0e26] rounded-2xl p-6 relative min-h-[250px] border border-indigo-900/50 hover:border-indigo-500/30 transition-colors"
          >
            <h3 className="text-xl font-bold mb-4 pr-8">{reason.title}</h3>
            <p className="text-gray-400 text-sm">{reason.desc}</p>
            <div className="absolute bottom-6 right-6">
              <reason.icon className="w-10 h-10 text-indigo-400 opacity-80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
