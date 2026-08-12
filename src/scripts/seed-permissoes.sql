-- ============================================================
-- Seed: catálogo de permissões + departamentos de exemplo
-- Executar DEPOIS de schema.sql
-- Idempotente (pode rodar várias vezes)
-- ============================================================

-- 1. Catálogo de permissões (chave = modulo.acao)
INSERT INTO permissoes (chave, modulo, acao, descricao, ordem) VALUES
  ('marca.ver',              'marca',            'ver',    'Visualizar identidade e marca do site', 10),
  ('marca.editar',           'marca',            'editar', 'Editar identidade, cores, contatos e logo', 11),
  ('servicos.ver',           'servicos',         'ver',    'Visualizar serviços', 20),
  ('servicos.editar',        'servicos',         'editar', 'Criar, editar e excluir serviços', 21),
  ('vitrine.ver',            'vitrine',          'ver',    'Visualizar slides da vitrine', 30),
  ('vitrine.editar',         'vitrine',          'editar', 'Gerenciar slides da vitrine da home', 31),
  ('diretoria.ver',          'diretoria',        'ver',    'Visualizar membros da diretoria', 40),
  ('diretoria.editar',       'diretoria',        'editar', 'Gerenciar membros da diretoria', 41),
  ('eventos.ver',            'eventos',          'ver',    'Visualizar eventos', 50),
  ('eventos.editar',         'eventos',          'editar', 'Criar, editar e excluir eventos', 51),
  ('associados.ver',         'associados',       'ver',    'Visualizar cadastro de associados', 60),
  ('associados.editar',      'associados',       'editar', 'Criar, editar e excluir associados', 61),
  ('parceiros.ver',          'parceiros',        'ver',    'Visualizar parceiros', 70),
  ('parceiros.editar',       'parceiros',        'editar', 'Gerenciar empresas parceiras', 71),
  ('afiliados.ver',          'afiliados',        'ver',    'Visualizar afiliados do programa de indicação', 80),
  ('afiliados.editar',       'afiliados',        'editar', 'Gerenciar afiliados e comissões', 81),
  ('indicacoes.ver',         'indicacoes',       'ver',    'Visualizar indicações e comissões', 90),
  ('indicacoes.editar',      'indicacoes',       'editar', 'Registrar e liquidar comissões', 91),
  ('banners.ver',            'banners',          'ver',    'Visualizar banners de anunciantes', 100),
  ('banners.editar',         'banners',          'editar', 'Gerenciar banners e contratos de anunciantes', 101),
  ('leads.ver',              'leads',            'ver',    'Visualizar leads recebidos pelo site', 110),
  ('leads.editar',           'leads',            'editar', 'Editar e excluir leads', 111),
  ('leads_financeiro.ver',   'leads_financeiro', 'ver',    'Visualizar informações financeiras de leads', 120),
  ('leads_financeiro.editar','leads_financeiro', 'editar', 'Gerenciar informações financeiras de leads', 121),
  ('recrutamento.ver',       'recrutamento',     'ver',    'Visualizar currículos e vagas', 130),
  ('recrutamento.editar',    'recrutamento',     'editar', 'Gerenciar currículos e vagas', 131),
  ('usuarios.ver',           'usuarios',         'ver',    'Visualizar usuários e departamentos', 140),
  ('usuarios.editar',        'usuarios',         'editar', 'Gerenciar usuários e departamentos', 141),
  ('permissoes.editar',      'permissoes',       'editar', 'Configurar permissões dos departamentos', 150)
ON CONFLICT (chave) DO UPDATE SET
  modulo = EXCLUDED.modulo, acao = EXCLUDED.acao,
  descricao = EXCLUDED.descricao, ordem = EXCLUDED.ordem;

-- 2. Departamentos de exemplo (tenant Sindibes)
INSERT INTO departamentos (tenant_id, nome, descricao, cor) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Diretoria',              'Acesso total ao painel administrativo', '#1E6E62'),
  ('00000000-0000-0000-0000-000000000001', 'Atendimento/Secretaria', 'Atendimento ao associado, leads e recrutamento', '#2E9E8D'),
  ('00000000-0000-0000-0000-000000000001', 'Financeiro',             'Banners de anunciantes, comissões e leads financeiros', '#6E5A97'),
  ('00000000-0000-0000-0000-000000000001', 'Jurídico',               'Consulta de associados e diretoria', '#52406F'),
  ('00000000-0000-0000-0000-000000000001', 'Marketing/Comunicação',  'Marca, vitrine, serviços, eventos e banners', '#C2410C')
ON CONFLICT (tenant_id, nome) DO NOTHING;

-- 3. Permissões por departamento
-- Diretoria: todas
INSERT INTO departamento_permissoes (departamento_id, permissao_chave)
SELECT d.id, p.chave FROM departamentos d CROSS JOIN permissoes p
WHERE d.tenant_id = '00000000-0000-0000-0000-000000000001' AND d.nome = 'Diretoria'
ON CONFLICT DO NOTHING;

INSERT INTO departamento_permissoes (departamento_id, permissao_chave)
SELECT d.id, p.chave FROM departamentos d CROSS JOIN permissoes p
WHERE d.tenant_id = '00000000-0000-0000-0000-000000000001' AND d.nome = 'Atendimento/Secretaria'
  AND p.chave IN ('associados.ver','associados.editar','parceiros.ver','leads.ver','leads.editar',
                  'recrutamento.ver','recrutamento.editar','eventos.ver','afiliados.ver')
ON CONFLICT DO NOTHING;

INSERT INTO departamento_permissoes (departamento_id, permissao_chave)
SELECT d.id, p.chave FROM departamentos d CROSS JOIN permissoes p
WHERE d.tenant_id = '00000000-0000-0000-0000-000000000001' AND d.nome = 'Financeiro'
  AND p.chave IN ('banners.ver','banners.editar','afiliados.ver','afiliados.editar',
                  'indicacoes.ver','indicacoes.editar','leads.ver',
                  'leads_financeiro.ver','leads_financeiro.editar','associados.ver')
ON CONFLICT DO NOTHING;

INSERT INTO departamento_permissoes (departamento_id, permissao_chave)
SELECT d.id, p.chave FROM departamentos d CROSS JOIN permissoes p
WHERE d.tenant_id = '00000000-0000-0000-0000-000000000001' AND d.nome = 'Jurídico'
  AND p.chave IN ('associados.ver','diretoria.ver','parceiros.ver','recrutamento.ver')
ON CONFLICT DO NOTHING;

INSERT INTO departamento_permissoes (departamento_id, permissao_chave)
SELECT d.id, p.chave FROM departamentos d CROSS JOIN permissoes p
WHERE d.tenant_id = '00000000-0000-0000-0000-000000000001' AND d.nome = 'Marketing/Comunicação'
  AND p.chave IN ('marca.ver','marca.editar','servicos.ver','servicos.editar',
                  'vitrine.ver','vitrine.editar','eventos.ver','eventos.editar',
                  'banners.ver','banners.editar','parceiros.ver','parceiros.editar',
                  'diretoria.ver','diretoria.editar','associados.ver','leads.ver')
ON CONFLICT DO NOTHING;
