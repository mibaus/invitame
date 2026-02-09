import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        // Validate environment variable
        if (!process.env.RESEND_API_KEY) {
            console.error('[Welcome Email] RESEND_API_KEY is not configured');
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email service not configured. Please set RESEND_API_KEY environment variable.'
                },
                { status: 500 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { clientEmail, clientName, slug } = body;

        // Validate required fields
        if (!clientEmail || !clientName || !slug) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: clientEmail, clientName, and slug are required.'
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(clientEmail)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email format.'
                },
                { status: 400 }
            );
        }

        console.log('[Welcome Email] Sending to:', clientEmail);

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'VOWS <bienvenidx@vows.digital>', // Replace with your verified domain when available
            to: [clientEmail],
            subject: '¡Bienvenido a VOWS! Tu invitación digital está lista ✨',
            react: WelcomeEmail({ clientName, slug }),
        });

        if (error) {
            console.error('[Welcome Email] Resend error:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: error.message || 'Failed to send email.'
                },
                { status: 500 }
            );
        }

        console.log('[Welcome Email] Successfully sent. Email ID:', data?.id);

        return NextResponse.json(
            {
                success: true,
                emailId: data?.id
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('[Welcome Email] Unexpected error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'An unexpected error occurred.'
            },
            { status: 500 }
        );
    }
}
