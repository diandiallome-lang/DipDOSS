"use client";

import { motion } from "framer-motion";
import { Play, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 z-0" />
      
      {/* Animated Shapes */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] z-0"
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500"
        >
          L'Univers du Divertissement <br /> sans Limites.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          Streaming vidéo 4K et bibliothèque d'ebooks illimitée. 
          Le meilleur du cinéma et de la littérature, réunis sur une seule plateforme.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-4 bg-white text-black font-semibold rounded-full flex items-center gap-2 hover:bg-gray-200 transition-all transform hover:scale-105">
            <Play className="w-5 h-5 fill-current" />
            Commencer l'essai gratuit
          </button>
          <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 backdrop-blur-md flex items-center gap-2 hover:bg-white/20 transition-all transform hover:scale-105">
            <BookOpen className="w-5 h-5" />
            Explorer le catalogue
          </button>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-sm text-gray-500"
        >
          7 jours gratuits, puis seulement 4,99 €/mois. Annulable à tout moment.
        </motion.p>
      </div>
    </section>
  );
}
