import React, { useState } from 'react';
import { X } from 'lucide-react';

const REPORT_REASONS = [
    { id: 'spam', label: 'Spam' },
    { id: 'harmful', label: 'Konten Berbahaya' },
    { id: 'sexuality', label: 'Konten Seksual' },
    { id: 'violence', label: 'Kekerasan' },
    { id: 'hoax', label: 'Informasi Menyesatkan/Hoax' },
    { id: 'sara', label: 'SARA' }
];

export default function ReportModal({ postId, onClose, onSubmit }) {
    const [selectedReason, setSelectedReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);
        await onSubmit(postId, selectedReason);
        setIsSubmitting(false);
        setShowConfirmation(true);

        // Auto-close after 2 seconds
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    if (showConfirmation) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-sm text-slate-600">
                        Terima kasih.<br />
                        Kami akan cek konten ini agar Bisik tetap aman.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Laporkan Konten</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                    Pilih alasan pelaporan:
                </p>

                <div className="space-y-2 mb-6">
                    {REPORT_REASONS.map(reason => (
                        <label
                            key={reason.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition"
                        >
                            <input
                                type="radio"
                                name="reason"
                                value={reason.id}
                                checked={selectedReason === reason.id}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="text-brand-600 focus:ring-brand-500"
                            />
                            <span className="text-sm text-slate-700">{reason.label}</span>
                        </label>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selectedReason || isSubmitting}
                    className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition"
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                </button>
            </div>
        </div>
    );
}
