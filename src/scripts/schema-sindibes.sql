-- ============================================================
-- Sindibes em schema próprio ("sindibes")
-- O projeto Supabase é compartilhado com outro sistema: nada aqui toca as
-- tabelas do schema public. Pode rodar mais de uma vez sem erro.
-- Depois de rodar: Settings → API → Exposed schemas → adicionar "sindibes".
-- ============================================================

CREATE SCHEMA IF NOT EXISTS sindibes;

-- =========================
-- TABELAS
-- =========================
CREATE TABLE IF NOT EXISTS sindibes.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  plano TEXT DEFAULT 'basico',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sindibes.dominios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  host TEXT UNIQUE NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dominios_tenant ON sindibes.dominios(tenant_id);

CREATE TABLE IF NOT EXISTS sindibes.tenant_config (
  tenant_id UUID PRIMARY KEY REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tagline TEXT,
  whatsapp TEXT,
  whatsapp_display TEXT,
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
  cor_primaria TEXT DEFAULT '#2E9E8D',
  cor_primaria_dark TEXT DEFAULT '#1E6E62',
  cor_secundaria TEXT DEFAULT '#6E5A97',
  cor_secundaria_dark TEXT DEFAULT '#52406F',
  cor_accent TEXT DEFAULT '#DCEFEC',
  cor_text TEXT DEFAULT '#1B2444',
  cor_bg_alt TEXT DEFAULT '#F8FBFA',
  logo_url TEXT,
  favicon_url TEXT,
  meta JSONB DEFAULT '{}',
  atendente_nome TEXT DEFAULT 'Wagner',
  atendente_foto_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sindibes.permissoes (
  chave TEXT PRIMARY KEY,
  modulo TEXT NOT NULL,
  acao TEXT NOT NULL,
  descricao TEXT,
  ordem INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sindibes.departamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT DEFAULT '#6E5A97',
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, nome)
);

CREATE TABLE IF NOT EXISTS sindibes.departamento_permissoes (
  departamento_id UUID NOT NULL REFERENCES sindibes.departamentos(id) ON DELETE CASCADE,
  permissao_chave TEXT NOT NULL REFERENCES sindibes.permissoes(chave) ON DELETE CASCADE,
  PRIMARY KEY (departamento_id, permissao_chave)
);

