import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';

export default function EditPostModal({ post, onClose, onSave }) {
    const [content, setContent] = useState(post.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate remaining time
    const elapsed = Date.now() - new Date(post.created_at).getTime();
    const remainingMs = (15 * 60 * 1000) - elapsed;
    const remainingMinutes = Math.ceil(remainingMs / 60000);

    const handleSave = async () => {
        if (!content.trim() || content === post.content) return;

        setIsSubmitting(true);
        await onSave(post.post_id, content);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Edit Postingan</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-4">
                    <Clock size={14} />
                    <span>Waktu edit tersisa: {remainingMinutes} menit</span>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={500}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base focus:ring-2 focus:ring-brand-100 resize-none min-h-[120px] mb-2"
                    placeholder="Edit kontenmu..."
                />

                <div className="text-xs text-slate-400 text-right mb-4">
                    {content.length}/500
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!content.trim() || content === post.content || isSubmitting}
                        className="flex-1 py-3 bg-brand-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
