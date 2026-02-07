
import { useState, useEffect } from "react";
import { ArrowUpRight, Search, FileText } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";

interface Article {
  id: string;
  title: string;
  category: string;
  created_at: string;
  read_time: string;
  excerpt: string;
  featured: boolean;
  slug: string;
  image_url?: string;
}

const Insights = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      // PERFORMANCE OPTIMIZATION: Only fetch list metadata, skip large content field
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, category, featured, created_at, read_time, image_url, excerpt')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (data) {
        setArticles(data);
        const cats = Array.from(new Set(data.map(p => p.category || 'Uncategorized')));
        setDynamicCategories(["All", ...cats]);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // Sync active category if URL param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const filtered = articles.filter((a) => {
    const matchesCat = activeCategory === "All" || (a.category || "Uncategorized") === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => a !== featured);

  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      {/* Hero banner */}
      <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <ScrollReveal>
            <p className="text-sans text-[10px] font-black uppercase tracking-[0.4em] text-surface-charcoal-foreground/40 mb-8 border-l-2 border-white/20 pl-4">Legal Intelligence</p>
            <h1 className="text-serif text-display font-bold text-surface-dark-foreground mb-10 leading-[1.05] tracking-tight">
              Strategic Insights
            </h1>
            <p className="text-sans text-xl lg:text-2xl text-surface-charcoal-foreground/60 max-w-2xl leading-relaxed">
              Authoritative analysis on litigation finance, corporate law, and emerging legal technologies.
            </p>
          </ScrollReveal>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Search & Filter */}
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-20">
              <div className="relative max-w-md w-full group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  placeholder="Search briefing archive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border pl-10 pb-4 text-sans text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {dynamicCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sans text-[10px] font-black uppercase tracking-widest px-6 py-3 border rounded-full transition-all duration-300 ${activeCategory === cat
                      ? "bg-foreground text-background border-foreground shadow-lg"
                      : "bg-transparent text-muted-foreground border-border hover:border-black hover:text-black"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-[16/10] bg-gray-100 rounded-[2rem]"></div>
                  <div className="space-y-3 px-2">
                    <div className="h-4 bg-gray-100 rounded-full w-24"></div>
                    <div className="h-8 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <ScrollReveal>
                  <Link to={`/insights/${featured.slug}`} className="block mb-24 group">
                    <div className="bg-surface-dark overflow-hidden transition-all duration-700 rounded-[3rem] shadow-2xl hover:shadow-black/20">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        {featured.image_url ? (
                          <div className="relative overflow-hidden aspect-video lg:aspect-auto">
                            <img
                              src={featured.image_url}
                              alt={featured.title}
                              className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
                          </div>
                        ) : (
                          <div className="bg-surface-charcoal aspect-video lg:aspect-auto flex items-center justify-center">
                            <FileText size={80} className="text-white/10" />
                          </div>
                        )}
                        <div className="p-10 lg:p-20 flex flex-col justify-center relative">
                          <div className="flex items-center gap-4 mb-8">
                            <span className="text-sans text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black px-4 py-1.5 rounded-full">Featured</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span className="text-sans text-[10px] font-black uppercase tracking-widest text-white/40">{featured.category || "Uncategorized"}</span>
                          </div>
                          <h2 className="text-serif text-3xl lg:text-5xl font-bold text-surface-dark-foreground mb-8 group-hover:translate-x-3 transition-transform duration-700 tracking-tight leading-tight">
                            {featured.title}
                          </h2>
                          <p className="text-sans text-lg lg:text-xl text-surface-charcoal-foreground/60 max-w-2xl mb-10 line-clamp-3 leading-relaxed font-medium">
                            {featured.excerpt}
                          </p>
                          <div className="flex items-center gap-6 text-sans text-[10px] font-black uppercase tracking-widest text-white/30">
                            <span>{new Date(featured.created_at).toLocaleDateString()}</span>
                            <span>{featured.read_time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {/* Article list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                {rest.map((article, i) => (
                  <ScrollReveal key={article.id} delay={i * 0.05}>
                    <Link to={`/insights/${article.slug}`} className="group block">
                      <div className="flex flex-col h-full space-y-6">
                        <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-gray-50 border border-black/5 shadow-xl transition-all duration-700 group-hover:shadow-black/10">
                          {article.image_url ? (
                            <img src={article.image_url} alt="" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-100 group-hover:text-black transition-colors duration-500">
                              <FileText size={64} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 px-4">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-sans text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">{article.category || "Uncategorized"}</span>
                            <span className="w-1 h-1 rounded-full bg-black/10" />
                            <span className="text-sans text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{new Date(article.created_at).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-serif text-2xl font-bold text-foreground mb-4 group-hover:text-surface-dark transition-colors line-clamp-2 leading-tight tracking-tight">
                            {article.title}
                          </h3>
                          <p className="text-sans text-muted-foreground/70 mb-8 line-clamp-2 leading-relaxed font-medium">
                            {article.excerpt}
                          </p>
                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/5">
                            <span className="text-sans text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{article.read_time}</span>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all transform group-hover:translate-x-1">
                              <ArrowUpRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {filtered.length === 0 && !loading && (
                <div className="py-40 text-center space-y-6 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                    <Search size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">No Briefings Found</h3>
                    <p className="text-muted-foreground leading-relaxed">We couldn't find any articles matching your search criteria. Try using different keywords.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Insights;
