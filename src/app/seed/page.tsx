'use client';

import { useState } from 'react';
import { seedTestWedding, cleanupTestWedding } from '@/app/actions/seed';

export default function SeedPage() {
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    data?: {
      clientId: string;
      invitationId: string;
      slug: string;
      url: string;
      dashboardUrl: string;
    };
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const res = await seedTestWedding();
    setResult(res);
    setLoading(false);
  };

  const handleCleanup = async () => {
    if (!result?.data?.slug) return;
    setLoading(true);
    const res = await cleanupTestWedding(result.data.slug);
    if (res.success) {
      setResult(null);
    } else {
      setResult({ success: false, error: res.error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Generar Datos de Prueba</h1>
        <p className="text-gray-600 mb-6">
          Crea un registro completo de boda en la base de datos con toda la información e imágenes.
        </p>

        {!result?.success && (
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creando...' : 'Crear Boda de Prueba'}
          </button>
        )}

        {result?.success && result.data && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{result.message}</p>
              <p className="text-sm text-green-600 mt-1">Slug: {result.data.slug}</p>
            </div>

            <div className="space-y-2">
              <a
                href={result.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 px-4 bg-gray-900 text-white rounded-lg text-center hover:bg-gray-800 transition-colors"
              >
                Ver Invitación
              </a>
              <a
                href={result.data.dashboardUrl}
                className="block w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg text-center hover:bg-gray-200 transition-colors"
              >
                Ver Dashboard
              </a>
            </div>

            <button
              onClick={handleCleanup}
              disabled={loading}
              className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Eliminando...' : 'Eliminar Datos de Prueba'}
            </button>
          </div>
        )}

        {result?.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {result.error}
          </div>
        )}

        <div className="mt-6 pt-6 border-t text-sm text-gray-500">
          <p className="font-medium mb-2">Datos incluidos:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Cliente con datos completos</li>
            <li>Invitación con skin bolt-dark</li>
            <li>Pareja: María & Carlos</li>
            <li>Fecha: 15 de junio 2026</li>
            <li>6 imágenes de galería</li>
            <li>Ceremonia y recepción con ubicaciones</li>
            <li>Agenda completa (4 eventos)</li>
            <li>Dress code formal</li>
            <li>Datos bancarios y Mercado Libre</li>
            <li>Config RSVP con deadline</li>
            <li>5 RSVPs de ejemplo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
