import React, { useState } from 'react';
import { MoreHorizontal, Edit2, Trash2, Flag } from 'lucide-react';

export default function PostActionsMenu({ post, currentUserId, onEdit, onDelete, onReport }) {
    const [isOpen, setIsOpen] = useState(false);
    const isOwnPost = post.anon_id === currentUserId;

    // Check if edit window is still open (15 minutes)
    const elapsed = Date.now() - new Date(post.created_at).getTime();
    const canEdit = isOwnPost && elapsed < 15 * 60 * 1000;
    const remainingMinutes = canEdit ? Math.ceil((15 * 60 * 1000 - elapsed) / 60000) : 0;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
            >
                <MoreHorizontal size={16} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px]">
                        {isOwnPost ? (
                            <>
                                {canEdit && (
                                    <button
                                        onClick={() => { onEdit(); setIsOpen(false); }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                    >
                                        <Edit2 size={14} />
                                        <span>Edit ({remainingMinutes}m)</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => { onDelete(); setIsOpen(false); }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={14} />
                                    <span>Hapus</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { onReport(); setIsOpen(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-orange-600"
                            >
                                <Flag size={14} />
                                <span>Laporkan</span>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
