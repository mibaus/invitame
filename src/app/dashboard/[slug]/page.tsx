import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { getDashboardData } from '@/app/actions/dashboard';
import { GuestDashboard } from './GuestDashboard';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-10 bg-[#2C3333]/10 rounded-xl w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-[#2C3333]/10 rounded-lg w-48 animate-pulse"></div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="h-4 bg-[#2C3333]/10 rounded-lg w-24 mb-3 animate-pulse"></div>
              <div className="h-10 bg-[#2C3333]/10 rounded-xl w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6">
          <div className="h-64 bg-[#2C3333]/5 rounded-2xl animate-pulse"></div>
        </div>
      </main>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#E7D2CC]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-[#A27B5C]" />
        </div>
        <h1 className="font-serif text-3xl text-[#2C3333] mb-3">Invitación no encontrada</h1>
        <p className="text-[#2C3333]/60 mb-8">{message}</p>
        <Link
          href="/"
          className="inline-flex px-8 py-4 bg-[#2C3333] text-white rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-[#A27B5C] transition-all duration-500 shadow-lg shadow-black/10"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

async function DashboardContent({ slug }: { slug: string }) {
  const result = await getDashboardData(slug);

  if (!result.success || !result.data) {
    return <ErrorState message={result.error || 'No se pudo cargar el dashboard'} />;
  }

  return <GuestDashboard data={result.data} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: `Dashboard - ${slug} | Invita.me`,
    robots: 'noindex, nofollow',
  };
}

export default async function DashboardPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent slug={slug} />
    </Suspense>
  );
}
