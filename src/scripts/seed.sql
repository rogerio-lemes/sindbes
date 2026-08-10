-- Sindibes - Sindicato da Beleza - Database Seed
-- Prefix: sindibes_sindicato_da_bel_

-- Tables
CREATE TABLE IF NOT EXISTS sindibes_sindicato_da_bel_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT, whatsapp TEXT, telefone TEXT, email TEXT, endereco TEXT,
  instagram TEXT, cor_primaria TEXT, cor_secundaria TEXT, logo_url TEXT,
  google_maps_url TEXT, nota_google NUMERIC, meta JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sindibes_sindicato_da_bel_paginas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, tipo TEXT NOT NULL,
  modelo TEXT, title TEXT, meta_description TEXT, h1 TEXT,
  palavra_chave TEXT, seo_jsonld JSONB DEFAULT '{}',
  ordem_menu INT DEFAULT 0, publicada BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sindibes_sindicato_da_bel_secoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pagina_id UUID REFERENCES sindibes_sindicato_da_bel_paginas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  conteudo JSONB NOT NULL DEFAULT '{}',
  visivel BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sindibes_sindicato_da_bel_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL, slug TEXT, descricao TEXT, imagem_url TEXT, ordem INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sindibes_sindicato_da_bel_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT, telefone TEXT, email TEXT, mensagem TEXT,
  origem TEXT, pagina_slug TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE sindibes_sindicato_da_bel_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE sindibes_sindicato_da_bel_paginas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sindibes_sindicato_da_bel_secoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sindibes_sindicato_da_bel_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sindibes_sindicato_da_bel_leads ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read config" ON sindibes_sindicato_da_bel_config FOR SELECT USING (true);
CREATE POLICY "Public read paginas" ON sindibes_sindicato_da_bel_paginas FOR SELECT USING (true);
CREATE POLICY "Public read secoes" ON sindibes_sindicato_da_bel_secoes FOR SELECT USING (true);
CREATE POLICY "Public read servicos" ON sindibes_sindicato_da_bel_servicos FOR SELECT USING (true);

-- Public insert leads
CREATE POLICY "Public insert leads" ON sindibes_sindicato_da_bel_leads FOR INSERT WITH CHECK (true);

-- Authenticated write
CREATE POLICY "Auth write config" ON sindibes_sindicato_da_bel_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write paginas" ON sindibes_sindicato_da_bel_paginas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write secoes" ON sindibes_sindicato_da_bel_secoes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write servicos" ON sindibes_sindicato_da_bel_servicos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read leads" ON sindibes_sindicato_da_bel_leads FOR SELECT USING (auth.role() = 'authenticated');

-- Seed config
INSERT INTO sindibes_sindicato_da_bel_config (nome, whatsapp, telefone, email, endereco, instagram, cor_primaria, cor_secundaria, logo_url, google_maps_url)
VALUES (
  'Sindibes - Sindicato da Beleza',
  '5534984468553',
  '(34) 98446-8553',
  'adm.sindibes@gmail.com',
  'Uberlândia, MG',
  '@sindibes',
  '#2E9E8D',
  '#6E5A97',
  NULL,
  'https://maps.google.com/?q=Sindibes+Uberlândia'
);

-- Seed servicos
INSERT INTO sindibes_sindicato_da_bel_servicos (nome, slug, ordem) VALUES
('Treinamentos e qualificações profissionais', 'treinamentos-e-qualificacoes-profissionais', 1),
('Assessoria jurídica e contábil para empresas da beleza', 'assessoria-juridica-e-contabil-para-empresas-da-be', 2),
('Benefícios para associados', 'beneficios-para-associados', 3),
('Plano de Saúde', 'plano-de-saude', 4),
('Qualificação em gestão financeira', 'qualificacao-em-gestao-financeira', 5),
('Qualificação em gestão de pessoas', 'qualificacao-em-gestao-de-pessoas', 6),
('Planejamento empresarial para empresas da beleza', 'planejamento-empresarial-para-empresas-da-beleza', 7),
('Plano Odontológico', 'plano-odontologico', 8),
('Regularização e Certificação Profissional', 'regularizacao-e-certificacao-profissional', 9),
('Acesso de Crédito', 'acesso-de-credito', 10);

-- Seed paginas: Home
INSERT INTO sindibes_sindicato_da_bel_paginas (slug, tipo, modelo, title, meta_description, h1, palavra_chave, ordem_menu) VALUES
('home', 'home', 'HOME', 'Sindibes - Sindicato da Beleza | Treinamentos, Assessoria e Benefícios em Uberlândia', 'Sindibes, o Sindicato da Beleza de Uberlândia. Treinamentos, assessoria jurídica e contábil, planos de saúde e benefícios para profissionais da beleza.', 'Sindibes - Sindicato da Beleza de Uberlândia', 'sindicato da beleza uberlândia', 0);

