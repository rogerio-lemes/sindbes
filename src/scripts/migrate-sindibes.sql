-- ============================================================
-- Migração: Sindibes como tenant nº 1
-- Executar no Supabase SQL Editor DEPOIS de schema.sql
-- ============================================================

-- 1. Criar o tenant
INSERT INTO tenants (id, slug, nome, status, plano)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'sindibes',
  'Sindibes - Sindicato da Beleza',
  'ativo',
  'profissional'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Domínios do Sindibes
-- Adicione mais linhas conforme os domínios configurados na Vercel
INSERT INTO dominios (tenant_id, host, is_primary) VALUES
  ('00000000-0000-0000-0000-000000000001', 'localhost',       FALSE),
  ('00000000-0000-0000-0000-000000000001', 'localhost:3000',  FALSE),
  ('00000000-0000-0000-0000-000000000001', 'sindibes.vercel.app', TRUE)
ON CONFLICT (host) DO NOTHING;

-- 3. Configuração do Sindibes
INSERT INTO tenant_config (
  tenant_id, nome, tagline, whatsapp, whatsapp_display,
  phone, email, endereco, cidade, uf, instagram, cnpj, horario,
  google_maps_url,
  cor_primaria, cor_primaria_dark, cor_secundaria, cor_secundaria_dark,
  cor_accent, cor_text, cor_bg_alt,
  atendente_nome
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Sindibes - Sindicato da Beleza',
  'Sindicato da Beleza de Uberlândia',
  '5534984468553',
  '(34) 98446-8553',
  '5534984468553',
  'adm.sindibes@gmail.com',
  'Uberlândia, MG',
  'Uberlândia',
  'MG',
  '@sindibes',
  NULL, -- CNPJ será inserido pelo admin
  'Seg a Sex: 8h às 18h | Sáb: 8h às 12h',
  'https://maps.google.com/?q=Sindibes+Uberlândia',
  -- Cores (mesmas do globals.css)
  '#2E9E8D', -- primaria
  '#1E6E62', -- primaria_dark
  '#6E5A97', -- secundaria
  '#52406F', -- secundaria_dark
  '#DCEFEC', -- accent
  '#1B2444', -- text
  '#F8FBFA', -- bg_alt
  'Wagner'
)
ON CONFLICT (tenant_id) DO NOTHING;

-- 4. Serviços do Sindibes
INSERT INTO servicos (tenant_id, nome, slug, seo_title, seo_description, ordem) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Treinamentos e qualificações profissionais', 'treinamentos-e-qualificacoes-profissionais', 'Treinamentos para Salão de Beleza | Sindibes Uberlândia', 'Treinamentos e qualificações profissionais para salões, barbearias e clínicas de estética em Uberlândia, com certificados reconhecidos pelo Sindibes.', 1),
  ('00000000-0000-0000-0000-000000000001', 'Assessoria jurídica e contábil para empresas da beleza', 'assessoria-juridica-e-contabil-para-empresas-da-be', 'Assessoria Jurídica e Contábil para Salão | Sindibes', 'Assessoria jurídica e contábil especializada no setor da beleza em Uberlândia. Proteja seu salão de processos e irregularidades com o Sindibes.', 2),
  ('00000000-0000-0000-0000-000000000001', 'Benefícios para associados', 'beneficios-para-associados', 'Benefícios Exclusivos para Associados | Sindibes', 'Benefícios exclusivos para associados do Sindibes: planos de saúde, odontológico, crédito, assessoria e treinamentos para o setor da beleza.', 3),
  ('00000000-0000-0000-0000-000000000001', 'Plano de Saúde', 'plano-de-saude', 'Plano de Saúde para Profissionais da Beleza | Sindibes', 'Plano de saúde com condições exclusivas para profissionais e empresas da beleza de Uberlândia, negociado pelo Sindibes. Cobertura ampla e acessível.', 4),
  ('00000000-0000-0000-0000-000000000001', 'Qualificação em gestão financeira', 'qualificacao-em-gestao-financeira', 'Qualificação em Gestão Financeira | Sindibes Beleza', 'Qualificação em gestão financeira para salões e clínicas de beleza. Aprenda a controlar o caixa e lucrar mais com os treinamentos do Sindibes.', 5),
  ('00000000-0000-0000-0000-000000000001', 'Qualificação em gestão de pessoas', 'qualificacao-em-gestao-de-pessoas', 'Qualificação em Gestão de Pessoas | Sindibes Beleza', 'Qualificação em gestão de pessoas para o setor da beleza. Contrate, lidere e retenha talentos no seu salão com o apoio do Sindibes em Uberlândia.', 6),
  ('00000000-0000-0000-0000-000000000001', 'Planejamento empresarial para empresas da beleza', 'planejamento-empresarial-para-empresas-da-beleza', 'Planejamento Empresarial para Salões de Beleza | Sindibes', 'Planejamento empresarial para salões, barbearias e clínicas de estética. Estruture o crescimento do seu negócio da beleza com o Sindibes.', 7),
  ('00000000-0000-0000-0000-000000000001', 'Plano Odontológico', 'plano-odontologico', 'Plano Odontológico para a Beleza | Sindibes Uberlândia', 'Plano odontológico com valores especiais para associados do Sindibes. Cuide do sorriso da sua equipe e da sua família em Uberlândia.', 8),
  ('00000000-0000-0000-0000-000000000001', 'Regularização e Certificação Profissional', 'regularizacao-e-certificacao-profissional', 'Regularização e Certificação Profissional | Sindibes', 'Regularização e certificação profissional para o setor da beleza em Uberlândia. Deixe seu negócio em dia e valorizado com o apoio do Sindibes.', 9),
  ('00000000-0000-0000-0000-000000000001', 'Acesso de Crédito', 'acesso-de-credito', 'Acesso a Crédito para Salão de Beleza | Sindibes', 'Acesso a crédito facilitado para profissionais e empresas da beleza de Uberlândia. Invista e faça seu salão crescer com o apoio do Sindibes.', 10)
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- ============================================================
-- FIM DA MIGRAÇÃO
-- Após executar, o site deve funcionar com o tenant 'sindibes'
-- acessando via localhost:3000 ou sindibes.vercel.app
-- ============================================================
