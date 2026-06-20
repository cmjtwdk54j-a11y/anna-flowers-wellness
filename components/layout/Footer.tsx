import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/utils';

export default function Footer() {
  const t = useTranslations('nav');
  const tContact = useTranslations('contact');
  const tFooter = useTranslations('footer');

  return (
    <footer className="bg-stone-800 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AF</span>
              </div>
              <div>
                <span className="font-semibold text-white text-sm block">Aavafloristi</span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {tFooter('tagline')}
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/\s+/g, '').replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">{tFooter('pages')}</h3>
            <ul className="space-y-2">
              {[
                { href: '/flowers', label: t('flowers') },
                { href: '/massage', label: t('massage') },
                { href: '/gift-cards', label: t('giftCards') },
                { href: '/delivery', label: t('delivery') },
                { href: '/contact', label: t('contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">{tContact('title')}</h3>
            <ul className="space-y-3">
              <li className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-stone-400">{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone}`} className="text-sm text-stone-400 hover:text-white">
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="text-sm text-stone-400 hover:text-white">
                  {BUSINESS_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">{tContact('openingHours')}</h3>
            <ul className="space-y-2">
              <li className="text-sm text-stone-400">
                <span className="text-stone-300">{tFooter('weekdays')}</span> {BUSINESS_INFO.hours.weekdays}
              </li>
              <li className="text-sm text-stone-400">
                <span className="text-stone-300">{tFooter('saturday')}</span> {BUSINESS_INFO.hours.saturday}
              </li>
              <li className="text-sm text-stone-400">
                <span className="text-stone-300">{tFooter('sunday')}</span> {BUSINESS_INFO.hours.sunday}
              </li>
            </ul>
            <div className="mt-4 p-3 bg-stone-700 rounded-lg">
              <p className="text-xs text-stone-400">
                <span className="text-white font-medium">{tFooter('parking')}</span>
                <br />{tFooter('parkingDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Aavafloristi. {tFooter('rights')}.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-stone-500 hover:text-stone-300">
              {tFooter('privacy')}
            </Link>
            <Link href="/terms" className="text-xs text-stone-500 hover:text-stone-300">
              {tFooter('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
