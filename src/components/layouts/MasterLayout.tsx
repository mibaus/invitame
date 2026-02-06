'use client';

import { InvitationSchema } from '@/types';
import { BoltDarkLayout } from './BoltDarkLayout';
import { AvantGardeLayout } from './AvantGardeLayout';
import { SoftSeraphicLayout } from './SoftSeraphicLayout';
import { CyberpunkLayout } from './CyberpunkLayout';
import { JapandiLayout } from './JapandiLayout';
import { RetroLoveLayout } from './RetroLoveLayout';

interface MasterLayoutProps {
    invitation: InvitationSchema;
    preview?: boolean;
}

export function MasterLayout({ invitation, preview }: MasterLayoutProps) {
    const { skin_id } = invitation.metadata;

    switch (skin_id) {
        case 'avant-garde-editorial':
            return <AvantGardeLayout invitation={invitation} preview={preview} />;
        case 'soft-seraphic':
            return <SoftSeraphicLayout invitation={invitation} preview={preview} />;
        case 'cyberpunk-romance':
            return <CyberpunkLayout invitation={invitation} preview={preview} />;
        case 'japandi-zen':
            return <JapandiLayout invitation={invitation} preview={preview} />;
        case 'retro-love':
            return <RetroLoveLayout invitation={invitation} preview={preview} />;
        case 'bolt-dark':
        default:
            return <BoltDarkLayout invitation={invitation} preview={preview} />;;
    }
}
