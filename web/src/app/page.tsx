import Hero from "@/components/Hero";
import TrendingCarousel from "@/components/landing/TrendingCarousel";
import ReasonsToJoin from "@/components/landing/ReasonsToJoin";
import FaqAccordion from "@/components/landing/FaqAccordion";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="flex flex-col bg-black min-h-screen text-white">
      <Hero />
      
      {/* Container for the rest of the landing page content */}
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-8 xl:px-0 pb-16 space-y-16">
        
        {/* Promotional Banner */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-[#1E1B4B] to-[#312E81] p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-400/10 via-transparent to-transparent"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="text-4xl text-red-500 bg-black/40 p-3 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              🍿
            </div>
            <div>
              <h3 className="text-xl font-bold">Le DipDOSS que vous aimez pour juste 4,99 € par mois.</h3>
              <p className="text-gray-300 text-sm mt-1">Accès Standard et Premium inclus, avec 1 mois d'essai gratuit offert !</p>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-md font-medium transition-colors relative z-10 whitespace-nowrap border border-white/10">
            En savoir plus
          </button>
        </div>

        <TrendingCarousel />
        <ReasonsToJoin />
        <FaqAccordion />
      </div>
      
      <Footer />
    </main>
  );
}
