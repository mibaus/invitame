'use client';

interface FeaturesSelectorProps {
  features: {
    showHero?: boolean;
    showCountdown?: boolean;
    showAgenda?: boolean;
    showVenueMap?: boolean;
    showDressCode?: boolean;
    showGiftRegistry?: boolean;
    showRSVP?: boolean;
    showGallery?: boolean;
    showMusic?: boolean;
    showGuestMessages?: boolean;
  };
  onChange: (features: Partial<FeaturesSelectorProps['features']>) => void;
}

const FEATURES_CONFIG = [
  { key: 'showHero', label: 'Portada con foto principal', description: 'Muestra la imagen de portada con los nombres', defaultValue: true },
  { key: 'showCountdown', label: 'Cuenta regresiva', description: 'Muestra los días restantes hasta el evento', defaultValue: true },
  { key: 'showAgenda', label: 'Agenda del día', description: 'Muestra la línea de tiempo con los eventos', defaultValue: true },
  { key: 'showVenueMap', label: 'Mapas de ubicación', description: 'Muestra los mapas de ceremonia y recepción', defaultValue: true },
  { key: 'showDressCode', label: 'Código de vestimenta', description: 'Muestra la sección de dress code', defaultValue: true },
  { key: 'showGiftRegistry', label: 'Mesa de regalos', description: 'Muestra la sección de regalos y datos bancarios', defaultValue: true },
  { key: 'showRSVP', label: 'Confirmación de asistencia', description: 'Permite a los invitados confirmar asistencia', defaultValue: true },
  { key: 'showGallery', label: 'Galería de fotos', description: 'Muestra la galería de fotos del evento', defaultValue: true },
  { key: 'showMusic', label: 'Reproductor de música', description: 'Muestra el reproductor de música y playlist', defaultValue: true },
  { key: 'showGuestMessages', label: 'Libro de visitas', description: 'Permite a los invitados dejar mensajes', defaultValue: false },
] as const;

export function FeaturesSelector({ features, onChange }: FeaturesSelectorProps) {
  const toggleFeature = (key: keyof FeaturesSelectorProps['features']) => {
    onChange({ [key]: !features[key] });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {FEATURES_CONFIG.map((feature) => (
          <label
            key={feature.key}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={features[feature.key] ?? feature.defaultValue}
              onChange={() => toggleFeature(feature.key)}
              className="mt-0.5 w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{feature.label}</div>
              <div className="text-sm text-gray-500">{feature.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
