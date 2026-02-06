'use client';

/**
 * FeatureGate - Control de visibilidad para el modelo Single Price
 * 
 * Reemplaza al antiguo TierGate. En lugar de verificar niveles de servicio,
 * verifica dos condiciones:
 * 1. El flag de visibilidad está activo (ej. show_gallery: true)
 * 2. Hay datos válidos para mostrar (ej. gallery_images.length > 0)
 */

interface FeatureGateProps {
    /**
     * Nombre de la feature para logs o debugging
     */
    featureName?: string;

    /**
     * Flag de visibilidad configurado por el usuario
     */
    isVisible: boolean;

    /**
     * Datos requeridos para el renderizado.
     * Si es un array, verifica length > 0.
     * Si es objeto/string, verifica que no sea nulo/undefined.
     */
    data?: any;

    /**
     * Contenido a renderizar si se cumplen las condiciones
     */
    children: React.ReactNode;

    /**
     * Componente opcional para renderizar si no se cumplen las condiciones
     * (Útil para previews donde queremos mostrar placeholder)
     */
    fallback?: React.ReactNode;
}

export function FeatureGate({
    featureName,
    isVisible,
    data,
    children,
    fallback = null
}: FeatureGateProps) {
    // 1. Si el usuario lo desactivó explícitamente -> No mostrar
    if (!isVisible) {
        return null;
    }

    // 2. Validación de datos (Data Integrity)
    let hasData = true;

    if (data !== undefined) {
        if (Array.isArray(data)) {
            hasData = data.length > 0;
        } else if (typeof data === 'object' && data !== null) {
            // Si es un objeto, asumimos que tiene datos si no es null
            // Casos específicos podrían requerir validación más profunda
            hasData = Object.keys(data).length > 0;
        } else if (typeof data === 'string') {
            hasData = data.trim().length > 0;
        } else {
            hasData = !!data;
        }
    }

    if (!hasData) {
        // Si la feature está activa pero no hay datos -> Mostrar fallback (si existe)
        // En producción, fallback suele ser null, así que no se muestra nada.
        return <>{fallback}</>;
    }

    // 3. Todo OK -> Renderizar
    return <>{children}</>;
}
