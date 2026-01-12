import React, { useEffect, useState, useMemo } from 'react';
import useFeedStore from '../store/feedStore';
import useUserStore from '../store/userStore';
import PostCard from '../components/PostCard';
import AdCard from '../components/AdCard';
import DealCard from '../components/DealCard';
import HeadsUpCard from '../components/HeadsUpCard';
import IntelComposer from '../components/IntelComposer';
import { Send, MapPin, Loader2, Megaphone, MessageSquarePlus } from 'lucide-react';
import clsx from 'clsx';
import WelcomeModal from '../components/WelcomeModal';

const DISTANCES = [
    { label: '< 50m', value: 50 },
    { label: '< 100m', value: 100 },
    { label: '< 500m', value: 500 },
    { label: '< 1km', value: 1000 },
    { label: '< 2km', value: 2000 },
    { label: '< 5km', value: 5000 },
    { label: '< 10km', value: 10000 },
];

const PROMPTS = [
    "Hal apa yang paling bikin kamu capek minggu ini?",
    "Ada yang mau kamu bilang tapi nggak bisa di dunia nyata?",
    "Kerjaan, keluarga, atau cinta—mana yang lagi berat?",
    "Apa yang pengen kamu ubah dari hidupmu sekarang?",
    "Ada yang merasa stuck tapi nggak tau harus ngapain?",
    "Hal apa yang bikin kamu overthinking akhir-akhir ini?",
    "Apa yang kamu rasain tapi nggak berani cerita ke siapa-siapa?"
];

// Mock ads (in production, fetch from backend)
const MOCK_ADS = [
    {
        id: 'ad_001',
        title: 'Capek kerja? Cari ruang aman buat cerita',
        description: 'Ruang diskusi & tools yang bisa kamu akses kapan saja.',
        cta: 'Pelajari',
        url: 'https://example.com'
    },
    {
        id: 'ad_002',
        title: 'Banyak orang lagi mikirin kariernya',
        description: 'Bukan solusi instan, tapi bisa bantu lebih tenang.',
        cta: 'Pelajari',
        url: 'https://example.com'
    },
    {
        id: 'ad_003',
        title: 'Belajar atur keuangan tanpa ribet',
        description: 'Baca dulu, nggak perlu daftar.',
        cta: 'Pelajari',
        url: 'https://example.com'
    },
    {
        id: 'ad_004',
        title: 'Bacaan ringan soal kerja & hidup',
        description: 'Kalau kamu lagi butuh perspektif lain.',
        cta: 'Pelajari',
        url: 'https://example.com'
    }
];

