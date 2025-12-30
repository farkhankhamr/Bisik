import React from 'react';

export default function AdCard({ ad }) {
    const handleClick = () => {
        // Track ad click (analytics event)
        console.log('Ad clicked:', ad.id);
        if (ad.url) {
            window.open(ad.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="bg-white p-4 border-b border-slate-100">
            {/* Disponsori Label */}
            <span className="text-[10px] text-slate-400 block mb-2">
                Disponsori
            </span>

            {/* Ad Content */}
            <div className="flex gap-3">
                {/* Optional Image/Icon */}
                {ad.image_url && (
                    <img
                        src={ad.image_url}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                )}

                <div className="flex-1 min-w-0">
                    {/* Headline - 1 line max */}
                    <h3 className="text-sm font-medium text-slate-800 line-clamp-1 mb-1">
                        {ad.title}
                    </h3>

                    {/* Body - 2 lines max */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                        {ad.description}
                    </p>

                    {/* Text-only CTA */}
                    <button
                        onClick={handleClick}
                        className="text-xs text-brand-600 hover:text-brand-700 transition-colors inline-flex items-center gap-1"
                    >
                        <span>{ad.cta || 'Pelajari'}</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
