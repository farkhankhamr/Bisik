import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, User, Briefcase } from 'lucide-react';
import clsx from 'clsx';
import useFeedStore from '../store/feedStore';
import useUserStore from '../store/userStore';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import PostActionsMenu from './PostActionsMenu';
import EditPostModal from './EditPostModal';
import ReportModal from './ReportModal';

export default function PostCard({ post }) {
    const { likePost, editPost, deletePost, reportPost } = useFeedStore();
    const { anonId } = useUserStore();
    const navigate = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Detect seed posts
    const isSeed = post.is_seed || post.anon_id === 'SYSTEM_BOT';

    // Format relative time
    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: id });

    // Format distance logic
    const formatDistance = () => {
        let d = post.distance;
        if (isSeed || d === undefined) {
            // Mock distance for seeds or fallback
            const mocks = [42, 85, 120, 310, 490, 850, 1200, 2400];
            // Use post_id hash to keep it consistent per post
            const hash = post.post_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            d = mocks[hash % mocks.length];
        }

        if (d < 50) return '< 50m';
        if (d < 100) return '< 100m';
        if (d < 500) return '< 500m';
        if (d < 1000) return '< 1km';
        if (d < 2000) return '< 2km';
        if (d < 5000) return '< 5km';
        return '< 10km';
    };
    const distanceStr = formatDistance();

    const handleEdit = () => setShowEditModal(true);
    const handleDelete = () => setShowDeleteConfirm(true);
    const handleReport = () => setShowReportModal(true);

    const confirmDelete = async () => {
        await deletePost(post.post_id, anonId);
        setShowDeleteConfirm(false);
    };

    const handleEditSave = async (postId, content) => {
        await editPost(postId, content, anonId);
    };

    const handleReportSubmit = async (postId, reason) => {
        await reportPost(postId, reason, anonId);
    };

    return (
        <>
            <div className={clsx(
                "p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors",
                isSeed ? "bg-slate-50/50" : "bg-white"
            )}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-2 flex-1">
                        {/* Distance Chip */}
                        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-[10px] font-bold tracking-tight">
                            📍 {distanceStr}
                        </span>

                        {/* City Chip - HIDDEN
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-semibold">
                            {post.city}
                        </span>
                        */}

                        {/* Institution Chip */}
                        {post.institution && (
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs font-semibold">
                                {post.institution}
                            </span>
                        )}

                        {/* Topic Chip */}
                        {post.topic && (
                            <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                                {post.topic}
                            </span>
                        )}

                        {/* Gender Chip */}
                        {post.gender && (
                            <span className={clsx(
                                "px-2 py-1 rounded-full text-xs flex items-center gap-1 font-semibold",
                                post.gender === 'M' && "bg-blue-50 text-blue-600",
                                post.gender === 'F' && "bg-red-50 text-red-600",
                                post.gender === 'NB' && "bg-purple-50 text-purple-600"
                            )}>
                                <User size={10} /> {post.gender === 'M' ? 'Pria' : post.gender === 'F' ? 'Wanita' : 'NB'}
                            </span>
                        )}

                        {/* Occupation Chip - HIDDEN
                        {post.occupation && (
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs flex items-center gap-1 font-semibold">
                                <Briefcase size={10} /> {post.occupation}
                            </span>
                        )}
                        */}

                        {/* Seed Post Badge - HIDDEN
                        {isSeed && (
                            <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 italic">
                                Topik pembuka
                            </span>
                        )}
                        */}
                    </div>

                    {/* Actions Menu */}
                    {!isSeed && (
                        <PostActionsMenu
                            post={post}
                            currentUserId={anonId}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onReport={handleReport}
                        />
                    )}
                </div>

                <p className="text-base text-slate-800 font-medium mb-3 whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center justify-between text-slate-400 text-sm">
                    <div className="flex gap-4">
                        <button
                            onClick={() => likePost(post.post_id)}
                            className={clsx("flex items-center gap-1 transition-colors", post.has_liked ? "text-red-500" : "hover:text-red-500")}
                        >
                            <Heart size={18} className={clsx(post.has_liked && "fill-red-500")} />
                            <span>{post.likes || 0}</span>
                            {post.likes === 0 && (
                                <span className="text-[10px] text-slate-400 ml-1">
                                    Belum ada yang respon
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate(`/chat/${post.post_id}`)}
                            className="flex items-center gap-1 hover:text-brand-500 transition-colors"
                        >
                            <MessageCircle size={18} />
                            <span>Chat</span>
                        </button>
                    </div>

                    <span className="text-xs">{timeAgo}</span>
                </div>
            </div>

            {/* Modals */}
            {showEditModal && (
                <EditPostModal
                    post={post}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEditSave}
                />
            )}

            {showReportModal && (
                <ReportModal
                    postId={post.post_id}
                    onClose={() => setShowReportModal(false)}
                    onSubmit={handleReportSubmit}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Postingan?</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Postingan ini akan dihapus permanen dan tidak bisa dikembalikan.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
