// Re-exporta tudo da camada de tenant para imports limpos:
// import { getTenant, getServicos, tenantWhatsappUrl } from '@/lib/tenant'

export { getTenant, tenantWhatsappUrl } from './context'
export {
  getConfig,
  getServicos,
  getServicoPorSlug,
  getAssociados,
  getAssociadoPorSlug,
  getEventos,
  getEventoPorSlug,
  getParceiros,
  getParceiroPorSlug,
  getDiretoria,
  getCurriculos,
  getVagas,
  getVagaPorSlug,
} from './data'
export type {
  Tenant,
  TenantConfig,
  TenantWithConfig,
  Servico,
  Associado,
  Evento,
  Parceiro,
  MembroDiretoria,
  Lead,
  Curriculo,
  Vaga,
} from './types'
