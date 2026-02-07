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

// Court Fee Calculation Logic based on Himachal Pradesh Court Fees Act
const calculateCourtFee = (V: number): number => {
    if (V <= 0) return 0;
    if (V <= 5) return 1;

    if (V <= 100)
        return 1 + Math.ceil((V - 5) / 5);

    if (V <= 500)
        return 20 + Math.ceil((V - 100) / 10);

    if (V <= 1000)
        return 60 + Math.ceil((V - 500) / 10) * 2;

    if (V <= 5000)
        return 160 + Math.ceil((V - 1000) / 100) * 15;

    if (V <= 10000)
        return 760 + Math.ceil((V - 5000) / 250) * 25;

    if (V <= 20000)
        return 1260 + Math.ceil((V - 10000) / 500) * 40;

    if (V <= 30000)
        return 2060 + Math.ceil((V - 20000) / 1000) * 50;

    if (V <= 50000)
        return 2560 + Math.ceil((V - 30000) / 2000) * 50;

    if (V <= 400000)
        return 3060 + Math.ceil((V - 50000) / 5000) * 50;

    return 6560 + Math.ceil((V - 400000) / 5000) * 50;
};

// Helper to format numbers to words (Simple version for Indian context)
const formatToWords = (num: number): string => {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const numStr = num.toString();
    if (numStr.length > 9) return 'overflow';
    const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[parseInt(n[1][0])] + ' ' + a[parseInt(n[1][1])]) + 'crore ' : '';
    str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[parseInt(n[2][0])] + ' ' + a[parseInt(n[2][1])]) + 'lakh ' : '';
    str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[parseInt(n[3][0])] + ' ' + a[parseInt(n[3][1])]) + 'thousand ' : '';
    str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[parseInt(n[4][0])] + ' ' + a[parseInt(n[4][1])]) + 'hundred ' : '';
    str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[parseInt(n[5][0])] + ' ' + a[parseInt(n[5][1])]) : '';
    return str.trim();
};

import { useQuery } from '@tanstack/react-query';

const CourtFeeCalculator = () => {
    const [caseType, setCaseType] = useState<string>("");
    const [claimAmount, setClaimAmount] = useState<string>("");
    const [calculatedFee, setCalculatedFee] = useState<number | null>(null);

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

        let fee = 0;

        switch (caseType) {
            case "plaint":
                fee = calculateCourtFee(amount);
                break;
            case "possession":
                fee = Math.ceil(calculateCourtFee(amount) / 2);
                break;
            case "review_before_90":
                fee = Math.ceil(calculateCourtFee(amount) / 2);
                break;
            case "review_after_90":
                fee = calculateCourtFee(amount);
                break;
            case "appeal":
                fee = calculateCourtFee(amount);
                break;
            default:
                fee = 0;
        }

        setCalculatedFee(fee);
    };

    const handleReset = () => {
        setCaseType("");
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
        return `₹${value.toLocaleString('en-IN')}`;
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
                            Court Fee Calculator
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Calculate court fees for civil suits based on the latest ad valorem fee schedule.
                            Enter your claim amount and case type to get an instant fee calculation.
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
                                            Case Type
                                        </Label>
                                        <Select value={caseType} onValueChange={setCaseType}>
                                            <SelectTrigger className="w-full bg-transparent border-none border-b-2 border-border rounded-none px-0 pb-4 h-auto text-sans text-body-lg text-foreground focus:ring-0 focus:border-foreground transition-all hover:border-foreground/60">
                                                <SelectValue placeholder="Select case type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-border text-foreground">
                                                <SelectItem value="plaint">Plaint / Written Statement</SelectItem>
                                                <SelectItem value="appeal">Memorandum of Appeal</SelectItem>
                                                <SelectItem value="possession">Suit for Possession (Specific Relief Act)</SelectItem>
                                                <SelectItem value="review_before_90">Review of Judgment (Before 90 days)</SelectItem>
                                                <SelectItem value="review_after_90">Review of Judgment (After 90 days)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-sans text-label uppercase text-muted-foreground mb-4 block">
                                            Claim Amount (₹)
                                        </Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                value={claimAmount}
                                                onChange={(e) => setClaimAmount(e.target.value)}
                                                placeholder="Enter claim amount"
                                                className="w-full bg-transparent border-b-2 border-border pb-4 pl-8 text-sans text-body-lg text-foreground focus:outline-none focus:border-foreground transition-colors border-t-0 border-x-0 rounded-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button
                                            onClick={handleCalculate}
                                            disabled={!caseType || !claimAmount}
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
                                                            className="text-sans text-display font-bold text-surface-dark-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
                                                        >
                                                            ₹{calculatedFee.toLocaleString('en-IN')}
                                                        </motion.span>
                                                        <span className="text-sans text-body text-surface-charcoal-foreground/60 italic">
                                                            (Rupees {formatToWords(calculatedFee)} only)
                                                        </span>
                                                    </div>
                                                    <p className="text-sans text-sm text-surface-charcoal-foreground/50 mt-8 leading-relaxed border-l-2 border-surface-charcoal-foreground/20 pl-4">
                                                        * This estimate is based on the standard ad valorem fee schedule.
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
                                        Important Information
                                    </h3>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            About Court Fees
                                        </h4>
                                        <p className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed">
                                            Court fees are calculated based on the value of the subject matter in dispute.
                                            The fee structure is progressive, meaning higher claim amounts attract proportionally
                                            higher fees.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            Fee Schedule
                                        </h4>
                                        <ul className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed space-y-2">
                                            <li>• Up to ₹100: ₹1 per ₹5</li>
                                            <li>• ₹100 - ₹500: ₹1 per ₹10</li>
                                            <li>• ₹500 - ₹1,000: ₹2 per ₹10</li>
                                            <li>• ₹1,000 - ₹5,000: ₹15 per ₹100</li>
                                            <li>• ₹5,000 - ₹10,000: ₹25 per ₹250</li>
                                            <li>• ₹10,000 - ₹20,000: ₹40 per ₹500</li>
                                            <li>• Above ₹20,000: Progressive rates apply</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            Special Cases
                                        </h4>
                                        <p className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed">
                                            Suits for possession under the Specific Relief Act attract half the normal fee.
                                            Review petitions filed before 90 days also attract half the fee, while those
                                            filed after 90 days attract the full fee.
                                        </p>
                                    </div>

                                    <div className="border-t border-surface-charcoal-foreground/10 pt-8">
                                        <p className="text-sans text-xs text-surface-charcoal-foreground/40 leading-relaxed">
                                            This calculator is based on the latest Court Fees Act schedule and provides
                                            estimates for informational purposes only. For official fee determination,
                                            please consult the court registry or a legal professional.
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
                                    Court Fee Structure
                                </h2>
                            </div>
                            <p className="text-sans text-body text-surface-charcoal-foreground/60 max-w-2xl mx-auto">
                                Comprehensive table of court fees for different case types across various courts
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
                                                        No fee structure data available
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
                                    * The above fee structure is for reference purposes only. Actual court fees may vary based on specific
                                    circumstances, amendments to the Court Fees Act, and judicial discretion. Always verify with the
                                    respective court registry before filing.
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
