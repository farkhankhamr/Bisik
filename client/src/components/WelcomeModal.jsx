import React from 'react';

export default function WelcomeModal({ onConfirm }) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#FFF9F0] text-center animate-in fade-in duration-500">
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">

                <h2 className="text-sm font-medium text-[#5A4E3D] tracking-wide mb-2 opacity-80">
                    Mau curhat tapi malu?
                </h2>

                <h1 className="text-6xl font-serif text-[#2A241D] mb-12 tracking-tight animate-typewriter overflow-hidden whitespace-nowrap border-r-4 border-[#2A241D] mx-auto">
                    Bisikin
                </h1>

                <button
                    onClick={onConfirm}
                    className="w-full max-w-[280px] py-4 bg-[#1E1E1E] text-[#FFF9F0] rounded-2xl font-bold text-lg tracking-wide hover:bg-black transition-all duration-200 active:scale-[1.2] shadow-2xl shadow-black/10"
                >
                    Mulai Bisikin
                </button>

                <p className="mt-8 text-[10px] text-[#8C8476] max-w-[200px] leading-tight">
                    Dengan tap tombol diatas, kamu menerima <span className="underline cursor-pointer">syarat & ketentuan</span> berlaku
                </p>
            </div>
        </div>
    );
}

