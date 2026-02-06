import { OnboardingWizard } from './OnboardingWizard';

export default async function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <OnboardingWizard />
    </main>
  );
}
