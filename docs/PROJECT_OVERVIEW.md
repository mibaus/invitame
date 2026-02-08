# 📚 INVITAME - Documentación del Proyecto

> **Propósito**: Guía completa del modelo Single Price con visibilidad basada en flags.

---

## I. VISIÓN GENERAL

**invitame** es una plataforma de invitaciones digitales elegantes para bodas y eventos. Modelo Single Price: todas las funcionalidades disponibles para todos los usuarios, controladas por feature flags.

### Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.3 |
| Database | Supabase (PostgreSQL) | SSR 0.8.0 |
| Estilos | Tailwind CSS | 4.x |
| Animaciones | Framer Motion | 12.30.0 |
| Iconos | Lucide React | - |
| Lenguaje | TypeScript | 5.x |

---

## II. ESTRUCTURA DEL PROYECTO

```
invitame/
├── docs/
│   ├── DESIGN_BIBLE.md
│   ├── UX_BIBLE.md
│   └── PROJECT_OVERVIEW.md    # Este archivo
├── public/
├── src/
│   ├── app/
│   │   ├── [slug]/            # Invitaciones públicas
│   │   ├── actions/           # Server Actions
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── onboarding/        # Wizard de creación
│   │   └── preview/           # Vista previa de skins
│   ├── components/
│   │   ├── engine/            # Motor de renderizado
│   │   ├── layouts/           # MasterLayout (único)
│   │   └── shared/            # Componentes compartidos
│   ├── data/                  # Mock data
│   ├── hooks/
│   ├── lib/
│   └── types/                 # TypeScript definitions
├── supabase/
│   └── schema.sql
└── package.json
```

---

## III. MODELO DE NEGOCIO: SINGLE PRICE

### Concepto

- **Un único precio** para todos los usuarios
- **Todas las funcionalidades** disponibles sin restricciones de tier
- **4 skins** estandarizados: `classic-standard`, `modern-dark`, `soft-floral`, `scandi-boho`, `botanical-greenhouse`
- **Visibilidad** controlada por flags booleanos y presencia de datos

### Skins Disponibles

| Skin | Estilo | Paleta |
|------|--------|--------|
| `classic-standard` | Elegancia atemporal | Dorado, crema, carbón |
| `modern-dark` | Minimalismo dramático | Negro, dorado, blanco |
| `soft-floral` | Romance orgánico | Rosa polvo, verde salvia, marfil |
| `scandi-boho` | Organic Minimalist | Nude, Terracota, Lino, Arena, Eucalipto |
| `botanical-greenhouse` | Herbario científico del siglo XVIII | Papel envejecido, verde musgo, sepia, marfil |

### Límites Estándar

| Recurso | Límite |
|---------|--------|
| Fotos en galería | 15 |
| Acompañantes RSVP | Configurable por evento |
| Skins por invitación | 1 (seleccionable) |

---

## IV. SISTEMA DE VISIBILIDAD

### FeatureGate Component

La visibilidad se controla mediante el componente `FeatureGate`:

```tsx
<FeatureGate 
  isVisible={features.show_gallery} 
  data={content.gallery_images}
  fallback={preview ? <EmptyStatePreview /> : null}
>
  <PhotoGallery images={content.gallery_images} />
</FeatureGate>
```

### Flags de Visibilidad

| Flag | Controla |
|------|----------|
| `show_countdown` | Cuenta regresiva |
| `show_agenda` | Timeline del evento |
| `show_venue_map` | Ubicaciones con mapa |
| `show_gallery` | Galería de fotos |
| `show_dress_code` | Código de vestimenta |
| `show_gift_registry` | Mesa de regalos |
| `show_rsvp` | Formulario de confirmación |
| `show_music` | Música de fondo |

---

## IV-A. ARQUITECTURA DE DATOS

### Tablas Principales

```
profiles
├── id (uuid)
├── email
└── full_name

invitations
├── id (uuid)
├── slug (unique)
├── skin_id
├── event_type
├── content (jsonb)
├── logistics (jsonb)
├── features (jsonb)
└── is_active

rsvps
├── id
├── invitation_id (fk)
├── name
├── email
├── attendance (boolean)
├── guests_count
└── dietary_restrictions
```

### Tipos Eliminados

- ❌ `service_tier` - Ya no existe
- ❌ `tier` en invitations - Reemplazado por feature flags

---

## V. SECCIONES DE LA INVITACIÓN

### Orden Fijo por Skin

