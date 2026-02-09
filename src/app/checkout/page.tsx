'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Simular carga de pasarela de pago
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handlePayment = async () => {
        setProcessing(true);
        // Simular procesamiento de pago
        setTimeout(() => {
            // Aquí iría la integración real con Mercado Pago
            // Por ahora redirigimos al onboarding para completar el flujo
            router.push('/onboarding');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden transition-all duration-700">
                {/* Top Accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#A27B5C] via-[#2C3333] to-[#A27B5C]" />

                <div className="p-10 text-center">
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl text-[#2C3333] mb-2">VOWS.</h1>
                        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                            Activa tu experiencia
                        </p>
                    </div>

                    {loading ? (
                        <div className="py-12 flex flex-col items-center gap-6">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-[#E7D2CC] rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-[#A27B5C] rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-[#2C3333]/60 italic font-serif">Conectando con la pasarela de pago...</p>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Concepto</span>
                                    <span className="text-sm text-[#2C3333] font-medium text-right max-w-[180px] leading-relaxed">
                                        Invitación Digital & Gestión de Invitados
                                    </span>
                                </div>
                                <div className="h-px bg-gray-200 my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-[#A27B5C] uppercase tracking-widest font-bold">Total</span>
                                    <span className="text-2xl font-serif text-[#2C3333]">$49.000</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="w-full bg-[#2C3333] text-white py-4 rounded-xl font-bold tracking-premium text-[10px] uppercase hover:bg-[#A27B5C] transition-all duration-500 shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </>
                                    ) : (
                                        'Pagar con Mercado Pago'
                                    )}
                                </button>

                                <p className="text-[10px] text-gray-400">
                                    Serás redirigido a una plataforma segura para completar tu pago.
                                </p>

                                <div className="pt-8">
                                    <Link
                                        href="/onboarding"
                                        className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#2C3333] transition-colors"
                                    >
                                        ← Volver al editor
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex items-center justify-center gap-8 opacity-30 grayscale grayscale-100">
                <div className="text-[10px] font-bold tracking-widest uppercase">SSL Secure</div>
                <div className="text-[10px] font-bold tracking-widest uppercase">Verified</div>
                <div className="text-[10px] font-bold tracking-widest uppercase">Premium Support</div>
            </div>
        </div>
    );
}
