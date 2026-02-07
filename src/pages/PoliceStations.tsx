import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Building, Search, MapPin, Phone, Mail, Scale, ChevronDown, Check, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PoliceStation {
    id: string;
    station_name: string;
    district: string;
    region: string;
    address: string;
    phone: string;
    jurisdictional_court: string;
}

const PoliceStations = () => {
    const [region, setRegion] = useState<string>("Delhi");
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<PoliceStation[]>([]);
    const [selectedStation, setSelectedStation] = useState<PoliceStation | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('police_stations')
            .select('*')
            .eq('region', region)
            .ilike('station_name', `%${query}%`)
            .limit(10);

        if (!error && data) {
            setSuggestions(data);
            setShowSuggestions(true);
        }
        setLoading(false);
    };

    const handleSelect = (station: PoliceStation) => {
        setSelectedStation(station);
        setSearchQuery(station.station_name);
        setShowSuggestions(false);
    };

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className="text-accent font-bold">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6 flex items-center gap-2">
                            <Building size={16} /> Legal Directory
                        </p>
                        <h1 className="text-serif text-display font-bold text-white mb-8">
                            Police Station & District Search
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Select your region and search for a police station to find its jurisdictional district and court details.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto space-y-12">

                        {/* Step 1: Region Selection */}
                        <ScrollReveal delay={0.1}>
                            <div className="space-y-4">
                                <label className="text-sans text-label uppercase text-muted-foreground flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">01</span>
                                    Select Region
                                </label>
                                <Select value={region} onValueChange={setRegion}>
                                    <SelectTrigger className="w-full h-16 border-border focus:ring-0 text-sans text-lg">
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </ScrollReveal>

                        {/* Step 2: Police Station Search */}
                        <ScrollReveal delay={0.2}>
                            <div className="space-y-4 relative" ref={suggestionsRef}>
                                <label className="text-sans text-label uppercase text-muted-foreground flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">02</span>
                                    Search Police Station
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Type police station name (e.g. Rohini)..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                        className="w-full h-16 pl-12 pr-12 bg-white border border-border text-sans text-lg focus:outline-none focus:border-foreground transition-all"
                                    />
                                    {loading && (
                                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                                    )}
                                </div>

                                {/* Autocomplete Suggestions */}
                                {showSuggestions && (
                                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-border shadow-2xl max-h-80 overflow-y-auto rounded-sm">
                                        {suggestions.length > 0 ? (
                                            suggestions.map(station => (
                                                <button
                                                    key={station.id}
                                                    onClick={() => handleSelect(station)}
                                                    className="w-full text-left px-6 py-4 hover:bg-surface-dark/5 flex items-center justify-between group transition-colors"
                                                >
                                                    <span className="text-sans text-body">
                                                        {highlightText(station.station_name, searchQuery)}
                                                    </span>
                                                    <ChevronDown className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -rotate-90" />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-6 py-8 text-center text-muted-foreground text-sans">
                                                No station found matching "{searchQuery}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Step 3: Show Result */}
                        <ScrollReveal delay={0.3}>
                            <div className={`transition-all duration-700 ${selectedStation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                                <div className="bg-surface-dark border border-border p-10 lg:p-14">
                                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-surface-charcoal-foreground/10">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent">
                                            <Check size={20} />
                                        </div>
                                        <h2 className="text-sans text-subheading font-bold text-white">
                                            Search Result
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-1">
                                            <p className="text-sans text-label uppercase text-surface-charcoal-foreground/40">Police Station</p>
                                            <p className="text-sans text-xl font-bold text-white">{selectedStation?.station_name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sans text-label uppercase text-surface-charcoal-foreground/40">District Name</p>
                                            <div className="inline-block bg-accent/20 px-4 py-2 rounded-sm">
                                                <p className="text-sans text-xl font-bold text-accent">{selectedStation?.district}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedStation && (
                                        <div className="mt-12 pt-10 border-t border-surface-charcoal-foreground/10 space-y-6">
                                            <div className="flex items-start gap-4 text-surface-charcoal-foreground/60">
                                                <MapPin size={20} className="shrink-0 text-white" />
                                                <p className="text-sans text-sm">{selectedStation.address}</p>
                                            </div>
                                            <div className="flex items-start gap-4 text-surface-charcoal-foreground/60">
                                                <Scale size={20} className="shrink-0 text-white" />
                                                <div>
                                                    <p className="text-sans text-sm font-bold text-white mb-1">Jurisdictional Court</p>
                                                    <p className="text-sans text-sm">{selectedStation.jurisdictional_court}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default PoliceStations;