```typescript
const SKIN_ORDER: Record<SkinId, string[]> = {
  'classic-standard': ['hero', 'quote', 'countdown', 'agenda', 'venues', 'gallery', 'dress_code', 'gift_registry', 'rsvp'],
  'modern-dark': ['hero', 'countdown', 'gallery', 'agenda', 'venues', 'dress_code', 'gift_registry', 'rsvp'],
  'soft-floral': ['hero', 'quote', 'agenda', 'gallery', 'venues', 'dress_code', 'gift_registry', 'rsvp'],
  'botanical-greenhouse': ['hero', 'countdown', 'quote', 'agenda', 'venues', 'dress_code', 'gallery', 'gift_registry', 'rsvp']
};
```

### Las 11 Secciones

1. **Hero** - Foto a pantalla completa, nombres, fecha, scroll button
2. **Countdown** - Cuenta regresiva dinámica (días, horas, minutos, segundos)
3. **Quote** - Frase o historia de la pareja (espaciado editorial)
4. **Timeline** - Agenda del evento con íconos minimalistas
5. **Ubicaciones** - Tarjetas con mapa, botones "Cómo llegar" y "Agendar"
6. **Dress Code** - Código de vestimenta con íconos ilustrativos
7. **Galería** - Layout Masonry con 4-15 fotos
8. **Regalos** - CBU con copiar + Mercado Libre destacado
9. **RSVP** - Formulario completo + opción WhatsApp
10. **Spotify** - Playlist embebida en footer
11. **Footer** - Frase de cierre + nota de privacidad

---

## VI. COMPONENTES CLAVE

### MasterLayout

Layout único que orquesta todas las secciones:

```tsx
export function MasterLayout({ invitation, preview }) {
  const { metadata, content, logistics, features } = invitation;
  const { theme } = useTheme(metadata.skin_id);
  const order = SKIN_ORDER[metadata.skin_id];
  
  return (
    <main>
      {order.map(sectionId => renderSection(sectionId))}
    </main>
  );
}
```

### Componentes Compartidos

| Componente | Función |
|------------|---------|
| `CountdownDisplay` | Cuenta regresiva con estilos minimalistas |
| `AgendaTimeline` | Timeline vertical con íconos |
| `VenueDisplay` | Tarjetas de ubicación + botón .ics |
| `PhotoGallery` | Masonry grid con lightbox |
| `GiftSection` | CBU copiable + Mercado Libre |
| `RSVPManager` | Formulario + WhatsApp pre-armado |
| `MusicPlayer` | Reproductor global |
| `FeatureGate` | Control de visibilidad |
| `EmptyStatePreview` | Estados vacíos en modo preview |

---

## VII. RUTAS

| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/[slug]` | Invitación pública |
| `/onboarding` | Wizard de creación |
| `/preview/[skin]` | Preview de skins |
| `/admin` | Administración |
| `/dashboard` | Panel de usuario |

---

## VIII. SERVER ACTIONS

| Archivo | Funciones |
|---------|-----------|
| `onboarding.ts` | Crear cliente e invitación |
| `rsvp.ts` | Guardar confirmaciones |
| `dashboard.ts` | CRUD de invitaciones |
| `storage.ts` | Subida de imágenes |

---

## IX. ANIMACIONES

### Fade-in Global

Todas las secciones usan `framer-motion`:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
  {children}
</motion.div>
```

### Hero Scroll Button

```tsx
<motion.button
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  Descubrir más
</motion.button>
```

---

## X. CONVENCIONES

1. **Single Price** - Sin lógica de tiers
2. **Feature Flags** - Visibilidad por `show_*` flags
3. **MasterLayout** - Único layout para todos los skins
4. **Empty States** - Fallbacks elegantes en preview mode
5. **Smooth Scroll** - Navegación fluida entre secciones

---

## XI. COMANDOS

```bash
npm run dev      # localhost:3000
npm run build    # Build producción
npm run lint     # ESLint
```

---

## XII. DOCUMENTOS RELACIONADOS

| Documento | Contenido |
|-----------|-----------|
| [`DESIGN_BIBLE.md`](./DESIGN_BIBLE.md) | Paletas, tipografía, estilos |
| [`UX_BIBLE.md`](./UX_BIBLE.md) | UX, micro-interacciones |

---

## XIII. FLUJO DE TRABAJO

### Crear Invitación

1. Usuario ingresa a `/onboarding`
2. Selecciona skin (`classic-standard`, `modern-dark`, `soft-floral`, `scandi-boho`, `botanical-greenhouse`)
3. Completa datos del evento
4. Server Action crea invitación en Supabase
5. Disponible en `/{slug}`

### Ver Invitación

1. Request a `/[slug]`
2. `MasterLayout` renderiza secciones en orden fijo
3. `FeatureGate` controla visibilidad por flags
4. Fade-in animations en scroll

---

*Versión: 2.0 - Single Price | Febrero 2026*
