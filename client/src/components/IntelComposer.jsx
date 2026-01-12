import React, { useState, useCallback } from 'react';
import { X, Tag, AlertTriangle, Clock } from 'lucide-react';
import useFeedStore from '../store/feedStore';
import useUserStore from '../store/userStore';

export default function IntelComposer({ onClose }) {
    const { addIntel } = useFeedStore();
    const { anonId, city, location } = useUserStore();
    const [step, setStep] = useState('select'); // select, deal, headsup, headsup-form
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Deal State
    const [dealContent, setDealContent] = useState('');
    const [validity, setValidity] = useState('TODAY');
    const [placeHint, setPlaceHint] = useState(null);
    const [seenDirectly, setSeenDirectly] = useState(true);

    // Heads-up State
    const [headsUpType, setHeadsUpType] = useState(null);
    const [headsUpContent, setHeadsUpContent] = useState('');

    const handleSubmitDeal = async () => {
        if (!dealContent.trim()) return;
        setIsSubmitting(true);
        try {
            await addIntel({
                type: 'DEAL',
                content: dealContent,
                city,
                anon_id: anonId,
                lat: location?.lat,
                long: location?.long,
                deal_meta: {
                    validity_preset: validity,
                    place_hint: placeHint,
                    seen_directly: seenDirectly
                }
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Gagal mengirim. Coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectHeadsUpType = useCallback((type) => {
        setHeadsUpType(type);
        setStep('headsup-form');
        const templates = {
            'RAME': 'Di sekitar sini lagi rame.',
            'ANTRI': 'Di sekitar sini lagi antri panjang.',
            'TUTUP': 'Tempat di sekitar sini lagi tutup / tidak beroperasi.',
            'PARKIR_SUSAH': 'Parkir di sekitar sini lagi susah.',
            'BISING': 'Di sekitar sini lagi berisik (event/keramaian).'
        };
        setHeadsUpContent(templates[type] || '');
    }, []);

    const handleSubmitHeadsUp = async () => {
        if (!headsUpType) return;
        setIsSubmitting(true);
        try {
            await addIntel({
                type: 'HEADSUP',
                content: headsUpContent,
                city,
                anon_id: anonId,
                lat: location?.lat,
                long: location?.long,
                headsup_meta: {
                    heads_up_type: headsUpType
                }
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Gagal mengirim. Coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = useCallback(() => {
        if (step === 'headsup-form') setStep('headsup');
        else if (step !== 'select') setStep('select');
        else onClose();
    }, [step, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={handleBack} className="text-xs font-bold text-slate-500">
                        {step !== 'select' ? '← Kembali' : ''}
                    </button>
                    <button onClick={onClose} className="text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                {/* Selection Step */}
                {step === 'select' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Bagikan Info Sekitar</h3>
                        <button
                            onClick={() => setStep('deal')}
                            className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4 hover:bg-emerald-100 transition"
                        >
                            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                <Tag size={24} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-emerald-800">Bagikan Deal</div>
                                <div className="text-xs text-emerald-600">Promo, diskon, atau harga miring.</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setStep('headsup')}
                            className="w-full p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-4 hover:bg-amber-100 transition"
                        >
                            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-amber-800">Bagikan Heads-up</div>
                                <div className="text-xs text-amber-600">Rame, macet, tutup, atau situasi sikon.</div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Deal Form */}
                {step === 'deal' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold">
                            <Tag size={18} /> Bagikan Deal
                        </div>
                        <textarea
                            value={dealContent}
                            onChange={(e) => setDealContent(e.target.value)}
                            maxLength={160}
                            placeholder="Contoh: Diskon 30% kopi jam 2–5 sore di sekitar sini."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base focus:ring-2 focus:ring-emerald-200 resize-none min-h-[100px]"
                        />
                        <div className="text-xs text-slate-400 text-right">{dealContent.length}/160</div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-2 block">Berlaku Sampai</label>
                            <div className="flex flex-wrap gap-2">
                                {['TODAY', 'TOMORROW', 'WEEKEND', '48H'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setValidity(v)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${validity === v ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}
                                    >
                                        {v === 'TODAY' ? 'Hari ini' : v === 'TOMORROW' ? 'Besok' : v === 'WEEKEND' ? 'Weekend' : '48 Jam'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-2 block">Lokasi (Opsional)</label>
                            <div className="flex flex-wrap gap-2">
                                {['MALL', 'CAFE', 'RESTO', 'MINIMARKET', 'CAMPUS'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPlaceHint(p === placeHint ? null : p)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${placeHint === p ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="seen"
                                checked={seenDirectly}
                                onChange={(e) => setSeenDirectly(e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="seen" className="text-xs text-slate-600">Aku lihat langsung</label>
                        </div>
                        <p className="text-[10px] text-slate-400">
                            Singkat aja. Jangan tulis nomor/WA/IG, nama orang, atau alamat lengkap.
                        </p>
                        <button
                            onClick={handleSubmitDeal}
                            disabled={!dealContent.trim() || isSubmitting}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Bagikan Deal'}
                        </button>
                    </div>
                )}

                {/* Heads-up Selection */}
                {step === 'headsup' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-600 font-bold mb-4">
                            <AlertTriangle size={18} /> Pilih Situasi
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'RAME', label: 'Rame Banget', icon: '👥' },
                                { id: 'ANTRI', label: 'Antri Panjang', icon: '🚶' },
                                { id: 'TUTUP', label: 'Tutup / Off', icon: '⛔' },
                                { id: 'PARKIR_SUSAH', label: 'Parkir Susah', icon: '🚗' },
                                { id: 'BISING', label: 'Berisik / Event', icon: '🔊' },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectHeadsUpType(item.id)}
                                    className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-left hover:bg-amber-100 transition"
                                >
                                    <div className="text-2xl mb-1">{item.icon}</div>
                                    <div className="font-bold text-amber-900 text-sm">{item.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Heads-up Form */}
                {step === 'headsup-form' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-600 font-bold">
                            <AlertTriangle size={18} /> Detail Situasi
                        </div>
                        <textarea
                            value={headsUpContent}
                            onChange={(e) => setHeadsUpContent(e.target.value)}
                            maxLength={120}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base focus:ring-2 focus:ring-amber-200 resize-none min-h-[100px]"
                        />
                        <div className="text-xs text-slate-400 text-right">{headsUpContent.length}/120</div>
                        <div className="bg-amber-50 p-3 rounded-lg flex items-center gap-2 text-xs text-amber-700">
                            <Clock size={14} />
                            <span>Info ini akan hilang otomatis dalam 8 jam.</span>
                        </div>
                        <button
                            onClick={handleSubmitHeadsUp}
                            disabled={!headsUpContent.trim() || isSubmitting}
                            className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Bagikan Info'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

