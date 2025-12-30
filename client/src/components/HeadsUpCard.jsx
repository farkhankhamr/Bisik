import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCcw, Flag } from 'lucide-react';
import { formatDistanceToNow, formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import useFeedStore from '../store/feedStore';
import useUserStore from '../store/userStore';

export default function HeadsUpCard({ intel }) {
    const { interactIntel, reportContent } = useFeedStore();
    const { anonId } = useUserStore();
    const [isAcked, setIsAcked] = useState(false);

    const handleAck = async (e) => {
        e.stopPropagation();
        if (isAcked) return;
        setIsAcked(true);
        await interactIntel(intel.intel_id, 'ack');
    };

    const handleUpdate = async (e) => {
        e.stopPropagation();
        // In MVP, this just increments 'updates' and maybe thanks the user
        // Ideally opens composer prefilled. For urgency, let's just increment count.
        alert("Terima kasih updatenya!"); // Simple feedback
        await interactIntel(intel.intel_id, 'update_click');
    };

    // Calculate time left
    const timeLeft = formatDistance(new Date(intel.expires_at), new Date(), { locale: id });

    return (
        <div className="bg-white border-b border-amber-100 p-4 hover:bg-amber-50/10 transition-colors">
            {/* Header / Meta */}
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                    <AlertTriangle size={10} /> Heads-up
                </span>
                <span className="text-[10px] text-slate-400">
                    {intel.distance_bucket || 'Nearby'} • {formatDistanceToNow(new Date(intel.created_at), { addSuffix: true, locale: id })}
                </span>
                <span className="text-[10px] text-amber-600 font-medium ml-auto">
                    Hilang dalam {timeLeft}
                </span>
            </div>

            {/* Content */}
            <div className="mb-3">
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {intel.content}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={handleAck}
                        disabled={isAcked}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${isAcked ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <CheckCircle size={14} />
                        {isAcked ? 'Oke' : 'Oke'}
                        {intel.metrics.ack > 0 && <span className="ml-1 opacity-80">{intel.metrics.ack}</span>}
                    </button>

                    <button
                        onClick={handleUpdate}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                    >
                        <RefreshCcw size={14} />
                        Update
                        {intel.metrics.updates > 0 && <span className="ml-1 opacity-80">{intel.metrics.updates}</span>}
                    </button>
                </div>

                {/* Report (subtle) */}
                <button
                    className="text-slate-300 hover:text-red-400 transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Ideally open report modal
                        const reason = prompt("Lapor info ini? (spam/hoax)");
                        if (reason) reportContent(intel.intel_id, 'INTEL', reason, anonId);
                    }}
                >
                    <Flag size={14} />
                </button>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 italic">
                Info ini akan hilang otomatis.
            </div>
        </div>
    );
}
