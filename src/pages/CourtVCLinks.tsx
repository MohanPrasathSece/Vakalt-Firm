import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Video, Search, ExternalLink, MapPin, User, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CourtVCLink {
    id: string;
    court_name: string;
    judge_name: string;
    court_type: string;
    state: string;
    district: string;
    vc_link: string;
    additional_info: string;
}

import { useQuery } from '@tanstack/react-query';

const CourtVCLinks = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCourtType, setFilterCourtType] = useState<string>("all");
    const [filterState, setFilterState] = useState<string>("all");

    const { data: vcLinks = [], isLoading: loading } = useQuery({
        queryKey: ['court_vc_links'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('court_vc_links')
                .select('*')
                .eq('is_active', true)
                .order('judge_name', { ascending: true });

            if (error) throw error;
            return data;
        },
    });

    const filtered = vcLinks.filter(link => {
        const matchesSearch = link.judge_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            link.court_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourtType = filterCourtType === "all" || link.court_type === filterCourtType;
        const matchesState = filterState === "all" || link.state === filterState;
        return matchesSearch && matchesCourtType && matchesState;
    });

    const courtTypes = [
        { value: 'all', label: 'All Court Types' },
        { value: 'supreme-court', label: 'Supreme Court' },
        { value: 'high-court', label: 'High Court' },
        { value: 'district-court', label: 'District Court' },
        { value: 'sessions-court', label: 'Sessions Court' },
        { value: 'magistrate-court', label: 'Magistrate Court' },
        { value: 'tribunal', label: 'Tribunal' },
    ];

    // Get unique states from data
    const states = ['all', ...Array.from(new Set(vcLinks.map(link => link.state)))];

    const formatCourtType = (type: string) => {
        return type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <main>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6 flex items-center gap-2">
                            <Video size={16} /> Virtual Court Access
                        </p>
                        <h1 className="text-serif text-display-sm font-bold text-white mb-8 select-none">
                            Court VC Links
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Find video conferencing links for courts across India. Search by judge name to quickly
                            access virtual court hearings.
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
                                placeholder="Search by judge name or court name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-border focus:border-foreground"
                            />
                        </div>
                        <div className="md:w-56">
                            <Select value={filterCourtType} onValueChange={setFilterCourtType}>
                                <SelectTrigger className="h-12 border-border">
                                    <SelectValue placeholder="Court Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courtTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:w-48">
                            <Select value={filterState} onValueChange={setFilterState}>
                                <SelectTrigger className="h-12 border-border">
                                    <SelectValue placeholder="State" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All States</SelectItem>
                                    {states.filter(s => s !== 'all').map(state => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            {/* VC Links List Section */}
            <section className="bg-background py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <Video className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-sans text-body text-muted-foreground">
                                No VC links found matching your search.
                            </p>
                            <p className="text-sans text-sm text-muted-foreground/60 mt-2">
                                Try searching with a different judge name or adjust filters.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((link, index) => (
                                <ScrollReveal key={link.id} delay={index * 0.03}>
                                    <div className="bg-white border border-border p-6 hover:border-foreground transition-all duration-500 group">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-surface-dark shrink-0">
                                                        <User className="w-5 h-5 text-surface-dark-foreground" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-sans text-[20px] font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                                                            {link.judge_name}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 size={16} />
                                                                <span>{link.court_name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin size={16} />
                                                                <span>{link.district ? `${link.district}, ` : ''}{link.state}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <span className="text-sans text-label uppercase text-xs bg-accent/10 text-accent px-3 py-1">
                                                                {formatCourtType(link.court_type)}
                                                            </span>
                                                            {link.additional_info && (
                                                                <span className="text-sans text-xs text-muted-foreground px-3 py-1 border border-border">
                                                                    {link.additional_info}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:w-48 shrink-0">
                                                <a
                                                    href={link.vc_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sans text-label uppercase tracking-[0.1em] bg-foreground text-background px-6 py-4 hover:bg-accent transition-all duration-500 inline-flex items-center justify-center gap-2 w-full"
                                                >
                                                    <Video size={18} />
                                                    Join VC
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                    {!loading && filtered.length > 0 && (
                        <div className="text-center mt-8 text-sm text-muted-foreground">
                            Showing {filtered.length} of {vcLinks.length} court{vcLinks.length !== 1 ? 's' : ''}
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
                                How to Use
                            </h2>
                            <div className="text-sans text-body text-surface-charcoal-foreground/60 leading-relaxed space-y-4">
                                <p>
                                    1. Search for the judge's name in the search bar above
                                </p>
                                <p>
                                    2. Filter by court type or state if needed
                                </p>
                                <p>
                                    3. Click "Join VC" to access the virtual court link
                                </p>
                                <p className="text-sm mt-6 text-surface-charcoal-foreground/40">
                                    Note: Ensure you have the necessary credentials and case details before joining a virtual hearing.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default CourtVCLinks;
