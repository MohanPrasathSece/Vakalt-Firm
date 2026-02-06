import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const articles = [
  {
    title: "Understanding Civil Litigation Timelines in 2025",
    category: "Civil Litigation",
    date: "Jan 28, 2025",
    readTime: "6 min",
  },
  {
    title: "Corporate Governance: Key Compliance Updates",
    category: "Corporate Law",
    date: "Jan 15, 2025",
    readTime: "8 min",
  },
  {
    title: "Navigating Property Disputes: A Modern Guide",
    category: "Real Estate",
    date: "Jan 5, 2025",
    readTime: "5 min",
  },
  {
    title: "Intellectual Property Protection in the Digital Age",
    category: "IP Law",
    date: "Dec 20, 2024",
    readTime: "7 min",
  },
];

const InsightsPreview = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-background py-28 lg:py-40">
      <div className="container mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 lg:mb-24">
            <div>
              <p className="text-sans text-label uppercase text-muted-foreground mb-4">Legal Intelligence</p>
              <h2 className="text-serif text-display-sm font-bold text-foreground">
                Latest Insights
              </h2>
            </div>
            <Link
              to="/insights"
              className="text-sans text-label uppercase tracking-[0.1em] border border-foreground px-8 py-3 text-foreground hover:bg-foreground hover:text-background transition-all duration-500 self-start lg:self-auto"
            >
              View All Articles
            </Link>
          </div>
        </ScrollReveal>

        <div>
          {articles.map((article, i) => (
            <ScrollReveal key={article.title} delay={i * 0.05}>
              <Link
                to="/insights"
                className="group block border-t border-border last:border-b"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between py-8 lg:py-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3 lg:mb-4">
                      <span className="text-sans text-label uppercase text-muted-foreground/60">
                        {article.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-sans text-label text-muted-foreground/40">
                        {article.date}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                      <span className="text-sans text-label text-muted-foreground/40 hidden sm:block">
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-serif text-heading font-semibold text-foreground group-hover:translate-x-3 transition-transform duration-500">
                      {article.title}
                    </h3>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      scale: hoveredIndex === i ? 1 : 0.5,
                      opacity: hoveredIndex === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="ml-6"
                  >
                    <ArrowUpRight className="w-6 h-6 text-foreground" />
                  </motion.div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightsPreview;
