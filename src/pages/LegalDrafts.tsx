import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import { FileText, Download, Search, Filter, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface LegalDraft {
    id: string;
    title: string;
    category: string;
    description: string;
    file_url: string;
    file_type: string;
    file_size: number;
    downloads_count: number;
}

import { useQuery } from '@tanstack/react-query';

const LegalDrafts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    const { data: drafts = [], isLoading: loading } = useQuery({
        queryKey: ['legal_drafts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('legal_drafts')
                .select('*')
                .eq('is_active', true)
                .order('title', { ascending: true });

            if (error) throw error;
            return data;
        },
    });

    const handleDownload = async (draft: LegalDraft) => {
        // Increment download count
        await supabase
            .from('legal_drafts')
            .update({ downloads_count: draft.downloads_count + 1 })
            .eq('id', draft.id);

        // Open file in new tab
        window.open(draft.file_url, '_blank');
    };

    const filtered = drafts.filter(draft => {
        const matchesSearch = draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            draft.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || draft.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getCategoryIcon = (category: string) => {
        return <FileText className="w-5 h-5" />;
    };

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'bail', label: 'Bail Applications' },
        { value: 'agreements', label: 'Agreements' },
        { value: 'petitions', label: 'Petitions' },
        { value: 'notices', label: 'Notices' },
        { value: 'affidavits', label: 'Affidavits' },
        { value: 'contracts', label: 'Contracts' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <main>
            <SEO
                title="Legal Drafts Library | Professional Templates"
                description="Download professionally drafted legal templates, agreements, petitions, and notices. A comprehensive collection of ready-to-use legal documents for your needs."
            />
            <Navbar />

            {/* Hero Section */}
            <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6 flex items-center gap-2">
                            <Scale size={16} /> Legal Resources
                        </p>
                        <h1 className="text-serif text-display-sm font-bold text-white mb-8 select-none">
                            Legal Drafts Library
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Download professionally drafted legal templates and documents. Save time with our
                            comprehensive collection of ready-to-use legal drafts.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="bg-background py-8 border-b border-border">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search drafts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-border focus:border-foreground"
                            />
                        </div>
                        <div className="md:w-64">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="h-12 border-border">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Drafts Grid Section */}
            <section className="bg-background py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-sans text-body text-muted-foreground">
                                No drafts found matching your criteria.
                            </p>
                            <p className="text-sans text-sm text-muted-foreground/60 mt-2">
                                Try adjusting your search or filter.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((draft, index) => (
                                <ScrollReveal key={draft.id} delay={index * 0.05}>
                                    <div className="bg-white border border-border p-8 hover:border-foreground transition-all duration-500 group h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-surface-dark">
                                                {getCategoryIcon(draft.category)}
                                            </div>
                                            <span className="text-sans text-label uppercase text-xs bg-accent/10 text-accent px-3 py-1">
                                                {draft.category}
                                            </span>
                                        </div>

                                        <h3 className="text-sans text-[20px] font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                                            {draft.title}
                                        </h3>

                                        <p className="text-sans text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                                            {draft.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-4 border-t border-border">
                                            <span className="uppercase">{draft.file_type}</span>
                                            <span>{formatFileSize(draft.file_size)}</span>
                                            <span>{draft.downloads_count} downloads</span>
                                        </div>

                                        <button
                                            onClick={() => handleDownload(draft)}
                                            className="text-sans text-[10px] font-bold uppercase tracking-[0.11em] bg-foreground text-background px-6 py-3 rounded-full hover:bg-zinc-800 transition-all duration-500 inline-flex items-center justify-center gap-2 w-full"
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Info Section */}
            <section className="bg-surface-dark py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-sans text-display-sm font-bold text-surface-dark-foreground mb-6">
                                Important Notice
                            </h2>
                            <p className="text-sans text-body text-surface-charcoal-foreground/60 leading-relaxed">
                                These drafts are provided as templates for general guidance only. They should be
                                reviewed and customized according to your specific requirements. We recommend
                                consulting with a legal professional before using any document for official purposes.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default LegalDrafts;
