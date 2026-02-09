import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onScrollToTools?: () => void;
  onScrollToCitizen?: () => void;
}

const Hero = ({ onScrollToTools, onScrollToCitizen }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-end bg-surface-dark overflow-hidden pb-16 lg:pb-24">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/80 to-surface-dark/40" />
      </div>

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative container mx-auto px-6 lg:px-12 pt-40 lg:pt-48 mb-auto"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-px bg-surface-charcoal-foreground/40" />
          <p className="text-sans text-label uppercase text-surface-charcoal-foreground/60">
            Est. 2024 — Legal Practice
          </p>
        </div>
      </motion.div>

      {/* Main heading */}
      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="overflow-hidden mb-4 pb-8">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-serif text-5xl md:text-7xl lg:text-9xl font-bold text-surface-dark-foreground leading-[1.1]"
          >
            Litigation.
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8 pb-8">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-serif text-5xl md:text-7xl lg:text-9xl font-bold text-surface-dark-foreground"
          >
            Simplified.
          </motion.h1>
        </div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-t border-surface-charcoal-foreground/15 pt-8"
        >
          <div className="max-w-md">
            <p className="text-sans text-lg font-medium text-surface-dark-foreground mb-4">
              Are you?
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onScrollToTools}
                className="text-sans text-[12px] font-bold uppercase tracking-[0.11em] bg-surface-dark-foreground text-surface-dark px-8 py-4 rounded-full hover:bg-zinc-200 transition-all duration-500"
              >
                A Lawyer
              </button>
              <button
                onClick={onScrollToCitizen}
                className="text-sans text-[12px] font-bold uppercase tracking-[0.11em] border border-surface-charcoal-foreground/30 text-surface-dark-foreground px-8 py-4 rounded-full hover:border-surface-dark-foreground hover:bg-surface-charcoal-foreground/5 transition-all duration-500"
              >
                Not a Lawyer
              </button>
            </div>
          </div>

          <p className="text-sans text-body text-surface-charcoal-foreground/60 max-w-md lg:text-right">
            Modern legal insight and representation built for individuals and businesses navigating complex legal environments.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
