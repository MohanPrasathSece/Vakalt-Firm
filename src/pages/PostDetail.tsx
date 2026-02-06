
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Article {
    id: string;
    title: string;
    category: string;
    created_at: string;
    read_time: string;
    excerpt: string;
    content: string;
    image_url?: string;
    slug: string;
}

const PostDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<Article | null>(null);
    const [recommended, setRecommended] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostAndRecommended = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error || !data) {
                    toast.error("Article not found");
                    navigate('/insights');
                    return;
                }

                setPost(data);

                // Fetch recommended (same category or latest, excluding current)
                const { data: recData } = await supabase
                    .from('posts')
                    .select('id, title, slug, image_url, category, created_at, read_time, excerpt')
                    .neq('id', data.id)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (recData) setRecommended(recData as Article[]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPostAndRecommended();
        window.scrollTo(0, 0);
    }, [slug, navigate]);

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-foreground/5 border-t-foreground rounded-full animate-spin"></div>
        </div>;
    }

    if (!post) return null;

    return (
        <main className="bg-background">
            <Navbar />

            <article className="pt-32 pb-24 lg:pt-44 lg:pb-32">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <Link
                            to="/insights"
                            className="inline-flex items-center gap-2 text-sans text-label uppercase text-muted-foreground hover:text-foreground transition-colors mb-12 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>

                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <span className="text-sans text-[10px] font-black uppercase tracking-[0.2em] bg-foreground text-background px-4 py-1.5 rounded-full">
                                    {post.category || 'Uncategorized'}
                                </span>
                                <div className="flex items-center gap-4 text-sans text-label text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {post.read_time}</span>
                                </div>
                            </div>

                            <h1 className="text-serif text-display-sm lg:text-display font-bold text-foreground mb-10 leading-[1.05] tracking-tight">
                                {post.title}
                            </h1>

                            <p className="text-sans text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium border-l-4 border-foreground pl-8">
                                {post.excerpt}
                            </p>

                            {post.image_url && (
                                <div className="mb-20 aspect-video rounded-[2.5rem] overflow-hidden bg-surface-dark shadow-2xl">
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div
                                className="post-content prose prose-lg lg:prose-xl max-w-none text-sans text-foreground/90 leading-[1.8]"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            <div className="mt-28 pt-12 border-t border-border flex items-center justify-between">
                                <div className="text-sans text-label text-muted-foreground uppercase font-bold tracking-widest">
                                    Verified Insight • Published {new Date(post.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </article>

            {/* Recommended Section */}
            {recommended.length > 0 && (
                <section className="bg-surface-offwhite py-32">
                    <div className="container mx-auto px-6 lg:px-12">
                        <ScrollReveal>
                            <div className="flex items-center justify-between mb-16 border-b border-black/5 pb-8">
                                <div>
                                    <h2 className="text-serif text-display-sm font-bold text-foreground mb-2">More Insights</h2>
                                    <p className="text-sans text-muted-foreground font-medium">Continue reading our latest legal intelligence.</p>
                                </div>
                                <Link to="/insights" className="text-sans text-label uppercase font-bold hover:underline">Explore all</Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {recommended.map((item, i) => (
                                    <ScrollReveal key={item.id} delay={i * 0.1}>
                                        <Link to={`/insights/${item.slug}`} className="group block">
                                            <div className="space-y-6">
                                                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-surface-dark shadow-lg">
                                                    <img
                                                        src={item.image_url || '/placeholder.jpg'}
                                                        alt=""
                                                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="text-sans text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">{item.category}</span>
                                                    <h3 className="text-serif text-heading font-bold text-foreground group-hover:text-surface-dark transition-colors line-clamp-2 leading-tight">
                                                        {item.title}
                                                    </h3>
                                                    <div className="mt-6 flex items-center justify-between text-sans text-label text-muted-foreground font-medium">
                                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="bg-surface-dark py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <ScrollReveal>
                            <h2 className="text-serif text-display-sm lg:text-display font-bold text-surface-dark-foreground mb-8">Ready to secure your litigation strategy?</h2>
                            <p className="text-sans text-xl text-surface-charcoal-foreground/60 mb-12 leading-relaxed">
                                Join dozens of law firms leveraging Vakalt's intelligence. Subscribe to our briefing.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your corporate email"
                                    className="flex-1 bg-surface-charcoal border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-white/30 transition-all shadow-inner"
                                />
                                <button className="bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-white/90 transition-all uppercase text-[10px] tracking-[0.2em]">
                                    Join Briefing
                                </button>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
            </section>

            <Footer />

            <style>{`
                .post-content h1, .post-content h2, .post-content h3 {
                    font-family: var(--font-serif);
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    color: black;
                    line-height: 1.2;
                }
                .post-content h2 { font-size: 2.25rem; font-weight: 700; }
                .post-content h3 { font-size: 1.75rem; font-weight: 700; }
                .post-content p {
                    margin-bottom: 2rem;
                }
                .post-content img {
                    border-radius: 2rem;
                    margin: 3rem 0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
                }
                .post-content b, .post-content strong {
                    color: black;
                }
                .post-content blockquote {
                    border-left: 6px solid black;
                    padding-left: 2rem;
                    font-style: italic;
                    margin: 3rem 0;
                    font-size: 1.5rem;
                    color: #444;
                }
                .post-content ul, .post-content ol {
                    margin-bottom: 2rem;
                    padding-left: 1.5rem;
                }
                .post-content li {
                    margin-bottom: 0.75rem;
                }
            `}</style>
        </main>
    );
};

export default PostDetail;