CREATE TABLE IF NOT EXISTS sindibes.perfis (
  user_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES sindibes.tenants(id) ON DELETE SET NULL,
  papel TEXT NOT NULL DEFAULT 'admin_tenant',
  nome TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  departamento_id UUID REFERENCES sindibes.departamentos(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_perfis_tenant ON sindibes.perfis(tenant_id);

CREATE TABLE IF NOT EXISTS sindibes.vitrine_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  slider_key TEXT NOT NULL DEFAULT 'home_hero',
  imagem_url TEXT NOT NULL,
  titulo TEXT,
  destaque TEXT,
  subtitulo TEXT,
  link_url TEXT,
  cta_texto TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  data_inicio DATE,
  data_fim DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vitrine_tenant_slider ON sindibes.vitrine_slides(tenant_id, slider_key, ordem);

CREATE TABLE IF NOT EXISTS sindibes.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  titulo TEXT,
  anunciante_nome TEXT NOT NULL,
  anunciante_contato TEXT,
  imagem_url TEXT NOT NULL,
  link_destino TEXT,
  posicao TEXT NOT NULL,
  ordem INT DEFAULT 0,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  valor_contrato NUMERIC(10,2),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_banners_tenant_posicao ON sindibes.banners(tenant_id, posicao, ordem);

CREATE TABLE IF NOT EXISTS sindibes.banner_eventos (
  id BIGSERIAL PRIMARY KEY,
  banner_id UUID NOT NULL REFERENCES sindibes.banners(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_banner_eventos ON sindibes.banner_eventos(banner_id, tipo, created_at DESC);

CREATE TABLE IF NOT EXISTS sindibes.atendimento_config (
  tenant_id UUID PRIMARY KEY REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT TRUE,
  saudacao TEXT,
  segundos_para_abrir INT DEFAULT 3,
  texto_convite TEXT,
  texto_minimizado TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chave da IA: só a chave de serviço (servidor) lê e grava
CREATE TABLE IF NOT EXISTS sindibes.integracoes_secretas (
  tenant_id UUID PRIMARY KEY REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  chave_ia TEXT,
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_por TEXT
);

CREATE TABLE IF NOT EXISTS sindibes.app_cliques (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  app TEXT NOT NULL,
  loja TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_app_cliques ON sindibes.app_cliques(tenant_id, app, loja, created_at DESC);

CREATE TABLE IF NOT EXISTS sindibes.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
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

-- status: pendente | publicado | oculto | reprovado. ativo é mantido pelo gatilho.
CREATE TABLE IF NOT EXISTS sindibes.associados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
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
  fotos JSONB DEFAULT '[]',
  destaque BOOLEAN DEFAULT FALSE,
  novo BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'publicado',
  redes JSONB NOT NULL DEFAULT '[]',
  endereco_detalhe JSONB NOT NULL DEFAULT '{}',
  telefone_display TEXT,
  origem TEXT NOT NULL DEFAULT 'painel',
  analisado_em TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS sindibes.parceiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
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
  status TEXT NOT NULL DEFAULT 'publicado',
  resumo TEXT,
  servicos JSONB NOT NULL DEFAULT '[]',
  redes JSONB NOT NULL DEFAULT '[]',
  endereco JSONB NOT NULL DEFAULT '{}',
  fotos JSONB NOT NULL DEFAULT '[]',
  whatsapp_display TEXT,
  origem TEXT NOT NULL DEFAULT 'painel',
  analisado_em TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Dados sensíveis do cadastro (CPF/CNPJ, responsável, mensagem): só admin lê
CREATE TABLE IF NOT EXISTS sindibes.cadastros_privados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('parceiro', 'associado')),
  registro_id UUID NOT NULL,
  responsavel JSONB NOT NULL DEFAULT '{}',
  documento TEXT,
  mensagem TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cadastros_privados_registro ON sindibes.cadastros_privados(tenant_id, tipo, registro_id);

-- Limite de envios do formulário público
CREATE TABLE IF NOT EXISTS sindibes.cadastros_tentativas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cadastros_tentativas ON sindibes.cadastros_tentativas(tenant_id, ip_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS sindibes.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  horario TEXT,
  local_nome TEXT,
  local_endereco TEXT,
  tipo TEXT DEFAULT 'presencial',
  imagem_url TEXT,
  galeria JSONB DEFAULT '[]',
  inscricao_aberta BOOLEAN DEFAULT TRUE,
  max_participantes INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS sindibes.diretoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  grupo TEXT DEFAULT 'executiva',
  foto_url TEXT,
  ordem INT DEFAULT 0,
  gestao TEXT DEFAULT '2026-2028',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sindibes.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  nome TEXT,
  telefone TEXT,
  email TEXT,
  mensagem TEXT,
  origem TEXT,
  pagina_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON sindibes.leads(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS sindibes.curriculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS sindibes.vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES sindibes.tenants(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  funcao TEXT,
  empresa TEXT,
  tipo TEXT,
  local_vaga TEXT,
  salario TEXT,
  contato TEXT,
  descricao TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- FUNÇÕES DE ACESSO
-- =========================
CREATE OR REPLACE FUNCTION sindibes.current_perfil()
RETURNS TABLE(user_id UUID, tenant_id UUID, papel TEXT)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = sindibes, public AS $$
  SELECT pf.user_id, pf.tenant_id, pf.papel FROM sindibes.perfis pf
  WHERE pf.user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION sindibes.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = sindibes, public AS $$
  SELECT EXISTS (
    SELECT 1 FROM sindibes.perfis
    WHERE perfis.user_id = auth.uid() AND perfis.papel = 'super_admin' AND COALESCE(perfis.ativo, TRUE)
  );
$$;

CREATE OR REPLACE FUNCTION sindibes.is_tenant_admin(check_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = sindibes, public AS $$
  SELECT EXISTS (
    SELECT 1 FROM sindibes.perfis
    WHERE perfis.user_id = auth.uid()
      AND COALESCE(perfis.ativo, TRUE)
      AND (perfis.papel = 'super_admin' OR (perfis.papel = 'admin_tenant' AND perfis.tenant_id = check_tenant_id))
  );
$$;

-- Perfil sem departamento mantém acesso total ao tenant
CREATE OR REPLACE FUNCTION sindibes.has_permission_in_tenant(perm_key TEXT, check_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = sindibes, public AS $$
  SELECT sindibes.is_super_admin() OR EXISTS (
    SELECT 1 FROM sindibes.perfis p
    WHERE p.user_id = auth.uid()
      AND p.tenant_id = check_tenant_id
      AND p.papel = 'admin_tenant'
      AND COALESCE(p.ativo, TRUE)
      AND (
        p.departamento_id IS NULL
        OR EXISTS (
          SELECT 1 FROM sindibes.departamento_permissoes dp
          WHERE dp.departamento_id = p.departamento_id AND dp.permissao_chave = perm_key
        )
      )
  );
$$;

-- =========================
-- CADASTROS DO SITE
-- =========================
-- ativo acompanha o status; analisado_em marca a primeira decisão do admin
CREATE OR REPLACE FUNCTION sindibes.cadastro_sincronizar_status()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = sindibes, public AS $$
BEGIN
  NEW.ativo := (NEW.status = 'publicado');
  NEW.updated_at := NOW();
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'pendente' THEN
    NEW.analisado_em := COALESCE(NEW.analisado_em, NOW());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_parceiros_status ON sindibes.parceiros;
CREATE TRIGGER trg_parceiros_status BEFORE INSERT OR UPDATE ON sindibes.parceiros
  FOR EACH ROW EXECUTE FUNCTION sindibes.cadastro_sincronizar_status();

DROP TRIGGER IF EXISTS trg_associados_status ON sindibes.associados;
CREATE TRIGGER trg_associados_status BEFORE INSERT OR UPDATE ON sindibes.associados
  FOR EACH ROW EXECUTE FUNCTION sindibes.cadastro_sincronizar_status();

-- Limite: 3 por hora e 10 por dia por pessoa (hash do IP), 30 por hora no site
CREATE OR REPLACE FUNCTION sindibes.sindibes_pode_enviar_cadastro(p_tenant_id UUID, p_ip_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = sindibes, public AS $$
DECLARE
  v_hora INT; v_dia INT; v_site INT;
BEGIN
  IF p_ip_hash IS NULL OR length(p_ip_hash) > 128
     OR NOT EXISTS (SELECT 1 FROM sindibes.tenants t WHERE t.id = p_tenant_id AND t.status = 'ativo') THEN
    RETURN FALSE;
  END IF;

  DELETE FROM sindibes.cadastros_tentativas WHERE created_at < NOW() - INTERVAL '2 days';

  SELECT count(*) FILTER (WHERE ip_hash = p_ip_hash AND created_at > NOW() - INTERVAL '1 hour'),
         count(*) FILTER (WHERE ip_hash = p_ip_hash AND created_at > NOW() - INTERVAL '1 day'),
         count(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour')
    INTO v_hora, v_dia, v_site
    FROM sindibes.cadastros_tentativas WHERE tenant_id = p_tenant_id;

  IF v_hora >= 3 OR v_dia >= 10 OR v_site >= 30 THEN
    RETURN FALSE;
  END IF;

  INSERT INTO sindibes.cadastros_tentativas (tenant_id, ip_hash) VALUES (p_tenant_id, p_ip_hash);
  RETURN TRUE;
END;
$$;

-- Cria o cadastro como "pendente" (fora do ar) e guarda os dados privados à parte.
-- Só aceita fotos que vieram do bucket do próprio tenant.
CREATE OR REPLACE FUNCTION sindibes.sindibes_enviar_cadastro(
  p_tenant_id UUID, p_tipo TEXT, p_dados JSONB, p_privado JSONB
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = sindibes, public AS $$
DECLARE
  v_base TEXT; v_slug TEXT; v_n INT := 1; v_id UUID;
  v_padrao TEXT := '/storage/v1/object/public/tenant-uploads/' || p_tenant_id::text || '/cadastros/';
  v_capa TEXT; v_fotos JSONB;
BEGIN
  IF p_tipo NOT IN ('parceiro', 'associado') THEN
    RAISE EXCEPTION 'tipo invalido';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM sindibes.tenants t WHERE t.id = p_tenant_id AND t.status = 'ativo') THEN
    RAISE EXCEPTION 'tenant invalido';
  END IF;
  IF COALESCE(trim(p_dados->>'nome'), '') = '' THEN
    RAISE EXCEPTION 'nome obrigatorio';
  END IF;

  v_capa := NULLIF(p_dados->>'capa', '');
  IF v_capa IS NOT NULL AND position(v_padrao IN v_capa) = 0 THEN v_capa := NULL; END IF;
  SELECT COALESCE(jsonb_agg(f), '[]'::jsonb) INTO v_fotos
    FROM (SELECT f FROM jsonb_array_elements_text(
            CASE WHEN jsonb_typeof(p_dados->'fotos') = 'array' THEN p_dados->'fotos' ELSE '[]'::jsonb END) f
          WHERE position(v_padrao IN f) > 0 LIMIT 12) x;

  v_base := left(trim(both '-' from regexp_replace(lower(COALESCE(NULLIF(p_dados->>'slug', ''), p_tipo)), '[^a-z0-9]+', '-', 'g')), 60);
  IF v_base = '' THEN v_base := p_tipo; END IF;
  v_slug := v_base;

  IF p_tipo = 'parceiro' THEN
    WHILE EXISTS (SELECT 1 FROM sindibes.parceiros WHERE tenant_id = p_tenant_id AND slug = v_slug) LOOP
      v_n := v_n + 1; v_slug := v_base || '-' || v_n;
    END LOOP;
    INSERT INTO sindibes.parceiros (
      tenant_id, nome, slug, categoria, resumo, descricao, servicos, beneficio_associados,
      foto_capa_url, fotos, site_url, whatsapp, whatsapp_display, instagram, redes, endereco,
      status, origem
    ) VALUES (
      p_tenant_id, left(p_dados->>'nome', 200), v_slug, left(p_dados->>'categoria', 100),
      left(p_dados->>'resumo', 600), left(p_dados->>'descricao', 8000),
      CASE WHEN jsonb_typeof(p_dados->'servicos') = 'array' THEN p_dados->'servicos' ELSE '[]'::jsonb END,
      left(p_dados->>'desconto', 600), v_capa, v_fotos,
      left(p_dados->>'site_url', 300), left(p_dados->>'whatsapp', 20), left(p_dados->>'whatsapp_display', 40),
      left(p_dados->>'instagram', 300),
      CASE WHEN jsonb_typeof(p_dados->'redes') = 'array' THEN p_dados->'redes' ELSE '[]'::jsonb END,
      CASE WHEN jsonb_typeof(p_dados->'endereco') = 'object' THEN p_dados->'endereco' ELSE '{}'::jsonb END,
      'pendente', 'site'
    ) RETURNING id INTO v_id;
  ELSE
    WHILE EXISTS (SELECT 1 FROM sindibes.associados WHERE tenant_id = p_tenant_id AND slug = v_slug) LOOP
      v_n := v_n + 1; v_slug := v_base || '-' || v_n;
    END LOOP;
    INSERT INTO sindibes.associados (
      tenant_id, nome, slug, descricao, endereco, endereco_detalhe, cidade, bairro,
      whatsapp, telefone, telefone_display, email, instagram, foto_capa_url, fotos, redes,
      status, origem
    ) VALUES (
      p_tenant_id, left(p_dados->>'nome', 200), v_slug, left(p_dados->>'descricao', 8000),
      left(p_dados->>'endereco', 400),
      CASE WHEN jsonb_typeof(p_dados->'endereco_detalhe') = 'object' THEN p_dados->'endereco_detalhe' ELSE '{}'::jsonb END,
      left(p_dados->>'cidade', 100), left(p_dados->>'bairro', 100),
      left(p_dados->>'whatsapp', 20), left(p_dados->>'telefone', 40), left(p_dados->>'telefone_display', 40),
      left(p_dados->>'email', 200), left(p_dados->>'instagram', 300), v_capa, v_fotos,
      CASE WHEN jsonb_typeof(p_dados->'redes') = 'array' THEN p_dados->'redes' ELSE '[]'::jsonb END,
      'pendente', 'site'
    ) RETURNING id INTO v_id;
  END IF;

  INSERT INTO sindibes.cadastros_privados (tenant_id, tipo, registro_id, responsavel, documento, mensagem)
  VALUES (
    p_tenant_id, p_tipo, v_id,
    CASE WHEN jsonb_typeof(p_privado->'responsavel') = 'object' THEN p_privado->'responsavel' ELSE '{}'::jsonb END,
    NULLIF(left(p_privado->>'documento', 30), ''), NULLIF(left(p_privado->>'mensagem', 4000), '')
  );

  RETURN jsonb_build_object('id', v_id, 'slug', v_slug);
END;
$$;

-- =========================
-- PERMISSÕES DO POSTGRES
-- =========================
GRANT USAGE ON SCHEMA sindibes TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA sindibes TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA sindibes TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA sindibes TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA sindibes GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA sindibes GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA sindibes GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;

-- Tabelas que o público nunca acessa direto
REVOKE ALL ON sindibes.integracoes_secretas FROM anon, authenticated;
REVOKE ALL ON sindibes.cadastros_tentativas FROM anon, authenticated;
REVOKE ALL ON sindibes.cadastros_privados FROM anon;

-- =========================
-- RLS
-- =========================
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'sindibes' LOOP
    EXECUTE format('ALTER TABLE sindibes.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
  -- Recria todas as policies do schema (permite rodar o script de novo)
  FOR t IN SELECT format('DROP POLICY %I ON sindibes.%I', policyname, tablename)
           FROM pg_policies WHERE schemaname = 'sindibes' LOOP
    EXECUTE t;
  END LOOP;
END $$;

CREATE POLICY "Leitura publica tenants" ON sindibes.tenants FOR SELECT USING (status = 'ativo');
CREATE POLICY "Super admin gerencia tenants" ON sindibes.tenants FOR ALL USING (sindibes.is_super_admin());

CREATE POLICY "Leitura publica dominios" ON sindibes.dominios FOR SELECT USING (true);
CREATE POLICY "Super admin gerencia dominios" ON sindibes.dominios FOR ALL USING (sindibes.is_super_admin());

CREATE POLICY "Leitura publica config" ON sindibes.tenant_config FOR SELECT USING (true);
CREATE POLICY "Admin do tenant edita config" ON sindibes.tenant_config FOR UPDATE USING (sindibes.is_tenant_admin(tenant_id));
CREATE POLICY "Super admin gerencia config" ON sindibes.tenant_config FOR ALL USING (sindibes.is_super_admin());

CREATE POLICY "Leitura autenticada permissoes" ON sindibes.permissoes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Super admin gerencia permissoes" ON sindibes.permissoes FOR ALL USING (sindibes.is_super_admin());

CREATE POLICY "Admin gerencia departamentos" ON sindibes.departamentos FOR ALL USING (sindibes.is_tenant_admin(tenant_id));
CREATE POLICY "Membro le departamentos" ON sindibes.departamentos FOR SELECT USING (
  EXISTS (SELECT 1 FROM sindibes.perfis p WHERE p.user_id = auth.uid() AND p.tenant_id = departamentos.tenant_id)
);
CREATE POLICY "Admin gerencia dep_permissoes" ON sindibes.departamento_permissoes FOR ALL USING (
  EXISTS (SELECT 1 FROM sindibes.departamentos d WHERE d.id = departamento_id AND sindibes.is_tenant_admin(d.tenant_id))
);
CREATE POLICY "Membro le dep_permissoes" ON sindibes.departamento_permissoes FOR SELECT USING (
  EXISTS (SELECT 1 FROM sindibes.perfis p WHERE p.user_id = auth.uid() AND p.departamento_id = departamento_permissoes.departamento_id)
);

CREATE POLICY "Usuario le proprio perfil" ON sindibes.perfis FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin gerencia perfis do tenant" ON sindibes.perfis FOR ALL USING (sindibes.is_tenant_admin(tenant_id));
CREATE POLICY "Super admin gerencia perfis" ON sindibes.perfis FOR ALL USING (sindibes.is_super_admin());

CREATE POLICY "Leitura publica vitrine vigente" ON sindibes.vitrine_slides FOR SELECT USING (
  ativo AND (data_inicio IS NULL OR CURRENT_DATE >= data_inicio) AND (data_fim IS NULL OR CURRENT_DATE <= data_fim)
);
CREATE POLICY "Admin le vitrine" ON sindibes.vitrine_slides FOR SELECT USING (sindibes.has_permission_in_tenant('vitrine.ver', tenant_id));
CREATE POLICY "Admin gerencia vitrine" ON sindibes.vitrine_slides FOR ALL
  USING (sindibes.has_permission_in_tenant('vitrine.editar', tenant_id))
  WITH CHECK (sindibes.has_permission_in_tenant('vitrine.editar', tenant_id));

CREATE POLICY "Leitura publica banners vigentes" ON sindibes.banners FOR SELECT USING (ativo AND CURRENT_DATE BETWEEN data_inicio AND data_fim);
CREATE POLICY "Admin le banners" ON sindibes.banners FOR SELECT USING (sindibes.has_permission_in_tenant('banners.ver', tenant_id));
CREATE POLICY "Admin gerencia banners" ON sindibes.banners FOR ALL
  USING (sindibes.has_permission_in_tenant('banners.editar', tenant_id))
  WITH CHECK (sindibes.has_permission_in_tenant('banners.editar', tenant_id));

CREATE POLICY "Insert publico banner_eventos" ON sindibes.banner_eventos FOR INSERT WITH CHECK (tipo IN ('impressao', 'clique'));
CREATE POLICY "Admin le banner_eventos" ON sindibes.banner_eventos FOR SELECT USING (
  EXISTS (SELECT 1 FROM sindibes.banners b WHERE b.id = banner_id AND sindibes.has_permission_in_tenant('banners.ver', b.tenant_id))
);

CREATE POLICY "Leitura publica atendimento" ON sindibes.atendimento_config FOR SELECT USING (true);
CREATE POLICY "Admin gerencia atendimento" ON sindibes.atendimento_config FOR ALL
  USING (sindibes.has_permission_in_tenant('marca.editar', tenant_id))
  WITH CHECK (sindibes.has_permission_in_tenant('marca.editar', tenant_id));

CREATE POLICY "Insert publico app_cliques" ON sindibes.app_cliques FOR INSERT WITH CHECK (loja IN ('android', 'ios'));
CREATE POLICY "Admin le app_cliques" ON sindibes.app_cliques FOR SELECT USING (sindibes.has_permission_in_tenant('leads.ver', tenant_id));

CREATE POLICY "Leitura publica servicos" ON sindibes.servicos FOR SELECT USING (ativo);
CREATE POLICY "Admin gerencia servicos" ON sindibes.servicos FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

CREATE POLICY "Leitura publica associados" ON sindibes.associados FOR SELECT USING (ativo);
CREATE POLICY "Admin gerencia associados" ON sindibes.associados FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

CREATE POLICY "Leitura publica parceiros" ON sindibes.parceiros FOR SELECT USING (ativo);
CREATE POLICY "Admin gerencia parceiros" ON sindibes.parceiros FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

CREATE POLICY "Admin gerencia cadastros_privados" ON sindibes.cadastros_privados FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

CREATE POLICY "Leitura publica eventos" ON sindibes.eventos FOR SELECT USING (true);
CREATE POLICY "Admin gerencia eventos" ON sindibes.eventos FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

CREATE POLICY "Leitura publica diretoria" ON sindibes.diretoria FOR SELECT USING (true);
CREATE POLICY "Admin gerencia diretoria" ON sindibes.diretoria FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

CREATE POLICY "Insert publico leads" ON sindibes.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin le leads" ON sindibes.leads FOR SELECT USING (sindibes.is_tenant_admin(tenant_id));
CREATE POLICY "Super admin gerencia leads" ON sindibes.leads FOR ALL USING (sindibes.is_super_admin());

CREATE POLICY "Insert publico curriculos" ON sindibes.curriculos FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin gerencia curriculos" ON sindibes.curriculos FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

CREATE POLICY "Insert publico vagas" ON sindibes.vagas FOR INSERT WITH CHECK (true);
CREATE POLICY "Leitura publica vagas ativas" ON sindibes.vagas FOR SELECT USING (ativa);
CREATE POLICY "Admin gerencia vagas" ON sindibes.vagas FOR ALL USING (sindibes.is_tenant_admin(tenant_id));

-- =========================
-- STORAGE: bucket tenant-uploads (caminho {tenant_id}/{pasta}/{arquivo})
-- =========================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('tenant-uploads', 'tenant-uploads', TRUE, 5242880,
        ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "sindibes: leitura tenant-uploads" ON storage.objects;
DROP POLICY IF EXISTS "sindibes: formulario envia fotos" ON storage.objects;
DROP POLICY IF EXISTS "sindibes: admin envia arquivos" ON storage.objects;
DROP POLICY IF EXISTS "sindibes: admin atualiza arquivos" ON storage.objects;
DROP POLICY IF EXISTS "sindibes: admin remove arquivos" ON storage.objects;

CREATE POLICY "sindibes: leitura tenant-uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'tenant-uploads');

-- Formulário público só grava em {tenant}/cadastros/ de um tenant ativo
CREATE POLICY "sindibes: formulario envia fotos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'tenant-uploads'
    AND (storage.foldername(name))[2] = 'cadastros'
    AND EXISTS (SELECT 1 FROM sindibes.tenants t WHERE t.id::text = (storage.foldername(name))[1] AND t.status = 'ativo')
  );

CREATE POLICY "sindibes: admin envia arquivos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'tenant-uploads'
    AND EXISTS (SELECT 1 FROM sindibes.perfis p WHERE p.user_id = auth.uid() AND COALESCE(p.ativo, TRUE)
                AND (p.papel = 'super_admin' OR p.tenant_id::text = (storage.foldername(name))[1]))
  );

CREATE POLICY "sindibes: admin atualiza arquivos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'tenant-uploads'
    AND EXISTS (SELECT 1 FROM sindibes.perfis p WHERE p.user_id = auth.uid() AND COALESCE(p.ativo, TRUE)
                AND (p.papel = 'super_admin' OR p.tenant_id::text = (storage.foldername(name))[1]))
  );

CREATE POLICY "sindibes: admin remove arquivos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'tenant-uploads'
    AND EXISTS (SELECT 1 FROM sindibes.perfis p WHERE p.user_id = auth.uid() AND COALESCE(p.ativo, TRUE)
                AND (p.papel = 'super_admin' OR p.tenant_id::text = (storage.foldername(name))[1]))
  );

NOTIFY pgrst, 'reload schema';
-- FIM