-- Seed paginas: Services
INSERT INTO sindibes_sindicato_da_bel_paginas (slug, tipo, modelo, title, h1, palavra_chave, ordem_menu) VALUES
('treinamentos-e-qualificacoes-profissionais', 'servico', 'SRV', 'Treinamentos e qualificações profissionais | Sindibes', 'Treinamentos e qualificações profissionais', 'treinamentos beleza uberlândia', 1),
('assessoria-juridica-e-contabil-para-empresas-da-be', 'servico', 'SRV', 'Assessoria jurídica e contábil para empresas da beleza | Sindibes', 'Assessoria jurídica e contábil para empresas da beleza', 'assessoria juridica salão beleza', 2),
('beneficios-para-associados', 'servico', 'SRV', 'Benefícios para associados | Sindibes', 'Benefícios para associados', 'benefícios sindicato beleza', 3),
('plano-de-saude', 'servico', 'SRV', 'Plano de Saúde | Sindibes', 'Plano de Saúde para profissionais da beleza', 'plano de saúde beleza', 4),
('qualificacao-em-gestao-financeira', 'servico', 'SRV', 'Qualificação em gestão financeira | Sindibes', 'Qualificação em gestão financeira', 'gestão financeira salão beleza', 5),
('qualificacao-em-gestao-de-pessoas', 'servico', 'SRV', 'Qualificação em gestão de pessoas | Sindibes', 'Qualificação em gestão de pessoas', 'gestão de pessoas beleza', 6),
('planejamento-empresarial-para-empresas-da-beleza', 'servico', 'SRV', 'Planejamento empresarial para empresas da beleza | Sindibes', 'Planejamento empresarial para empresas da beleza', 'planejamento empresarial beleza', 7),
('plano-odontologico', 'servico', 'SRV', 'Plano Odontológico | Sindibes', 'Plano Odontológico para associados', 'plano odontológico beleza', 8),
('regularizacao-e-certificacao-profissional', 'servico', 'SRV', 'Regularização e Certificação Profissional | Sindibes', 'Regularização e Certificação Profissional', 'certificação profissional beleza', 9),
('acesso-de-credito', 'servico', 'SRV', 'Acesso de Crédito | Sindibes', 'Acesso de Crédito para salões e profissionais', 'crédito salão beleza', 10);

-- Seed paginas: Blog articles
INSERT INTO sindibes_sindicato_da_bel_paginas (slug, tipo, modelo, title, h1, palavra_chave, ordem_menu) VALUES
('assessoria-juridica-para-salao-de-beleza-como-esco', 'artigo', 'ART', 'Assessoria jurídica para salão de beleza: como escolher | Sindibes', 'Assessoria jurídica para salão de beleza: como escolher sem errar', 'assessoria jurídica salão beleza', 100),
('cursos-area-da-beleza-quais-sinais-de-que-sua-equi', 'artigo', 'ART', 'Cursos área da beleza: sinais de que sua equipe precisa | Sindibes', 'Cursos área da beleza: sinais de que sua equipe precisa de qualificação', 'cursos área beleza', 101),
('assessoria-contabil-salao-de-beleza-quanto-custa-e', 'artigo', 'ART', 'Assessoria contábil salão de beleza: quanto custa | Sindibes', 'Assessoria contábil salão de beleza: quanto custa e como contratar', 'assessoria contábil salão beleza', 102),
('o-que-e-o-sindicato-da-area-da-beleza-e-por-que-do', 'artigo', 'ART', 'O que é o Sindicato da beleza e por que se filiar | Sindibes', 'O que é o Sindicato da área da beleza e por que se filiar', 'sindicato beleza uberlândia', 103),
('qualificacao-beleza-e-estetica-vale-a-pena-o-que-a', 'artigo', 'ART', 'Qualificação beleza e estética vale a pena? | Sindibes', 'Qualificação beleza e estética vale a pena?', 'qualificação beleza estética', 104),
('beneficios-para-associados-sindibes-passo-a-passo-', 'artigo', 'ART', 'Benefícios para associados Sindibes: passo a passo | Sindibes', 'Benefícios para associados Sindibes: passo a passo', 'benefícios associados sindibes', 105);

-- Seed paginas: Special pages
INSERT INTO sindibes_sindicato_da_bel_paginas (slug, tipo, modelo, title, h1, ordem_menu) VALUES
('blog', 'listagem', 'BLOG', 'Blog | Sindibes', 'Blog Sindibes', 50),
('contato', 'contato', 'CONTATO', 'Contato | Sindibes', 'Fale com o Sindibes', 51);
