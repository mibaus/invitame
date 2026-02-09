import AdminClient from './AdminClient';
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAIL } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { getPendingInvitations } from "@/app/actions/admin";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect('/login-admin');
  }

  const { data: invitations, error } = await getPendingInvitations();

  if (error) {
    console.error("Error fetching invitations:", error);
    // Podemos manejar el error en el cliente o mostrar un mensaje básico aquí
  }

  return <AdminClient invitations={invitations || []} />;
}
