import { MapPin, Phone, Clock, Mail, Navigation, Circle } from 'lucide-react'
import { SITE } from '@/lib/constants'

const MAPS_QUERY = 'Sindbes - Sindicato da Beleza Uberlândia MG'

export default function MapLocation() {
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`

  return (
    <section className="py-20 bg-bg-alt overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Localização</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Como <span>chegar</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Venha nos visitar em Uberlândia. Estamos prontos para atender você e o seu negócio da beleza.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-stretch scroll-reveal">
          {/* Mockup de navegador com o mapa */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              {/* Barra do navegador */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <div className="flex-1 mx-3">
                  <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 text-xs text-gray-400 border border-gray-200">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    maps.google.com/sindbes-uberlandia
                  </div>
                </div>
              </div>
              {/* Mapa */}
              <div className="relative h-[380px]">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Sindbes"
                />
              </div>
            </div>

            {/* Badge flutuante animado */}
            <div className="map-float absolute -top-4 -right-4 hidden sm:flex items-center gap-3 bg-white rounded-2xl shadow-xl px-4 py-3 border border-gray-100">
              <span className="relative flex items-center justify-center w-10 h-10 rounded-full gradient-primary text-primary">
                <span className="pin-pulse absolute inset-0 rounded-full opacity-40" />
                <MapPin className="w-5 h-5 text-white relative z-10" />
              </span>
              <div>
                <p className="text-xs font-bold text-text leading-tight">Sindbes</p>
                <p className="text-[11px] text-gray-400 leading-tight">Uberlândia · MG</p>
              </div>
            </div>
          </div>

          {/* Card de informações */}
          <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col justify-center border border-gray-100">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-600 mb-4">
              <Circle className="live-dot w-2.5 h-2.5 fill-green-500 text-green-500" />
              Atendimento disponível
            </span>
            <h3 className="font-bold text-xl mb-6">{SITE.name}</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </span>
                <span className="text-gray-600 text-sm mt-1.5">{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </span>
                <a href={`tel:${SITE.phone}`} className="text-gray-600 text-sm hover:text-primary transition-colors">
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </span>
                <span className="text-gray-600 text-sm mt-1.5">{SITE.horario}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </span>
                <span className="text-gray-600 text-sm break-all">{SITE.email}</span>
              </li>
            </ul>

            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              <Navigation className="w-4 h-4" /> Traçar rota até o Sindbes
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
