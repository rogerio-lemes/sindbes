'use client'

import Link from 'next/link'
import { useTenant, useWhatsappUrl } from '@/components/TenantProvider'
import { INSTITUCIONAL } from '@/lib/constants'
import { MapPin, Phone, Clock, Mail, Shield } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Footer() {
  const { config, servicos } = useTenant()

  return (
    <footer className="bg-[#1a1025] text-gray-300">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo
              variant="light"
              className="h-14 w-auto mb-4 rounded-xl"
              logoUrl={config.logo_url}
              nome={config.nome}
              tagline={config.tagline}
            />
            <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">
              {config.tagline || config.nome} | {config.cidade || ''}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Representando e fortalecendo profissionais e empresas com treinamentos, assessoria e benefícios exclusivos.
            </p>
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white font-semibold rounded-lg text-sm hover:bg-secondary-dark transition-colors"
              id="pwa-footer-btn"
            >
              📲 Baixar nosso App
            </button>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">Home</Link></li>
              <li><Link href="/institucional" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">Institucional</Link></li>
              {INSTITUCIONAL.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
                    {s.nome}
                  </Link>
                </li>
              ))}
              <li><Link href="/eventos" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">Eventos</Link></li>
              <li><Link href="/parceiros" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">Parceiros</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">Blog</Link></li>
              <li><Link href="/contato" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              {servicos.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
                    {s.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                <span>{config.endereco || config.cidade || ''}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href={`tel:${config.phone || config.whatsapp}`} className="hover:text-white transition-colors">
                  {config.whatsapp_display || config.phone || ''}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                <span>{config.horario || ''}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>Disponível pelo formulário do site</span>
              </li>
              <li className="flex items-center gap-2 text-sm mt-2">
                <Shield className="w-4 h-4 text-secondary shrink-0" />
                <span>Seus dados protegidos pela LGPD</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>CNPJ: {config.cnpj || '[A definir]'}</span>
            <span className="hidden md:inline">|</span>
            <Link href="/politica-de-privacidade" className="hover:text-white hover:underline transition-colors">Política de Privacidade</Link>
            <span>·</span>
            <Link href="/termos-de-uso" className="hover:text-white hover:underline transition-colors">Termos de Uso</Link>
          </div>
          <div>
            Desenvolvido por{' '}
            <a
              href="https://www.mercadoopen.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-400 hover:text-white transition-colors"
            >
              Mercado Open
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
