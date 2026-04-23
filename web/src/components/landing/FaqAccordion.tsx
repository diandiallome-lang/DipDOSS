"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "DipDOSS, qu'est-ce que c'est ?",
    a: "DipDOSS est un service de streaming qui propose une vaste sélection de séries, films, animes, documentaires primés et ebooks sur des milliers d'appareils connectés à Internet."
  },
  {
    q: "Combien coûte DipDOSS ?",
    a: "Regardez DipDOSS sur votre smartphone, tablette, Smart TV, ordinateur ou appareil de streaming, le tout pour un tarif mensuel fixe de 4,99 € (Accès Premium exclusif). Un mois d'essai gratuit est offert lors de la souscription ! Pas de contrat ni de frais supplémentaires."
  },
  {
    q: "Où puis-je regarder DipDOSS ?",
    a: "Regardez où et quand vous voulez. Connectez-vous à votre compte pour regarder DipDOSS en ligne sur dipdoss.com depuis votre ordinateur ou tout appareil connecté à Internet."
  },
  {
    q: "Que puis-je regarder sur DipDOSS ?",
    a: "DipDOSS dispose d'un vaste catalogue comprenant des longs métrages, des documentaires, des séries, des animes et des programmes originaux primés."
  },
  {
    q: "Est-ce que DipDOSS est adapté aux enfants ?",
    a: "L'expérience Enfants est incluse dans votre abonnement pour que les parents gardent le contrôle tout en laissant les enfants profiter d'un espace dédié aux films et séries familiaux."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Foire aux questions</h2>
      
      <div className="space-y-2">
        {FAQS.map((faq, index) => (
          <div key={index} className="bg-[#2d2d2d] hover:bg-[#414141] transition-colors rounded">
            <button 
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-6 text-xl md:text-2xl flex justify-between items-center"
            >
              <span>{faq.q}</span>
              {openIndex === index ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-6 border-t border-black text-lg md:text-xl leading-relaxed bg-[#2d2d2d]">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
