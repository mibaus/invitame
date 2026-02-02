import { redirect } from 'next/navigation';
import { validateTier } from '@/app/actions/onboarding';
import { OnboardingWizard } from './OnboardingWizard';

interface PageProps {
  searchParams: Promise<{ tier?: string }>;
}

export default async function OnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tier = await validateTier(params.tier || null);

  if (!tier) {
    redirect('/?error=invalid_tier');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <OnboardingWizard tier={tier} />
    </main>
  );
}
