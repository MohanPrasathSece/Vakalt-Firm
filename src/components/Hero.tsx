import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Scale, Users, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useRef } from "react";

interface HeroProps {
  onScrollToTools?: () => void;
  onScrollToCitizen?: () => void;
}

const Hero = ({ onScrollToTools, onScrollToCitizen }: HeroProps) => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden py-32 lg:py-48">
      {/* Background with Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20 scale-110" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950" />
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center">
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-white/20" />
            <span className="text-sans text-xs font-bold uppercase tracking-[0.4em] text-white/40">Established 2024 — Legal Practice</span>
            <div className="w-8 h-px bg-white/20" />
          </div>

          <h1 className="text-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8">
            Legal tools for <span className="italic font-light text-white/90">professionals.</span> <br />
            Legal knowledge for <span className="italic font-light text-white/90">everyone.</span>
          </h1>
        </motion.div>

        {/* The Choice Experience */}
        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center mb-12"
          >
            <p className="text-serif text-3xl md:text-5xl italic text-white/60 tracking-tight">Are you?</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {/* Lawyer Side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={onScrollToTools}
                className="group relative w-full flex flex-col items-start p-10 lg:p-14 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white hover:border-white transition-all duration-700 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 p-8 lg:p-12">
                  <ArrowRight className="w-8 h-8 text-white/20 group-hover:text-zinc-950 group-hover:translate-x-2 transition-all duration-500" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-zinc-950/5 transition-colors duration-500">
                  <Scale className="w-8 h-8 text-white/60 group-hover:text-zinc-950 transition-colors duration-500" />
                </div>
                <h3 className="text-serif text-4xl lg:text-5xl font-bold text-white group-hover:text-zinc-950 mb-4 transition-colors duration-500">
                  A Lawyer
                </h3>
                <p className="text-sans text-lg text-white/40 group-hover:text-zinc-950/60 leading-relaxed transition-colors duration-500">
                  Advanced calculators, legal drafts, and research tools precision-engineered for the modern advocate.
                </p>
              </button>
            </motion.div>

            {/* Citizen Side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={onScrollToCitizen}
                className="group relative w-full flex flex-col items-start p-10 lg:p-14 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white hover:border-white transition-all duration-700 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 p-8 lg:p-12">
                  <ArrowRight className="w-8 h-8 text-white/20 group-hover:text-zinc-950 group-hover:translate-x-2 transition-all duration-500" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-zinc-950/5 transition-colors duration-500">
                  <Users className="w-8 h-8 text-white/60 group-hover:text-zinc-950 transition-colors duration-500" />
                </div>
                <h3 className="text-serif text-4xl lg:text-5xl font-bold text-white group-hover:text-zinc-950 mb-4 transition-colors duration-500">
                  Not a Lawyer
                </h3>
                <p className="text-sans text-lg text-white/40 group-hover:text-zinc-950/60 leading-relaxed transition-colors duration-500">
                  Accessible legal guidance, expert consultations, and simplified rights awareness for everyone.
                </p>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
