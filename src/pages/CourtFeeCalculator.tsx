import { useState, useEffect } from 'react';
import { Calculator, IndianRupee, FileText, Scale, Table as TableIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FeeStructure {
    id: string;
    case_type: string;
    court_type: string;
    min_claim_value: number;
    max_claim_value: number;
    fixed_fee: number;
    percentage_fee: number;
    additional_charges: string;
    description: string;
}

// Court Fee Calculation Logic based on the provided Universal Algorithm
const calculateCourtFee = (A: number): number => {
    if (A <= 0) return 0;

    let F = 0;

    if (A <= 100) {
        // Slab 1: Up to 100 (0.50 per 5 rupees)
        F = Math.ceil(A / 5) * 0.50;
    } else if (A <= 500) {
        // Slab 2: 100 to 500 (1.00 per 10 rupees)
        F = Math.ceil(A / 10) * 1.00;
    } else if (A <= 1000) {
        // Slab 3: 500 to 1000 (1.50 per 10 rupees)
        // This slab has a jump: at 501, fee becomes 76.50
        F = Math.ceil(A / 10) * 1.50;
    } else if (A <= 5000) {
        // Slab 4: 1000 to 5000 (12.20 per 100 rupees in excess of 1000)
        F = 150 + Math.ceil((A - 1000) / 100) * 12.20;
    } else if (A <= 10000) {
        // Slab 5: 5000 to 10000 (24.40 per 250 rupees in excess of 5000)
        F = 638 + Math.ceil((A - 5000) / 250) * 24.40;
    } else if (A <= 20000) {
        // Slab 6: 10000 to 20000 (36.50 per 500 rupees in excess of 10000)
        F = 1126 + Math.ceil((A - 10000) / 500) * 36.50;
    } else if (A <= 30000) {
        // Slab 7: 20000 to 30000 (48.80 per 1000 rupees in excess of 20000)
        F = 1856 + Math.ceil((A - 20000) / 1000) * 48.80;
    } else if (A <= 50000) {
        // Slab 8: 30000 to 50000 (48.80 per 2000 rupees in excess of 30000)
        F = 2344 + Math.ceil((A - 30000) / 2000) * 48.80;
    } else {
        // Slab 9 & 10+: 50000 and above (48.80 per 5000 rupees in excess of 50000)
        // Note: The base for 50k is 2832. 3320 is the base for 1,00,000.
        F = 2832 + Math.ceil((A - 50000) / 5000) * 48.80;
    }

    return Math.round(F * 100) / 100;
};

// Helper to format numbers to words (Simple version for Indian context)
const formatToWords = (num: number): string => {
    const wholePart = Math.floor(num);
    const paisePart = Math.round((num - wholePart) * 100);

    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const convert = (n: number): string => {
        if (n === 0) return 'zero ';
        const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        const b = ['', '', 'twenty ', 'thirty ', 'forty ', 'fifty ', 'sixty ', 'seventy ', 'eighty ', 'ninety '];

        const convertLessThanThousand = (num: number): string => {
            let res = '';
            if (num >= 100) {
                res += a[Math.floor(num / 100)] + 'hundred ';
                num %= 100;
            }
            if (num > 0) {
                if (res !== '') res += 'and ';
                if (num < 20) {
                    res += a[num];
                } else {
                    res += b[Math.floor(num / 10)];
                    if (num % 10 > 0) res += a[num % 10];
                }
            }
            return res;
        };

        let res = '';
        let remaining = n;

        if (remaining >= 10000000) { // Crores
            res += convert(Math.floor(remaining / 10000000)) + 'crore ';
            remaining %= 10000000;
        }
        if (remaining >= 100000) { // Lakhs
            res += convertLessThanThousand(Math.floor(remaining / 100000)) + 'lakh ';
            remaining %= 100000;
        }
        if (remaining >= 1000) { // Thousands
            res += convertLessThanThousand(Math.floor(remaining / 1000)) + 'thousand ';
            remaining %= 1000;
        }
        if (remaining > 0) {
            res += convertLessThanThousand(remaining);
        }

        return res;
    };

    let result = convert(wholePart) + ' Rupees';
    if (paisePart > 0) {
        result += ' and ' + convert(paisePart) + ' Paise';
    }
    return result;
};

import { useQuery } from '@tanstack/react-query';

const CourtFeeCalculator = () => {
    const [selectedState, setSelectedState] = useState<string>("delhi");
    const [claimAmount, setClaimAmount] = useState<string>("");
    const [calculatedFee, setCalculatedFee] = useState<number | null>(null);

    const states = [
        { name: "Delhi", val: "delhi" },
        { name: "Maharashtra", val: "maharashtra" },
        { name: "Karnataka", val: "karnataka" },
        { name: "Tamil Nadu", val: "tamil-nadu" },
        { name: "Uttar Pradesh", val: "uttar-pradesh" },
        { name: "West Bengal", val: "west-bengal" },
    ];

    const { data: feeStructures = [], isLoading: loadingFees } = useQuery({
        queryKey: ['court_fee_structure'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('court_fee_structure')
                .select('*')
                .eq('is_active', true)
                .order('court_type', { ascending: true })
                .order('case_type', { ascending: true });
            if (error) throw error;
            return data;
        },
    });

    const handleCalculate = () => {
        const amount = parseFloat(claimAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid claim amount");
            return;
        }

        // Apply formula logic
        const fee = calculateCourtFee(amount);
        setCalculatedFee(fee);
    };

    const handleReset = () => {
        setSelectedState("delhi");
        setClaimAmount("");
        setCalculatedFee(null);
    };

    const formatCourtType = (type: string) => {
        return type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatCurrency = (value: number | null) => {
        if (value === null) return '-';
        return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    return (
        <main>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl">
                        <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6 flex items-center gap-2">
                            <Calculator size={16} /> Legal Tools
                        </p>
                        <h1 className="text-serif text-display-sm font-bold text-white mb-8 select-none">
                            Legal Court Fee Calculator
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Calculate court fees for civil suits across Indian states based on the latest Ad Valorem fee schedule.
                            Select your state and enter claim amount to get an instant fee calculation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="bg-background py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Calculator Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-white border border-border p-10 lg:p-14 rounded-[2rem] shadow-xl shadow-black/5">
                                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border">
                                    <Scale size={24} className="text-foreground" />
                                    <h2 className="text-sans text-subheading font-bold text-foreground">
                                        Fee Calculation
                                    </h2>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <Label className="text-sans text-label uppercase text-muted-foreground mb-4 block">
                                            Select State
                                        </Label>
                                        <Select value={selectedState} onValueChange={setSelectedState}>
                                            <SelectTrigger className="w-full bg-transparent border-none border-b-2 border-border rounded-none px-0 pb-4 h-auto text-sans text-body-lg text-foreground focus:ring-0 focus:border-foreground transition-all hover:border-foreground/60">
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-border text-foreground">
                                                {states.map((state) => (
                                                    <SelectItem key={state.val} value={state.val}>
                                                        {state.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-sans text-label uppercase text-muted-foreground mb-4 block">
                                            Value of Subject Matter (₹)
                                        </Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                value={claimAmount}
                                                onChange={(e) => setClaimAmount(e.target.value)}
                                                placeholder="Enter value"
                                                className="w-full bg-transparent border-b-2 border-border pb-4 pl-8 text-sans text-body-lg text-foreground focus:outline-none focus:border-foreground transition-colors border-t-0 border-x-0 rounded-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button
                                            onClick={handleCalculate}
                                            disabled={!selectedState || !claimAmount}
                                            className="text-sans text-[10px] font-bold uppercase tracking-[0.11em] bg-foreground text-background px-8 py-3 rounded-full hover:bg-zinc-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed w-auto min-w-[160px]"
                                        >
                                            Calculate Fee
                                        </Button>
                                        <button
                                            onClick={handleReset}
                                            className="text-sans text-label uppercase text-muted-foreground border-b border-muted-foreground/30 pb-1 hover:text-foreground hover:border-foreground transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                {calculatedFee !== null && (
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="mt-12 pt-10 border-t border-border"
                                        >
                                            <div className="bg-surface-dark p-8 rounded-[1.5rem] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                                    <Scale size={120} />
                                                </div>

                                                <div className="relative z-10">
                                                    <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-3 flex items-center gap-2">
                                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                                        Calculated Court Fee
                                                    </p>
                                                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                                                        <motion.span
                                                            key={calculatedFee}
                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            className="text-sans text-subheading md:text-heading font-bold text-surface-dark-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 whitespace-nowrap"
                                                        >
                                                            ₹{calculatedFee.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                                        </motion.span>
                                                        <span className="text-sans text-body text-surface-charcoal-foreground/60 italic">
                                                            ({formatToWords(calculatedFee)} only)
                                                        </span>
                                                    </div>
                                                    <p className="text-sans text-sm text-surface-charcoal-foreground/50 mt-8 leading-relaxed border-l-2 border-surface-charcoal-foreground/20 pl-4">
                                                        * This estimate is based on the Ad Valorem fee schedule.
                                                        Calculations for states other than Delhi currently use the same universal algorithm.
                                                        The final fee is subject to verification by the court registry.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>

                        {/* Information Sidebar */}
                        <div className="lg:col-span-5">
                            <div className="bg-surface-dark p-10 lg:p-14 sticky top-32">
                                <div className="flex items-center gap-3 mb-8">
                                    <FileText size={20} className="text-surface-charcoal-foreground/50" />
                                    <h3 className="text-sans text-body font-bold text-surface-dark-foreground">
                                        Court Fee Rules
                                    </h3>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            Ad Valorem Calculation
                                        </h4>
                                        <p className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed">
                                            In Delhi, court fees for civil suits are calculated based on the value of the subject matter
                                            using a slab-based incremental system.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            Fee Slabs (Quick View)
                                        </h4>
                                        <ul className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed space-y-2">
                                            <li>• Up to ₹5: ₹0.50</li>
                                            <li>• ₹5 - ₹100: ₹0.50 per ₹5</li>
                                            <li>• ₹100 - ₹500: ₹1 per ₹10</li>
                                            <li>• ₹500 - ₹1,000: ₹1.50 per ₹10</li>
                                            <li>• ₹1,000 - ₹5,000: ₹12.20 per ₹100</li>
                                            <li>• ₹5,000 - ₹10,000: ₹24.40 per ₹250</li>
                                            <li>• ₹10,000 - ₹20,000: ₹36.50 per ₹500</li>
                                            <li>• ₹20,000 - ₹30,000: ₹48.80 per ₹1,000</li>
                                            <li>• ₹30,000 - ₹50,000: ₹48.80 per ₹2,000</li>
                                            <li>• Above ₹50,000: ₹48.80 per ₹5,000</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            Lawyer's Quick Rule
                                        </h4>
                                        <p className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed">
                                            For claims exceeding ₹50,000, the fee increases at a rate of ₹48.80 for
                                            every ₹5,000 or part thereof in excess of the base.
                                        </p>
                                    </div>

                                    <div className="border-t border-surface-charcoal-foreground/10 pt-8">
                                        <p className="text-sans text-xs text-surface-charcoal-foreground/40 leading-relaxed">
                                            This calculator uses a standard Ad Valorem formula. Always verify with
                                            current amendments and the local court registry for final fee determination.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fee Structure Table Section */}
            <section className="bg-surface-dark py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <TableIcon size={24} className="text-surface-charcoal-foreground/50" />
                                <h2 className="text-sans text-display-sm font-bold text-surface-dark-foreground">
                                    General Court Fee Structure
                                </h2>
                            </div>
                            <p className="text-sans text-body text-surface-charcoal-foreground/60 max-w-2xl mx-auto">
                                Reference table for various court fee types across jurisdictions
                            </p>
                        </div>
                    </ScrollReveal>

                    {loadingFees ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-surface-charcoal-foreground/20 border-t-surface-dark-foreground rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <ScrollReveal delay={0.2}>
                            <div className="bg-white border border-border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-foreground text-background">
                                                <th className="px-6 py-4 text-left text-sans text-label uppercase tracking-wider">
                                                    Case Type
                                                </th>
                                                <th className="px-6 py-4 text-left text-sans text-label uppercase tracking-wider">
                                                    Court Type
                                                </th>
                                                <th className="px-6 py-4 text-left text-sans text-label uppercase tracking-wider">
                                                    Claim Value Range
                                                </th>
                                                <th className="px-6 py-4 text-left text-sans text-label uppercase tracking-wider">
                                                    Fixed Fee
                                                </th>
                                                <th className="px-6 py-4 text-left text-sans text-label uppercase tracking-wider">
                                                    Percentage Fee
                                                </th>
                                                <th className="px-6 py-4 text-left text-sans text-label uppercase tracking-wider">
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {feeStructures.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                                        No additional fee structure data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                feeStructures.map((fee) => (
                                                    <tr key={fee.id} className="hover:bg-surface-dark/5 transition-colors">
                                                        <td className="px-6 py-4 text-sans font-semibold text-foreground">
                                                            {fee.case_type}
                                                        </td>
                                                        <td className="px-6 py-4 text-sans text-muted-foreground">
                                                            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs uppercase rounded">
                                                                {formatCourtType(fee.court_type)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sans text-muted-foreground">
                                                            {fee.min_claim_value !== null && fee.max_claim_value !== null
                                                                ? `${formatCurrency(fee.min_claim_value)} - ${formatCurrency(fee.max_claim_value)}`
                                                                : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sans font-semibold text-foreground">
                                                            {formatCurrency(fee.fixed_fee)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sans text-muted-foreground">
                                                            {fee.percentage_fee ? `${fee.percentage_fee}%` : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sans text-sm text-muted-foreground max-w-xs">
                                                            {fee.description}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-sans text-xs text-surface-charcoal-foreground/40 leading-relaxed max-w-3xl mx-auto">
                                    * The above table is for general reference. For Delhi specific civil suits, use the Ad Valorem calculator above.
                                </p>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default CourtFeeCalculator;
