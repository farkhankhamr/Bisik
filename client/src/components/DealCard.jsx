import React, { useState } from 'react';
import { Tag, MapPin, Bookmark, ExternalLink, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import useFeedStore from '../store/feedStore';
import useUserStore from '../store/userStore';

export default function DealCard({ intel }) {
    const { interactIntel, reportContent } = useFeedStore();
    const { anonId } = useUserStore();

    // We can't really track local state perfectly for optimistic without more complexity
    // But let's use the intel.metrics values
    const [isSaved, setIsSaved] = useState(false); // Local toggle state for immediate feedback

    const handleSave = async (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        await interactIntel(intel.intel_id, isSaved ? 'unsave' : 'save');
    };

    const handleDirection = async (e) => {
        e.stopPropagation();
        await interactIntel(intel.intel_id, 'direction_click');
        // In H5 MVP, this might open Google Maps search with "near me" or just do nothing visual yet
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(intel.content + ' ' + intel.city)}`, '_blank');
    };

    const validUntil = intel.deal_meta.validity_preset === 'TODAY' ? 'Hari ini'
        : intel.deal_meta.validity_preset === 'TOMORROW' ? 'Besok'
            : intel.deal_meta.validity_preset === 'WEEKEND' ? 'Weekend'
                : '48 Jam';

    return (
        <div className="bg-white border-b border-emerald-100 p-4 hover:bg-emerald-50/10 transition-colors">
            {/* Header / Meta */}
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                    <Tag size={10} /> Deal
                </span>
                <span className="text-[10px] text-slate-400">
                    {intel.distance_bucket || 'Nearby'} • {formatDistanceToNow(new Date(intel.created_at), { addSuffix: true, locale: id })}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium ml-auto">
                    Berlaku: {validUntil}
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
                        onClick={handleSave}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${isSaved ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                        {isSaved ? 'Disimpan' : 'Simpan'}
                        {intel.metrics.saves > 0 && <span className="ml-1 opacity-80">{intel.metrics.saves}</span>}
                    </button>

                    <button
                        onClick={handleDirection}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                    >
                        <MapPin size={14} />
                        Arah
                    </button>
                </div>

                {/* Report (subtle) */}
                <button
                    className="text-slate-300 hover:text-red-400 transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Ideally open report modal, for MVP simple prompt or direct call
                        const reason = prompt("Lapor intel ini? (spam/hoax)");
                        if (reason) reportContent(intel.intel_id, 'INTEL', reason, anonId);
                    }}
                >
                    <Flag size={14} />
                </button>
            </div>

            {intel.metrics.saves === 0 && !isSaved && (
                <div className="mt-2 text-[10px] text-slate-400 italic">
                    Belum ada yang simpan — kamu duluan?
                </div>
            )}
        </div>
    );
}
