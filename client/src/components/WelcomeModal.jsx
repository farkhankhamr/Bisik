import React from 'react';

export default function WelcomeModal({ onConfirm }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🤫</span>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-3">Selamat datang di Bisik</h2>

                <p className="text-sm text-slate-600 leading-relaxed mb-8">
                    Tempat orang ngomong jujur tanpa nama.<br />
                    Jaga percakapan tetap aman & saling menghargai.
                </p>

                <button
                    onClick={onConfirm}
                    className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg shadow-brand-100"
                >
                    Mengerti
                </button>
            </div>
        </div>
    );
}