export default function Feed() {
    const { posts, intel, myPosts, loading, fetchPosts, fetchIntel, addPost } = useFeedStore();
    const { city, institution, anonId, gender, occupation, location } = useUserStore();

    // Composers
    const [showCurhatComposer, setShowCurhatComposer] = useState(false);
    const [showIntelComposer, setShowIntelComposer] = useState(false);

    // Curhat State
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('WELCOME_SHOWN'));

    // Filters & Tabs
    const [activeTab, setActiveTab] = useState('all'); // 'all' (Sekitar) | 'popular' | 'me' (Aktivitasku)
    const [radius, setRadius] = useState('');
    const [filterChip, setFilterChip] = useState('ALL'); // 'ALL' | 'CURHAT' | 'DEAL' | 'HEADSUP'

    // Rotating prompt
    const [placeholder] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

    useEffect(() => {
        const params = { radius: radius || null };

        if (activeTab === 'all') {
            // Fetch both standard posts and intel
            fetchPosts(params);
            fetchIntel(params);
        } else if (activeTab === 'popular') {
            fetchPosts({ ...params, sort: 'popular' });
            // Intel doesn't have popular sort yet in spec, so just normal intel or skip
            // Prompt says "In Sekitar tab, add filter chips", implies popular deals with curhat or maybe mixed but sorted.
            // Let's keep it simple: Popular = Popular Posts (Curhat) for now.
        } else {
            fetchPosts({ myPosts: true });
        }
    }, [city, institution, radius, activeTab]);

    const handleCloseWelcome = () => {
        localStorage.setItem('WELCOME_SHOWN', 'true');
        setShowWelcome(false);
    };

    const handleSubmitCurhat = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);

        const postPayload = {
            content,
            city,
            institution: null,
            gender,
            occupation,
            anon_id: anonId,
            lat: location?.lat,
            long: location?.long,
            topic: null
        };

        await addPost(postPayload);

        setContent('');
        setIsSubmitting(false);
        setShowCurhatComposer(false); // Close composer after submit

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
    };

    // Feed Mixing Logic
    const mixedFeed = useMemo(() => {
        if (activeTab === 'me') return myPosts;
        if (activeTab === 'popular') return posts; // Only curhat in popular for now

        // Tab 'Sekitar' (activeTab === 'all')

        // 1. Filtering by Chip
        let filteredPosts = posts;
        let filteredIntel = intel;

        if (filterChip === 'CURHAT') filteredIntel = [];
        if (filterChip === 'DEAL') {
            filteredPosts = [];
            filteredIntel = intel.filter(i => i.type === 'DEAL');
        }
        if (filterChip === 'HEADSUP') {
            filteredPosts = [];
            filteredIntel = intel.filter(i => i.type === 'HEADSUP');
        }

        // 2. Combine and Sort (Simple Chronological)
        const combined = [...filteredPosts, ...filteredIntel];
        return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [activeTab, filterChip, posts, intel, myPosts]);


    return (
        <div className="pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-brand-600">Bisik</h1>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <MapPin size={16} />
                        <span className="font-medium">{city}</span>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="px-4 pb-2 flex items-center justify-between">
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        {['all', 'popular', 'me'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx("px-3 py-1 text-xs font-semibold rounded-md transition-all", activeTab === tab ? "bg-white shadow-sm text-brand-600" : "text-slate-500")}
                            >
                                {tab === 'all' ? 'Sekitar' : tab === 'popular' ? 'Popular' : 'Aktivitasku'}
                            </button>
                        ))}
                    </div>

                    {(activeTab === 'all' || activeTab === 'popular') && (
                        <div className="flex items-center gap-2">
                            <select
                                className="bg-slate-50 text-xs border-0 rounded-lg py-1 pl-2 pr-6 focus:ring-1 focus:ring-brand-200"
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                disabled={!location}
                            >
                                <option value="">Semua Area</option>
                                {DISTANCES.map(d => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Filter Chips (Only in Sekitar tab) */}
                {activeTab === 'all' && (
                    <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
                        {['ALL', 'CURHAT', 'DEAL', 'HEADSUP'].map(chip => (
                            <button
                                key={chip}
                                onClick={() => setFilterChip(chip)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border",
                                    filterChip === chip
                                        ? "bg-brand-600 text-white border-brand-600"
                                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                {chip === 'ALL' ? 'Semua' : chip === 'CURHAT' ? 'Curhat' : chip === 'DEAL' ? 'Deal' : 'Heads-up'}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            {/* Composer Entry (Split Buttons) */}
            {activeTab === 'all' && !showCurhatComposer && (
                <div className="p-4 bg-white border-b border-slate-100 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setShowCurhatComposer(true)}
                        className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition"
                    >
                        <MessageSquarePlus className="text-brand-600 mb-2" size={24} />
                        <span className="font-bold text-slate-700 text-sm">Bisik Curhat</span>
                        <span className="text-[10px] text-slate-500">Cerita anonim</span>
                    </button>

                    <button
                        onClick={() => setShowIntelComposer(true)}
                        className="flex flex-col items-center justify-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition"
                    >
                        <Megaphone className="text-emerald-600 mb-2" size={24} />
                        <span className="font-bold text-slate-700 text-sm">Info Sekitar</span>
                        <span className="text-[10px] text-slate-500">Deal & Heads-up</span>
                    </button>
                </div>
            )}

            {/* Curhat Composer Expanded */}
            {showCurhatComposer && (
                <div className="p-4 bg-white border-b border-slate-100 animate-slide-down">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] text-slate-400">
                            🔒 Anonim & sementara
                        </p>
                        <button onClick={() => setShowCurhatComposer(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                            Batal
                        </button>
                    </div>

                    <textarea
                        className="w-full bg-slate-50 border-0 rounded-xl p-3 text-base focus:ring-2 focus:ring-brand-100 resize-none min-h-[100px]"
                        placeholder={placeholder}
                        maxLength={500}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        autoFocus
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={handleSubmitCurhat}
                            disabled={!content.trim() || isSubmitting}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            <span>Bisikin</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce-in">
                    ✅ Terkirim!
                </div>
            )}

            {/* Feed List */}
            <div className="min-h-[50vh]">
                {loading && mixedFeed.length === 0 ? (
                    <div className="flex justify-center p-8 text-slate-400">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    mixedFeed.map((item, idx) => {
                        // Determine Item Type
                        const isPost = item.post_id; // Simple check

                        return (
                            <React.Fragment key={item.post_id || item.intel_id}>
                                {isPost && <PostCard post={item} />}
                                {!isPost && item.type === 'DEAL' && <DealCard intel={item} />}
                                {!isPost && item.type === 'HEADSUP' && <HeadsUpCard intel={item} />}

                                {/* Inject ad every 7 items */}
                                {(idx + 1) % 7 === 0 && idx < mixedFeed.length - 1 && (
                                    <AdCard
                                        key={`ad-${idx}`}
                                        ad={MOCK_ADS[Math.floor(idx / 7) % MOCK_ADS.length]}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })
                )}

                {!loading && mixedFeed.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-4 opacity-50">🤫</div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px] mx-auto">
                            {activeTab === 'all'
                                ? 'Belum ada update di sekitarmu. Jadilah yang pertama!'
                                : 'Kamu belum ada aktivitas.'}
                        </p>
                    </div>
                )}
            </div>

            {showWelcome && <WelcomeModal onConfirm={handleCloseWelcome} />}
            {showIntelComposer && <IntelComposer onClose={() => setShowIntelComposer(false)} />}
        </div>
    );
}
