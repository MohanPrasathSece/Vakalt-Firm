
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

import { useQuery } from '@tanstack/react-query';

const PostDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { data: postData, isLoading: loading } = useQuery({
        queryKey: ['post', slug],
        queryFn: async () => {
            if (!slug) throw new Error("No slug");

            // 1. Fetch Main Post
            const { data: post, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !post) {
                toast.error("Article not found");
                navigate('/insights');
                return null;
            }

            // 2. Fetch Recommended
            let recommendedData = [];
            const { data: relatedData } = await supabase
                .from('posts')
                .select('id, title, slug, image_url, category, created_at, read_time, excerpt')
                .neq('id', post.id)
                .eq('category', post.category)
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(3);

            if (relatedData && relatedData.length < 3) {
                const { data: latestData } = await supabase
                    .from('posts')
                    .select('id, title, slug, image_url, category, created_at, read_time, excerpt')
                    .neq('id', post.id)
                    .not('id', 'in', `(${relatedData.map(r => r.id).join(',') || '00000000-0000-0000-0000-000000000000'})`)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false })
                    .limit(3 - (relatedData.length));

                recommendedData = [...(relatedData || []), ...(latestData || [])];
            } else {
                recommendedData = relatedData || [];
            }

            // 3. Fetch Categories
            const { data: catData } = await supabase
                .from('posts')
                .select('category')
                .eq('status', 'published');
            const uniqueCats = catData ? Array.from(new Set(catData.map(c => c.category || 'Uncategorized'))) : [];

            return { post, recommended: recommendedData, categories: uniqueCats };
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 10, // Cache for 10 mins
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const post = postData?.post;
    const recommended = postData?.recommended || [];
    const categories = postData?.categories || [];

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
                                    <h2 className="text-serif text-display-sm font-bold text-foreground mb-2">Related Briefings</h2>
                                    <p className="text-sans text-muted-foreground font-medium">Authoritative insights from {post.category || 'our archive'}.</p>
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

            {/* Categories Exploration */}
            {categories.length > 0 && (
                <section className="bg-white py-24 border-t border-border">
                    <div className="container mx-auto px-6 lg:px-12 text-center">
                        <ScrollReveal>
                            <h2 className="text-sans text-label uppercase text-muted-foreground mb-8 tracking-[0.3em]">Explore Topics</h2>
                            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        to={`/insights?category=${encodeURIComponent(cat)}`}
                                        className="text-sans text-[10px] font-black uppercase tracking-widest px-8 py-4 border border-border rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}


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
