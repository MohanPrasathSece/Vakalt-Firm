import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
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
            className="text-serif text-7xl lg:text-9xl font-bold text-surface-dark-foreground leading-[1.1]"
          >
            Litigation.
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-12 pb-8">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-serif text-7xl lg:text-9xl font-bold text-surface-dark-foreground"
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
          <p className="text-sans text-body text-surface-charcoal-foreground/60 max-w-md">
            Modern legal insight and representation built for individuals and businesses navigating complex legal environments.
          </p>
          <div className="flex gap-4">
            <Link
              to="/contact"
              className="text-sans text-label uppercase tracking-[0.1em] bg-surface-dark-foreground text-surface-dark px-8 py-4 hover:bg-surface-charcoal-foreground transition-all duration-500"
            >
              Ask a Legal Question
            </Link>
            <Link
              to="/insights"
              className="text-sans text-label uppercase tracking-[0.1em] border border-surface-charcoal-foreground/30 text-surface-dark-foreground px-8 py-4 hover:border-surface-dark-foreground transition-all duration-500"
            >
              Explore Insights
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
