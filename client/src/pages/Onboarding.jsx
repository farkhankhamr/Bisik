import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, User } from 'lucide-react';
import useUserStore from '../store/userStore';

const CITIES = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Medan'];
const OCCUPATIONS = ['Mahasiswa', 'Karyawan', 'Pimpinan', 'Freelance', 'Lainnya'];
const GENDERS = [{ id: 'M', label: 'Pria' }, { id: 'F', label: 'Wanita' }, { id: 'NB', label: 'Non-biner' }];

export default function Onboarding() {
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [selectedGender, setSelectedGender] = useState('');

    const { initUser, setLocation } = useUserStore();
    const navigate = useNavigate();

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation(pos.coords.latitude, pos.coords.longitude);
                    // Auto guess city via API could happen here, keeping manual for MVP
                },
                (err) => console.error(err)
            );
        }
    };

    const handleStart = () => {
        if (!selectedCity) return;
        initUser({
            city: selectedCity,
            institution: null, // Removed institution
            gender: selectedGender || null,
            occupation: selectedOccupation || null
        });
        navigate('/feed');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-brand-600 mb-2">Bisik</h1>
                    <p className="text-slate-500">Tempat ngomong jujur, tanpa nama.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                    {/* Location Request */}
                    <button
                        onClick={handleLocation}
                        className="w-full py-3 border-2 border-dashed border-brand-200 text-brand-600 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-50 transition"
                    >
                        <MapPin size={18} />
                        <span>Aktifkan Lokasi (Untuk filter jarak)</span>
                    </button>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Kota Kamu</label>
                        <div className="grid grid-cols-2 gap-2">
                            {CITIES.map(city => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className={`p-3 rounded-lg text-sm font-medium transition-all ${selectedCity === city
                                        ? 'bg-brand-500 text-white shadow-md'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Gender (Opsional)</label>
                            <select
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                            >
                                <option value="">Rahasia</option>
                                {GENDERS.map(g => (
                                    <option key={g.id} value={g.id}>{g.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Pekerjaan</label>
                            <select
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                value={selectedOccupation}
                                onChange={(e) => setSelectedOccupation(e.target.value)}
                            >
                                <option value="">Pilih...</option>
                                {OCCUPATIONS.map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                    </div>



                    <button
                        onClick={handleStart}
                        disabled={!selectedCity}
                        className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:shadow-none hover:bg-brand-700 transition-all"
                    >
                        Lanjut Sendirian
                    </button>
                </div>
            </div>
        </div>
    );
}
