import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const categories = ["All", "Corporate Law", "Civil Litigation", "Criminal Law", "Real Estate", "Family Law", "IP Law"];

const allArticles = [
  {
    title: "Understanding Civil Litigation Timelines in 2025",
    category: "Civil Litigation",
    date: "Jan 28, 2025",
    readTime: "6 min read",
    excerpt: "A comprehensive overview of procedural timelines and what they mean for your case strategy in the current legal landscape.",
    featured: true,
  },
  {
    title: "Corporate Governance: Key Compliance Updates",
    category: "Corporate Law",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    excerpt: "Recent regulatory changes that every board member and corporate officer should understand.",
  },
  {
    title: "Navigating Property Disputes: A Modern Guide",
    category: "Real Estate",
    date: "Jan 5, 2025",
    readTime: "5 min read",
    excerpt: "From boundary conflicts to title issues, a clear framework for resolving property disputes efficiently.",
  },
  {
    title: "Intellectual Property Protection in the Digital Age",
    category: "IP Law",
    date: "Dec 20, 2024",
    readTime: "7 min read",
    excerpt: "How digital transformation is reshaping IP strategy and what businesses need to protect.",
  },
  {
    title: "Family Law Mediation: When It Works Best",
    category: "Family Law",
    date: "Dec 10, 2024",
    readTime: "4 min read",
    excerpt: "Understanding when mediation is the right path and how to prepare for a successful outcome.",
  },
  {
    title: "Criminal Defense Strategy: Key Considerations",
    category: "Criminal Law",
    date: "Nov 28, 2024",
    readTime: "9 min read",
    excerpt: "Essential elements of building an effective defense from the initial stages through trial.",
  },
];

const Insights = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allArticles.filter((a) => {
    const matchesCat = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured);

  return (
    <main>
      <Navbar />

      {/* Hero banner */}
      <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6">Legal Intelligence</p>
            <h1 className="text-serif text-display font-bold text-surface-dark-foreground mb-8">
              Insights
            </h1>
            <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-xl">
              In-depth legal analysis, commentary, and practical guidance from our team of experts.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Search & Filter */}
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border pl-9 pb-3 text-sans text-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sans text-label uppercase px-5 py-2.5 border transition-all duration-300 ${activeCategory === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Featured */}
          {featured && (
            <ScrollReveal>
              <div className="bg-surface-dark p-10 lg:p-16 mb-16 group cursor-pointer hover:bg-surface-charcoal transition-colors duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sans text-label uppercase text-surface-charcoal-foreground/50">Featured</span>
                  <span className="w-1 h-1 rounded-full bg-surface-charcoal-foreground/30" />
                  <span className="text-sans text-label text-surface-charcoal-foreground/40">{featured.category}</span>
                </div>
                <h2 className="text-serif text-display-sm font-bold text-surface-dark-foreground mb-6 group-hover:translate-x-2 transition-transform duration-500">
                  {featured.title}
                </h2>
                <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl mb-6">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sans text-label text-surface-charcoal-foreground/40">
                  <span>{featured.date}</span>
                  <span>{featured.readTime}</span>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Article list */}
          <div>
            {rest.map((article, i) => (
              <ScrollReveal key={article.title} delay={i * 0.04}>
                <div className="group border-t border-border last:border-b cursor-pointer">
                  <div className="flex items-center justify-between py-8 lg:py-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sans text-label uppercase text-muted-foreground/60">{article.category}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className="text-sans text-label text-muted-foreground/40">{article.date}</span>
                        <span className="text-sans text-label text-muted-foreground/40 hidden sm:inline">{article.readTime}</span>
                      </div>
                      <h3 className="text-serif text-heading font-semibold text-foreground group-hover:translate-x-3 transition-transform duration-500 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sans text-body text-muted-foreground/60 max-w-xl hidden lg:block">
                        {article.excerpt}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 ml-6 flex-shrink-0" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-sans text-body text-muted-foreground py-20 text-center">
              No articles found matching your criteria.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Insights;
