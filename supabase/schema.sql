-- =============================================
-- INVITA.ME - Schema de Base de Datos
-- Pilar de Persistencia con Supabase
-- =============================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

-- Tier de servicio
CREATE TYPE service_tier AS ENUM ('essential', 'pro', 'premium');

-- Tipo de evento
CREATE TYPE event_type AS ENUM ('wedding', 'quinceañera', 'birthday', 'baby_shower', 'corporate', 'other');

-- Estado de RSVP
CREATE TYPE rsvp_status AS ENUM ('pending', 'confirmed', 'declined', 'maybe');

-- =============================================
-- TABLA: profiles
-- Usuarios/clientes de la plataforma (autenticados)
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda por email
CREATE INDEX idx_profiles_email ON profiles(email);

-- =============================================
-- TABLA: clients
-- Clientes de onboarding (sin autenticación requerida)
-- =============================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tier_purchased service_tier NOT NULL DEFAULT 'essential',
  
  -- Referencia opcional a profile si el cliente se registra después
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Estado del onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_tier ON clients(tier_purchased);

-- =============================================
-- TABLA: invitations
-- Invitaciones digitales
-- =============================================

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relación con el cliente/propietario (puede ser profile o client de onboarding)
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  onboarding_client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Identificador público único (URL-friendly)
  slug TEXT UNIQUE NOT NULL,
  
  -- Configuración del tier y skin
  tier service_tier NOT NULL DEFAULT 'essential',
  skin_id TEXT NOT NULL DEFAULT 'classic-elegance',
  event_type event_type NOT NULL DEFAULT 'wedding',
  
  -- Contenido completo de la invitación (JSONB)
  -- Incluye: headline, subtitle, main_message, couple, hosts, 
  -- cover_image, gallery_images, quote, logistics, features, skin_config
  content JSONB NOT NULL DEFAULT '{}',
  
  -- Estado y fechas
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  
  -- Metadatos
  language TEXT DEFAULT 'es',
  views_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas comunes
CREATE INDEX idx_invitations_slug ON invitations(slug);
CREATE INDEX idx_invitations_client ON invitations(client_id);
CREATE INDEX idx_invitations_active ON invitations(is_active) WHERE is_active = TRUE;

-- =============================================
-- TABLA: rsvps
-- Confirmaciones de asistencia
-- =============================================

CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relación con la invitación
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  
  -- Datos del invitado
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Confirmación
  status rsvp_status DEFAULT 'pending',
  attendance BOOLEAN,
  guests_count INTEGER DEFAULT 1,
  
  -- Datos adicionales (Pro/Premium)
  dietary_restrictions TEXT,
  menu_notes TEXT,
  music_suggestion TEXT,
  custom_answers JSONB DEFAULT '{}',
  
  -- Mensaje personal
  message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_rsvps_invitation ON rsvps(invitation_id);
CREATE INDEX idx_rsvps_status ON rsvps(status);

-- =============================================
-- TABLA: guestbook_entries
-- Libro de visitas (Premium)
-- =============================================

CREATE TABLE guestbook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  
  is_approved BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guestbook_invitation ON guestbook_entries(invitation_id);

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_rsvps_updated_at
  BEFORE UPDATE ON rsvps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Función para incrementar contador de vistas
CREATE OR REPLACE FUNCTION increment_invitation_views(invitation_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE invitations 
  SET views_count = views_count + 1 
  WHERE slug = invitation_slug;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS DE SEGURIDAD: profiles
-- =============================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- POLÍTICAS DE SEGURIDAD: clients
-- =============================================

-- Permitir inserción desde onboarding (sin autenticación)
CREATE POLICY "Anyone can create client during onboarding"
  ON clients FOR INSERT
  WITH CHECK (TRUE);

-- Clientes vinculados a un profile pueden ser vistos por ese usuario
CREATE POLICY "Linked users can view their client record"
  ON clients FOR SELECT
  USING (auth.uid() = profile_id);

-- =============================================
-- POLÍTICAS DE SEGURIDAD: invitations
-- =============================================

-- Cualquiera puede leer invitaciones activas (público)
CREATE POLICY "Public can read active invitations"
  ON invitations FOR SELECT
  USING (is_active = TRUE);

-- Los propietarios pueden ver todas sus invitaciones
CREATE POLICY "Owners can view own invitations"
  ON invitations FOR SELECT
  USING (auth.uid() = client_id);

-- Los propietarios pueden crear invitaciones
CREATE POLICY "Owners can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Los propietarios pueden actualizar sus invitaciones
CREATE POLICY "Owners can update own invitations"
  ON invitations FOR UPDATE
  USING (auth.uid() = client_id);

-- Los propietarios pueden eliminar sus invitaciones
CREATE POLICY "Owners can delete own invitations"
  ON invitations FOR DELETE
  USING (auth.uid() = client_id);

-- =============================================
-- POLÍTICAS DE SEGURIDAD: rsvps
-- =============================================

-- Cualquiera puede crear RSVPs (invitados confirman asistencia)
CREATE POLICY "Anyone can create rsvp"
  ON rsvps FOR INSERT
  WITH CHECK (TRUE);

-- Los propietarios de la invitación pueden ver los RSVPs
CREATE POLICY "Invitation owners can view rsvps"
  ON rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invitations 
      WHERE invitations.id = rsvps.invitation_id 
      AND invitations.client_id = auth.uid()
    )
  );

-- Permitir lectura pública de RSVPs para mostrar contador
CREATE POLICY "Public can read rsvp count"
  ON rsvps FOR SELECT
  USING (TRUE);

-- =============================================
-- POLÍTICAS DE SEGURIDAD: guestbook_entries
-- =============================================

-- Cualquiera puede crear entradas en el guestbook
CREATE POLICY "Anyone can create guestbook entry"
  ON guestbook_entries FOR INSERT
  WITH CHECK (TRUE);

-- Cualquiera puede ver entradas aprobadas
CREATE POLICY "Public can read approved entries"
  ON guestbook_entries FOR SELECT
  USING (is_approved = TRUE);

-- Los propietarios pueden ver todas las entradas de sus invitaciones
CREATE POLICY "Owners can view all entries"
  ON guestbook_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invitations 
      WHERE invitations.id = guestbook_entries.invitation_id 
      AND invitations.client_id = auth.uid()
    )
  );

-- Los propietarios pueden actualizar (aprobar/rechazar) entradas
CREATE POLICY "Owners can update entries"
  ON guestbook_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM invitations 
      WHERE invitations.id = guestbook_entries.invitation_id 
      AND invitations.client_id = auth.uid()
    )
  );

-- =============================================
-- DATOS DE EJEMPLO (Opcional - para testing)
-- =============================================

-- Insertar invitación de ejemplo
-- INSERT INTO invitations (slug, tier, skin_id, event_type, content, is_active)
-- VALUES (
--   'demo-boda',
--   'premium',
--   'celestial-noir',
--   'wedding',
--   '{"headline": "Demo Wedding", "subtitle": "Nos casamos"}',
--   TRUE
-- );
