import { NextRequest, NextResponse } from 'next/server'

// Hosts reservados para o super-admin (não são tenants)
const PLATFORM_HOSTS = ['app.plataforma.com.br', 'admin.plataforma.com.br']

// Paths que pertencem ao super-admin da plataforma
const PLATFORM_PATHS = ['/painel']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // 1. Paths do super-admin — não precisam de tenant
  if (PLATFORM_PATHS.some((p) => pathname.startsWith(p))) {
    return response
  }

  // 2. Assets estáticos, API interna do Next — não interceptar
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // arquivos estáticos (favicon, images, manifest)
  ) {
    return response
  }

  // 3. Resolver o host do tenant
  const host = request.headers.get('host') || ''
  const normalizedHost = host
    .replace(/:\d+$/, '')     // remove porta
    .replace(/^www\./, '')    // remove www
    .toLowerCase()

  // Se o host é da plataforma (super-admin), não injeta tenant
  if (PLATFORM_HOSTS.includes(normalizedHost)) {
    return response
  }

  // 4. Override por query param em desenvolvimento (?tenant=slug)
  const isDev = process.env.NODE_ENV !== 'production'
  const tenantOverride = request.nextUrl.searchParams.get('tenant')

  if (isDev && tenantOverride) {
    // Injeta o slug para resolução direta (sem lookup de domínio)
    response.headers.set('x-tenant-slug', tenantOverride)
    return response
  }

  // 5. Injeta o host normalizado para o Server Component resolver
  response.headers.set('x-tenant-host', normalizedHost)

  return response
}

export const config = {
  // Rodar em todas as rotas exceto assets internos do Next
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
