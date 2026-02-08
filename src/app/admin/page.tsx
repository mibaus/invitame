import { SessionProvider } from 'next-auth/react';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <SessionProvider>
      <AdminClient />
    </SessionProvider>
  );
}
