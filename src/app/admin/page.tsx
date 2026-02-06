import { Suspense } from 'react';
import Link from 'next/link';
import { getPendingInvitations } from '@/app/actions/admin';
import { AdminDashboard } from './AdminDashboard';

export const dynamic = 'force-dynamic';

async function InvitationsList() {
  const result = await getPendingInvitations();
  
  if (!result.success) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Error: {result.error}
      </div>
    );
  }

  return <AdminDashboard invitations={result.data || []} />;
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                INVITA<span className="text-amber-500">.ME</span>
              </Link>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                Admin
              </span>
            </div>
            <Link 
              href="/onboarding?tier=premium"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              + Nueva invitación
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Invitaciones</h1>
          <p className="text-gray-600 mt-1">Gestiona las invitaciones creadas desde el formulario de onboarding</p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }>
          <InvitationsList />
        </Suspense>
      </main>
    </div>
  );
}
