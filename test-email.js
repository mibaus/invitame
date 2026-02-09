// Test script para verificar que Resend funciona
// Ejecutar: node test-email.js

require('dotenv').config({ path: '.env.local' });

async function testEmail() {
    console.log('🔍 Verificando configuración...\n');

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error('❌ RESEND_API_KEY no encontrada en .env.local');
        process.exit(1);
    }

    if (apiKey === 'your_resend_api_key_here') {
        console.error('❌ RESEND_API_KEY aún tiene el valor placeholder');
        console.log('   Por favor reemplazá el valor en .env.local con tu API key real');
        process.exit(1);
    }

    console.log('✅ RESEND_API_KEY configurada:', apiKey.substring(0, 10) + '...');

    console.log('\n📧 Enviando email de prueba...\n');

    try {
        const response = await fetch('http://localhost:3000/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientEmail: 'mi.baus.g@gmail.com', // CAMBIAR POR TU EMAIL
                clientName: 'Prueba Test',
                slug: 'test-invitation'
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Email enviado exitosamente!');
            console.log('   ID:', result.emailId);
            console.log('\n📬 Revisá tu bandeja de entrada en unos segundos.');
        } else {
            console.error('❌ Error al enviar email:', result.error);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.log('\n💡 Asegurate de que el servidor esté corriendo (npm run dev)');
    }
}

testEmail();
