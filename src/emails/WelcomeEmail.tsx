import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    clientName: string;
    slug: string;
}

export const WelcomeEmail = ({
    clientName = 'Usuario',
    slug = 'tu-invitacion',
}: WelcomeEmailProps) => {
    const invitationUrl = `https://vows.digital/${slug}`;
    const dashboardUrl = 'https://vows.digital/dashboard';
    const whatsappNumber = '5491127058314';
    const whatsappMessage = encodeURIComponent(
        'Hola! Necesito ayuda con mi invitación digital de VOWS'
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <Html>
            <Head />
            <Preview>Tu invitación digital está lista — VOWS</Preview>
            <Body style={main}>
                <Container style={container}>

                    {/* Elegant Header */}
                    <Section style={header}>
                        <div style={decorativeLine} />
                        <Heading style={logo}>VOWS.</Heading>
                        <div style={decorativeLine} />
                    </Section>

                    {/* Hero Section */}
                    <Section style={hero}>
                        <Heading style={heroHeading}>
                            {clientName},<br />tu momento ha llegado
                        </Heading>
                        <Text style={heroText}>
                            Tu invitación digital está lista para compartir con el mundo.
                        </Text>
                    </Section>

                    {/* Main Content Card */}
                    <Section style={card}>

                        {/* Primary CTA */}
                        <Section style={ctaSection}>
                            <Text style={ctaLabel}>TU INVITACIÓN</Text>
                            <Button style={primaryButton} href={invitationUrl}>
                                Ver invitación →
                            </Button>
                            <Text style={urlText}>vows.digital/{slug}</Text>
                        </Section>

                        <div style={divider} />

                        {/* Dashboard Access */}
                        <Section style={ctaSection}>
                            <Text style={ctaLabel}>PANEL DE GESTIÓN</Text>
                            <Button style={secondaryButton} href={dashboardUrl}>
                                Acceder al Dashboard →
                            </Button>
                            <Text style={instructionText}>
                                Ingresá con el mismo correo que usaste en el onboarding
                            </Text>
                        </Section>

                    </Section>

                    {/* Features List - Simplified */}
                    <Section style={featuresSection}>
                        <Text style={featuresIntro}>
                            Editar evento · Cambiar diseños · Gestionar RSVPs · Actualizar multimedia
                        </Text>
                    </Section>

                    {/* Support Section */}
                    <Section style={supportSection}>
                        <Text style={supportTitle}>¿Necesitás ayuda?</Text>
                        <Text style={supportText}>
                            Contactanos por WhatsApp
                        </Text>
                        <Button style={whatsappButton} href={whatsappUrl}>
                            <span style={whatsappIcon}>💬</span> +54 9 11 2705-8314
                        </Button>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Hr style={footerDivider} />
                        <Text style={footerText}>
                            Con amor,
                        </Text>
                        <Text style={footerBrand}>VOWS.</Text>
                        <Text style={footerCopy}>
                            © 2026 VOWS — Digital Invitations
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

// ========== STYLES ==========

const main = {
    backgroundColor: '#ffffff',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '48px 20px',
    maxWidth: '600px',
};

// Header
const header = {
    textAlign: 'center' as const,
    paddingBottom: '48px',
};

const decorativeLine = {
    width: '60px',
    height: '1px',
    backgroundColor: '#A27B5C',
    margin: '0 auto 16px',
};

const logo = {
    fontSize: '32px',
    fontWeight: '300',
    color: '#2C3333',
    margin: '0',
    letterSpacing: '4px',
    fontFamily: 'Georgia, serif',
};

// Hero
const hero = {
    textAlign: 'center' as const,
    paddingBottom: '40px',
};

const heroHeading = {
    fontSize: '36px',
    fontWeight: '300',
    color: '#2C3333',
    margin: '0 0 16px 0',
    lineHeight: '1.2',
    fontFamily: 'Georgia, serif',
};

const heroText = {
    fontSize: '16px',
    fontWeight: '400',
    color: '#6B6B6B',
    margin: '0',
    lineHeight: '1.5',
};

// Main Card
const card = {
    backgroundColor: '#FAFAF9',
    borderRadius: '4px',
    padding: '48px 40px',
    border: '1px solid #E5E5E5',
};

const ctaSection = {
    textAlign: 'center' as const,
    marginBottom: '0',
};

const ctaLabel = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#A27B5C',
    letterSpacing: '2px',
    margin: '0 0 16px 0',
    textTransform: 'uppercase' as const,
};

const primaryButton = {
    backgroundColor: '#2C3333',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 36px',
    borderRadius: '2px',
    letterSpacing: '0.5px',
};

const secondaryButton = {
    backgroundColor: '#FFFFFF',
    color: '#2C3333',
    fontSize: '15px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 36px',
    borderRadius: '2px',
    border: '1px solid #2C3333',
    letterSpacing: '0.5px',
};

const urlText = {
    fontSize: '13px',
    color: '#A27B5C',
    margin: '12px 0 0 0',
    fontFamily: 'monospace',
};

const instructionText = {
    fontSize: '13px',
    color: '#6B6B6B',
    margin: '12px 0 0 0',
    lineHeight: '1.4',
};

const divider = {
    width: '100%',
    height: '1px',
    backgroundColor: '#E5E5E5',
    margin: '40px 0',
};

// Features
const featuresSection = {
    paddingTop: '32px',
    paddingBottom: '32px',
    textAlign: 'center' as const,
    borderTop: '1px solid #F0F0F0',
    borderBottom: '1px solid #F0F0F0',
};

const featuresIntro = {
    fontSize: '13px',
    color: '#A0A0A0',
    margin: '0',
    lineHeight: '1.8',
    letterSpacing: '0.3px',
};

// Support
const supportSection = {
    textAlign: 'center' as const,
    paddingTop: '48px',
};

const supportTitle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C3333',
    margin: '0 0 8px 0',
};

const supportText = {
    fontSize: '14px',
    color: '#6B6B6B',
    margin: '0 0 20px 0',
};

const whatsappButton = {
    backgroundColor: '#25D366',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 28px',
    borderRadius: '24px',
    letterSpacing: '0.3px',
};

const whatsappIcon = {
    marginRight: '6px',
};

// Footer
const footer = {
    textAlign: 'center' as const,
    paddingTop: '48px',
};

const footerDivider = {
    borderColor: '#E5E5E5',
    margin: '0 0 32px 0',
};

const footerText = {
    fontSize: '14px',
    color: '#6B6B6B',
    margin: '0 0 4px 0',
};

const footerBrand = {
    fontSize: '18px',
    fontWeight: '300',
    color: '#2C3333',
    margin: '0 0 16px 0',
    letterSpacing: '3px',
    fontFamily: 'Georgia, serif',
};

const footerCopy = {
    fontSize: '12px',
    color: '#A0A0A0',
    margin: '0',
};
