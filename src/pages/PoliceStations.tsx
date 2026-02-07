import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Building2, Scale, ExternalLink, AlertCircle } from 'lucide-react';

interface PoliceStation {
    id: string;
    station_name: string;
    district: string;
    region: string;
    address: string;
    jurisdictional_court: string;
    court_address: string;
}

const PoliceStationsPage = () => {
    const [region, setRegion] = useState("Delhi");
    const [searchQuery, setSearchQuery] = useState("");
    const [stations, setStations] = useState<PoliceStation[]>([]);
    const [selectedStation, setSelectedStation] = useState<PoliceStation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState<number | null>(null);

    // Initial check for data
    useEffect(() => {
        const checkData = async () => {
            const { count, error } = await supabase
                .from('police_stations')
                .select('*', { count: 'exact', head: true });
            if (!error) setTotalRecords(count);
        };
        checkData();
    }, []);

    // Simplified Gov-style search
    const performSearch = async (query: string) => {
        setSearchQuery(query);
        setSelectedStation(null);
        setError(null);

        if (query.length < 2) {
            setStations([]);
            return;
        }

        setLoading(true);
        try {
            // We search by station name. If region column is missing in DB, this might 400.
            // We'll wrap it in a try-catch to handle DB schema mismatches gracefully.
            const { data, error: sbError } = await supabase
                .from('police_stations')
                .select('*')
                .ilike('station_name', `%${query.trim()}%`)
                .limit(50);

            if (sbError) {
                console.error("Supabase Error:", sbError);
                // If it's a 400, it's likely a missing column or table
                if (sbError.code === '42703' || sbError.message.includes('column')) {
                    setError("Database schema mismatch. Please ensure you have run the updated SQL in Supabase SQL Editor.");
                } else {
                    setError("Error connecting to database. Please try again.");
                }
                setStations([]);
            } else {
                setStations(data || []);
            }
        } catch (err) {
            setError("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-slate-900 selection:text-white">
            <Navbar isLight />

            {/* Gov Header Area */}
            <div className="bg-white border-b border-slate-200 pt-32 pb-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-slate-800 text-white rounded">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-sans">Police Station Directory</h1>
                            <p className="text-sm text-slate-500 font-medium font-sans">Government of NCT of Delhi • Judicial Jurisdiction Portal</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Search Controls */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-6 border-b border-slate-100 pb-3 tracking-[0.2em] font-sans">Search Parameters</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select State/UT</label>
                                    <select
                                        className="w-full h-11 bg-slate-50 border border-slate-300 rounded px-3 text-sm focus:ring-1 focus:ring-slate-400 outline-none"
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                    >
                                        <option value="Delhi">Delhi</option>
                                    </select>
                                    {totalRecords !== null && (
                                        <p className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-widest font-sans">
                                            {totalRecords} Stations Indexed
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest font-sans">Search Police Station</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter station name..."
                                            className="w-full h-11 bg-white border border-slate-300 rounded pl-10 pr-4 text-sm font-bold text-slate-800 focus:border-slate-800 outline-none transition-all font-sans"
                                            value={searchQuery}
                                            onChange={(e) => performSearch(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                    <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight font-sans">e.g. Rohini, Saket, Patiala House</p>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded flex gap-3 text-red-700">
                                    <AlertCircle size={18} className="shrink-0" />
                                    <p className="text-xs font-medium leading-relaxed">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Search Results List */}
                        <div className="space-y-2 font-sans overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {loading && (
                                <div className="text-center py-10 bg-white/50 rounded-lg border border-dashed border-slate-300">
                                    <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest font-sans">Accessing Records Database...</p>
                                </div>
                            )}

                            {!loading && searchQuery.trim().length >= 2 && stations.length === 0 && !error && (
                                <div className="p-8 text-center bg-white border border-slate-200 rounded-lg font-sans">
                                    <p className="text-sm text-slate-500 font-bold">No results found for "{searchQuery}"</p>
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest leading-loose">Check spelling or try a district name</p>
                                </div>
                            )}

                            {stations.map(station => (
                                <button
                                    key={station.id}
                                    onClick={() => {
                                        console.log("Selected:", station.station_name);
                                        setSelectedStation(station);
                                    }}
                                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between group font-sans ${selectedStation?.id === station.id
                                        ? "bg-slate-900 border-slate-900 shadow-lg scale-[1.01]"
                                        : "bg-white border-slate-200 hover:border-slate-400"
                                        }`}
                                >
                                    <div>
                                        <h3 className={`text-sm font-black uppercase tracking-tight font-sans ${selectedStation?.id === station.id ? "text-white" : "text-slate-900"}`}>
                                            {station.station_name}
                                        </h3>
                                        <p className={`text-[11px] font-bold mt-1 font-sans ${selectedStation?.id === station.id ? "text-slate-400" : "text-slate-500"}`}>
                                            {station.district}
                                        </p>
                                    </div>
                                    <ExternalLink size={14} className={selectedStation?.id === station.id ? "text-white" : "text-slate-300 group-hover:text-slate-900"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Detailed View */}
                    <div className="lg:col-span-7">
                        {selectedStation ? (
                            <div className="bg-white border-2 border-slate-900 rounded-lg overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-200">
                                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-black uppercase tracking-tight font-sans">{selectedStation.station_name}</h2>
                                        <div className="mt-1 flex items-center gap-2 font-sans">
                                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase font-black tracking-widest">Official Record</span>
                                        </div>
                                    </div>
                                    <MapPin size={24} className="text-slate-400" />
                                </div>

                                <div className="p-8 space-y-10">
                                    {/* Primary Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-1 font-sans">
                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Administrative District</h4>
                                            <p className="text-lg font-bold text-slate-900 bg-slate-50 p-3 border border-slate-100 rounded font-sans">{selectedStation.district}</p>
                                        </div>
                                        <div className="space-y-1 font-sans">
                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Jurisdictional Court</h4>
                                            <div className="flex items-start gap-3 bg-slate-50 p-3 border border-slate-100 rounded">
                                                <Scale size={18} className="mt-1 text-slate-700 shrink-0" />
                                                <p className="text-sm font-bold text-slate-900 leading-snug font-sans">{selectedStation.jurisdictional_court}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Addresses */}
                                    <div className="space-y-6 pt-6 border-t border-slate-100 font-sans">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 font-sans">Police Station Address</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed font-bold font-sans">{selectedStation.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                                <Scale size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 font-sans">Court Location</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed font-bold font-sans">{selectedStation.court_address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notice */}
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-4 items-start">
                                        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-amber-800 leading-relaxed italic">
                                            Disclaimer: This information is for general guidance regarding judicial jurisdiction. For official legal proceedings, please verify the specific jurisdiction with a practicing legal professional.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
                                <div className="w-20 h-20 bg-white border border-slate-100 shadow-sm rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-700 uppercase tracking-tight font-sans">Portal Entry Pending</h3>
                                <p className="text-sm text-slate-400 max-w-xs mt-2 font-medium leading-relaxed font-sans">
                                    Search for a police station on the left to view its jurisdictional court and administrative records.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </main>
    );
};

export default PoliceStationsPage;
