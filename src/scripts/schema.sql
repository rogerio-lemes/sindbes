-- ============================================================
-- Schema multi-tenant — Plataforma de Sites de Sindicatos
-- Aplicar uma única vez no Supabase (SQL Editor → Run)
-- NÃO altera/apaga as tabelas antigas sindibes_sindicato_da_bel_*
-- ============================================================

-- =========================
-- 1. TABELA PRINCIPAL DE TENANTS
-- =========================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,          -- ex: 'sindibes', 'sindbarbearia'
  nome TEXT NOT NULL,                 -- ex: 'Sindibes - Sindicato da Beleza'
  status TEXT NOT NULL DEFAULT 'ativo', -- ativo | suspenso | cancelado
  plano TEXT DEFAULT 'basico',        -- basico | profissional | premium
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 2. DOMÍNIOS (host → tenant)
-- =========================
CREATE TABLE IF NOT EXISTS dominios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  host TEXT UNIQUE NOT NULL,          -- ex: 'sindibes.plataforma.com.br' ou 'sindibes.com.br'
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dominios_host ON dominios(host);
CREATE INDEX IF NOT EXISTS idx_dominios_tenant ON dominios(tenant_id);

-- =========================
-- 3. CONFIGURAÇÃO POR TENANT
-- =========================
CREATE TABLE IF NOT EXISTS tenant_config (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tagline TEXT,
  whatsapp TEXT,                      -- ex: '5534984468553'
  whatsapp_display TEXT,              -- ex: '(34) 98446-8553'
  phone TEXT,
  email TEXT,
  endereco TEXT,
  cidade TEXT,
  uf TEXT DEFAULT 'MG',
  instagram TEXT,
  cnpj TEXT,
  horario TEXT,
  google_maps_url TEXT,
  lat NUMERIC,
  lng NUMERIC,
  -- Paleta de cores
  cor_primaria TEXT DEFAULT '#2E9E8D',
  cor_primaria_dark TEXT DEFAULT '#1E6E62',
  cor_secundaria TEXT DEFAULT '#6E5A97',
  cor_secundaria_dark TEXT DEFAULT '#52406F',
  cor_accent TEXT DEFAULT '#DCEFEC',
  cor_text TEXT DEFAULT '#1B2444',
  cor_bg_alt TEXT DEFAULT '#F8FBFA',
  -- Marca
  logo_url TEXT,                      -- URL do Storage (bucket tenants/)
  favicon_url TEXT,
  -- Meta SEO (flexível)
  meta JSONB DEFAULT '{}',            -- { seoTitle, seoDescription, ogImage, ... }
  -- Atendente virtual
  atendente_nome TEXT DEFAULT 'Wagner',
  atendente_foto_url TEXT,
  --
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 4. PERFIS DE USUÁRIO (auth → tenant + papel)
-- =========================
CREATE TABLE IF NOT EXISTS perfis (
  user_id UUID PRIMARY KEY,           -- = auth.uid()
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  papel TEXT NOT NULL DEFAULT 'admin_tenant', -- super_admin | admin_tenant
  nome TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_perfis_tenant ON perfis(tenant_id);

-- =========================
-- 5. SERVIÇOS
-- =========================
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  descricao TEXT,
  imagem_url TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_servicos_tenant ON servicos(tenant_id);

-- =========================
-- 6. ASSOCIADOS (filiados)
-- =========================
CREATE TABLE IF NOT EXISTS associados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  categoria TEXT,
  descricao TEXT,
  endereco TEXT,
  cidade TEXT,
  bairro TEXT,
  whatsapp TEXT,
  telefone TEXT,
  email TEXT,
  instagram TEXT,
  site_url TEXT,
  horario TEXT,
  google_maps_url TEXT,
  foto_capa_url TEXT,
  fotos JSONB DEFAULT '[]',           -- array de URLs
  destaque BOOLEAN DEFAULT FALSE,
  novo BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_associados_tenant ON associados(tenant_id);

-- =========================
-- 7. EVENTOS
-- =========================
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  horario TEXT,
  local_nome TEXT,
  local_endereco TEXT,
  tipo TEXT DEFAULT 'presencial',      -- presencial | online | hibrido
  imagem_url TEXT,
  galeria JSONB DEFAULT '[]',
  inscricao_aberta BOOLEAN DEFAULT TRUE,
  max_participantes INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_eventos_tenant ON eventos(tenant_id);

-- =========================
-- 8. PARCEIROS
-- =========================
CREATE TABLE IF NOT EXISTS parceiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT,
  logo_url TEXT,
  foto_capa_url TEXT,
  site_url TEXT,
  whatsapp TEXT,
  telefone TEXT,
  email TEXT,
  instagram TEXT,
  beneficio_associados TEXT,
  destaque BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_parceiros_tenant ON parceiros(tenant_id);

-- =========================
-- 9. DIRETORIA
-- =========================
CREATE TABLE IF NOT EXISTS diretoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  grupo TEXT DEFAULT 'executiva',      -- executiva | conselho_fiscal | suplentes
  foto_url TEXT,
  ordem INT DEFAULT 0,
  gestao TEXT DEFAULT '2026-2028',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_diretoria_tenant ON diretoria(tenant_id);

-- =========================
-- 10. LEADS (captura pública)
-- =========================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT,
  telefone TEXT,
  email TEXT,
  mensagem TEXT,
  origem TEXT,                        -- 'contato', 'exit-popup', 'mobile-bar', 'rsvp', 'newsletter'
  pagina_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- =========================
-- 11. CURRÍCULOS
-- =========================
CREATE TABLE IF NOT EXISTS curriculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  cidade TEXT,
  funcao TEXT,
  experiencia TEXT,
  disponibilidade TEXT,
  sobre TEXT,
  portfolio TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_curriculos_tenant ON curriculos(tenant_id);

-- =========================
-- 12. VAGAS
-- =========================
CREATE TABLE IF NOT EXISTS vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  funcao TEXT,
  empresa TEXT,
  tipo TEXT,                          -- CLT, PJ, Parceria, Freelancer
  local_vaga TEXT,
  salario TEXT,
  contato TEXT,
  descricao TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vagas_tenant ON vagas(tenant_id);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE dominios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE associados ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE diretoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Função helper: retorna o perfil do usuário autenticado
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION current_perfil()
RETURNS TABLE(user_id UUID, tenant_id UUID, papel TEXT) AS $$
  SELECT p.user_id, p.tenant_id, p.papel
  FROM perfis p
  WHERE p.user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funções de conveniência
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfis
    WHERE user_id = auth.uid() AND papel = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_tenant_admin(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfis
    WHERE user_id = auth.uid()
      AND (papel = 'super_admin' OR (papel = 'admin_tenant' AND tenant_id = check_tenant_id))
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -------------------------------------------------------
-- Policies: TENANTS
-- -------------------------------------------------------
CREATE POLICY "Leitura pública tenants" ON tenants
  FOR SELECT USING (status = 'ativo');

CREATE POLICY "Super admin gerencia tenants" ON tenants
  FOR ALL USING (is_super_admin());

-- -------------------------------------------------------
-- Policies: DOMINIOS
-- -------------------------------------------------------
CREATE POLICY "Leitura pública domínios" ON dominios
  FOR SELECT USING (true);

CREATE POLICY "Super admin gerencia domínios" ON dominios
  FOR ALL USING (is_super_admin());

-- -------------------------------------------------------
-- Policies: TENANT_CONFIG
-- -------------------------------------------------------
CREATE POLICY "Leitura pública config" ON tenant_config
  FOR SELECT USING (true);

CREATE POLICY "Admin do tenant edita config" ON tenant_config
  FOR UPDATE USING (is_tenant_admin(tenant_id));

CREATE POLICY "Super admin gerencia config" ON tenant_config
  FOR ALL USING (is_super_admin());

-- -------------------------------------------------------
-- Policies: PERFIS
-- -------------------------------------------------------
CREATE POLICY "Usuário lê próprio perfil" ON perfis
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admin gerencia perfis" ON perfis
  FOR ALL USING (is_super_admin());

-- -------------------------------------------------------
-- Policies: SERVIÇOS (leitura pública, escrita do admin)
-- -------------------------------------------------------
CREATE POLICY "Leitura pública serviços" ON servicos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admin do tenant edita serviços" ON servicos
  FOR ALL USING (is_tenant_admin(tenant_id));

-- -------------------------------------------------------
-- Policies: ASSOCIADOS
-- -------------------------------------------------------
CREATE POLICY "Leitura pública associados" ON associados
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admin do tenant edita associados" ON associados
  FOR ALL USING (is_tenant_admin(tenant_id));

-- -------------------------------------------------------
-- Policies: EVENTOS
-- -------------------------------------------------------
CREATE POLICY "Leitura pública eventos" ON eventos
  FOR SELECT USING (true);

CREATE POLICY "Admin do tenant edita eventos" ON eventos
  FOR ALL USING (is_tenant_admin(tenant_id));

-- -------------------------------------------------------
-- Policies: PARCEIROS
-- -------------------------------------------------------
CREATE POLICY "Leitura pública parceiros" ON parceiros
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admin do tenant edita parceiros" ON parceiros
  FOR ALL USING (is_tenant_admin(tenant_id));

-- -------------------------------------------------------
-- Policies: DIRETORIA
-- -------------------------------------------------------
CREATE POLICY "Leitura pública diretoria" ON diretoria
  FOR SELECT USING (true);

CREATE POLICY "Admin do tenant edita diretoria" ON diretoria
  FOR ALL USING (is_tenant_admin(tenant_id));

-- -------------------------------------------------------
-- Policies: LEADS (insert público, leitura do admin)
-- -------------------------------------------------------
CREATE POLICY "Insert público leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin do tenant lê leads" ON leads
  FOR SELECT USING (is_tenant_admin(tenant_id));

CREATE POLICY "Super admin gerencia leads" ON leads
  FOR ALL USING (is_super_admin());

-- -------------------------------------------------------
-- Policies: CURRÍCULOS (insert público, leitura do admin)
-- -------------------------------------------------------
CREATE POLICY "Insert público currículos" ON curriculos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin do tenant lê currículos" ON curriculos
  FOR SELECT USING (is_tenant_admin(tenant_id));

-- -------------------------------------------------------
-- Policies: VAGAS (insert público, leitura/escrita do admin)
-- -------------------------------------------------------
CREATE POLICY "Insert público vagas" ON vagas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura pública vagas ativas" ON vagas
  FOR SELECT USING (ativa = true);

CREATE POLICY "Admin do tenant gerencia vagas" ON vagas
  FOR ALL USING (is_tenant_admin(tenant_id));

-- ============================================================
-- Storage bucket (executar via Supabase Dashboard → Storage)
-- ============================================================
-- Criar bucket 'tenants' com acesso público de leitura.
-- Estrutura: tenants/{tenant_id}/logo.png, favicon.png, fotos/...
-- Policy de upload: apenas usuários autenticados do tenant.

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================
