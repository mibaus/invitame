import AdminClient from './AdminClient';
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAIL } from "@/lib/auth-config";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect('/login-admin');
  }

  return <AdminClient />;
}
