
import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

const AdminStatCard = ({ title, value, icon: Icon, trend, trendUp }: AdminStatCardProps) => {
    return (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black tracking-tight text-black">{value}</h3>
        </div>
    );
};

export default AdminStatCard;
