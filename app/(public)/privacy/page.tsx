'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import LangToggle from '@/components/LangToggle';

const content = {
  fi: {
    badge: 'Oikeudelliset tiedot',
    title: 'Tietosuojaseloste',
    effective: 'Aavafloristi · Voimassa 1.1.2026 alkaen · Helsinki',
    sections: [
      {
        title: '1. Rekisterinpitäjä',
        body: (
          <p>
            <strong className="text-stone-700">Aavafloristi</strong><br />
            Puistolantori 1, 00760 Helsinki, Suomi<br />
            Sähköposti: <a href="mailto:info@aavafloristi.fi" className="text-rose-500 hover:underline">info@aavafloristi.fi</a><br />
            Puhelin: <a href="tel:+358501234567" className="text-rose-500 hover:underline">+358 50 123 4567</a>
          </p>
        ),
      },
      {
        title: '2. Kerättävät henkilötiedot',
        body: (
          <>
            <p className="mb-3">Keräämme seuraavia henkilötietoja palveluidemme tarjoamiseksi:</p>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">Yhteystiedot:</strong> nimi, sähköpostiosoite, puhelinnumero</li>
              <li><strong className="text-stone-600">Toimitusosoite:</strong> katuosoite, postinumero ja kaupunki</li>
              <li><strong className="text-stone-600">Tilaukset:</strong> tilatut tuotteet, hinnat, toimitustapa ja ajankohta</li>
              <li><strong className="text-stone-600">Viestit:</strong> yhteydenottolomakkeen kautta lähetetyt viestit</li>
              <li><strong className="text-stone-600">Tekniset tiedot:</strong> selain, IP-osoite ja evästeet teknistä toimintaa varten</li>
            </ul>
          </>
        ),
      },
      {
        title: '3. Tietojen käyttötarkoitus ja oikeusperuste',
        body: (
          <div className="space-y-3">
            {[
              { t: 'Tilausten käsittely', d: 'Käytämme tietojasi tilausten vastaanottamiseen, toimituksen järjestämiseen ja vahvistusten lähettämiseen. Oikeusperuste: sopimuksen täyttäminen (GDPR 6 art. 1 b).' },
              { t: 'Asiakaspalvelu', d: 'Käytämme tietojasi yhteydenottoihin vastaamiseen. Oikeusperuste: oikeutettu etu (GDPR 6 art. 1 f).' },
              { t: 'Lakisääteiset velvollisuudet', d: 'Säilytämme kirjanpitolainsäädännön edellyttämät tiedot. Oikeusperuste: lakisääteinen velvollisuus (GDPR 6 art. 1 c).' },
            ].map((item) => (
              <div key={item.t} className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-1">{item.t}</p>
                <p className="text-stone-500">{item.d}</p>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: '4. Tietojen jakaminen',
        body: (
          <>
            <p className="mb-3">Emme myy tai luovuta henkilötietojasi kolmansille osapuolille markkinointitarkoituksiin. Käytämme seuraavia alihankkijoita:</p>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">PayPal (PayPal Holdings, Inc.)</strong> — maksutapahtumien käsittely. PayPal sijaitsee Yhdysvalloissa; tietojen siirto tapahtuu EU:n vakiosopimuslausekkeiden (SCC) nojalla. <a href="https://www.paypal.com/fi/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">PayPalin tietosuojaseloste</a>.</li>
              <li><strong className="text-stone-600">Resend</strong> — sähköpostien toimitus (tilausvahvistukset ja varausvahvistukset)</li>
              <li><strong className="text-stone-600">Vercel</strong> — web-hosting</li>
              <li><strong className="text-stone-600">Neon / PostgreSQL</strong> — tietokannan tallennus EU-alueella</li>
            </ul>
            <p className="mt-3">Viranomaisille luovutamme tietoja vain lain niin edellyttäessä.</p>
          </>
        ),
      },
      {
        title: '5. Tietojen säilytysaika',
        body: (
          <>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">Tilaukset ja asiakastiedot:</strong> 2 vuotta viimeisestä tilauksesta</li>
              <li><strong className="text-stone-600">Kirjanpitoaineisto:</strong> 6 vuotta (kirjanpitolaki)</li>
              <li><strong className="text-stone-600">Yhteydenottoviestit:</strong> 1 vuosi viestin lähettämisestä</li>
            </ul>
            <p className="mt-3">Tietojen säilytysajan päätyttyä tiedot poistetaan tai anonymisoidaan.</p>
          </>
        ),
      },
      {
        title: '6. Evästeet',
        body: (
          <>
            <p className="mb-3">Käytämme evästeitä seuraaviin tarkoituksiin:</p>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">Välttämättömät evästeet:</strong> ostoskorin toiminta, kielen tallennus, admin-kirjautuminen</li>
              <li><strong className="text-stone-600">Analytiikkaevästeet:</strong> sivuston käytön seuranta (vain suostumuksella)</li>
            </ul>
          </>
        ),
      },
      {
        title: '7. Rekisteröidyn oikeudet',
        body: (
          <>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                { t: 'Oikeus tutustua tietoihin', d: 'Voit pyytää kopiota tallentamistamme tiedoistasi.' },
                { t: 'Oikeus oikaista tietoja', d: 'Voit pyytää virheellisten tietojen korjaamista.' },
                { t: 'Oikeus poistaa tiedot', d: 'Voit pyytää tietojesi poistamista, ellei laki edellytä säilyttämistä.' },
                { t: 'Oikeus siirtää tiedot', d: 'Voit saada tietosi koneluettavassa muodossa.' },
                { t: 'Oikeus vastustaa käsittelyä', d: 'Voit vastustaa tietojesi käsittelyä oikeutetun edun perusteella.' },
                { t: 'Oikeus tehdä valitus', d: 'Voit tehdä valituksen tietosuojavaltuutetulle (tietosuoja.fi).' },
              ].map((r) => (
                <div key={r.t} className="bg-stone-50 rounded-xl p-4">
                  <p className="font-medium text-stone-700 text-xs mb-1">{r.t}</p>
                  <p className="text-stone-500 text-xs">{r.d}</p>
                </div>
              ))}
            </div>
            <p>Ota yhteyttä: <a href="mailto:info@aavafloristi.fi" className="text-rose-500 hover:underline">info@aavafloristi.fi</a>. Vastaamme 30 päivän kuluessa.</p>
          </>
        ),
      },
      {
        title: '8. Tietoturva',
        body: <p>Sivustomme käyttää HTTPS-suojausta. Pääsy henkilötietoihin on rajattu vain niitä tarvitseville. Tietomurron tapahtuessa ilmoitamme asiasta viranomaisille lain edellyttämällä tavalla.</p>,
      },
      {
        title: '9. Muutokset tietosuojaselosteeseen',
        body: <p>Pidätämme oikeuden päivittää tätä tietosuojaselostetta. Merkittävistä muutoksista ilmoitamme sivustollamme.</p>,
      },
    ],
    linksLabel: { privacy: 'Tietosuoja', terms: 'Käyttöehdot', faq: 'UKK' },
    back: '← Etusivulle',
  },
  en: {
    badge: 'Legal information',
    title: 'Privacy Policy',
    effective: 'Aavafloristi · Effective 1 January 2026 · Helsinki',
    sections: [
      {
        title: '1. Data Controller',
        body: (
          <p>
            <strong className="text-stone-700">Aavafloristi</strong><br />
            Puistolantori 1, 00760 Helsinki, Finland<br />
            Email: <a href="mailto:info@aavafloristi.fi" className="text-rose-500 hover:underline">info@aavafloristi.fi</a><br />
            Phone: <a href="tel:+358501234567" className="text-rose-500 hover:underline">+358 50 123 4567</a>
          </p>
        ),
      },
      {
        title: '2. Personal Data We Collect',
        body: (
          <>
            <p className="mb-3">We collect the following personal data to provide our services:</p>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">Contact details:</strong> name, email address, phone number</li>
              <li><strong className="text-stone-600">Delivery address:</strong> street address, postal code, and city</li>
              <li><strong className="text-stone-600">Orders:</strong> products ordered, prices, delivery method, and timing</li>
              <li><strong className="text-stone-600">Messages:</strong> messages sent via the contact form</li>
              <li><strong className="text-stone-600">Technical data:</strong> browser, IP address, and cookies for technical functionality</li>
            </ul>
          </>
        ),
      },
      {
        title: '3. Purpose and Legal Basis for Processing',
        body: (
          <div className="space-y-3">
            {[
              { t: 'Order processing', d: 'We use your data to accept orders, arrange delivery, and send confirmations. Legal basis: performance of a contract (GDPR Art. 6(1)(b)).' },
              { t: 'Customer service', d: 'We use your data to respond to enquiries. Legal basis: legitimate interest (GDPR Art. 6(1)(f)).' },
              { t: 'Statutory obligations', d: 'We retain data required by accounting legislation. Legal basis: legal obligation (GDPR Art. 6(1)(c)).' },
            ].map((item) => (
              <div key={item.t} className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-1">{item.t}</p>
                <p className="text-stone-500">{item.d}</p>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: '4. Sharing of Data',
        body: (
          <>
            <p className="mb-3">We do not sell or share your personal data with third parties for marketing purposes. We use the following sub-processors:</p>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">PayPal (PayPal Holdings, Inc.)</strong> — payment processing. PayPal is based in the United States; data transfer takes place under EU Standard Contractual Clauses (SCCs). <a href="https://www.paypal.com/fi/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">PayPal Privacy Policy</a>.</li>
              <li><strong className="text-stone-600">Resend</strong> — email delivery (order and booking confirmations)</li>
              <li><strong className="text-stone-600">Vercel</strong> — web hosting</li>
              <li><strong className="text-stone-600">Neon / PostgreSQL</strong> — database storage within the EU</li>
            </ul>
            <p className="mt-3">We only disclose data to authorities when required by law.</p>
          </>
        ),
      },
      {
        title: '5. Retention Periods',
        body: (
          <>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">Orders and customer data:</strong> 2 years from the last order</li>
              <li><strong className="text-stone-600">Accounting records:</strong> 6 years (Finnish Accounting Act)</li>
              <li><strong className="text-stone-600">Contact messages:</strong> 1 year from the date of the message</li>
            </ul>
            <p className="mt-3">After the retention period, data is deleted or anonymised.</p>
          </>
        ),
      },
      {
        title: '6. Cookies',
        body: (
          <>
            <p className="mb-3">We use cookies for the following purposes:</p>
            <ul className="space-y-2 list-disc list-inside text-stone-500">
              <li><strong className="text-stone-600">Essential cookies:</strong> shopping cart, language preference, admin login</li>
              <li><strong className="text-stone-600">Analytics cookies:</strong> website usage tracking (with consent only)</li>
            </ul>
          </>
        ),
      },
      {
        title: '7. Your Rights',
        body: (
          <>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                { t: 'Right of access', d: 'You can request a copy of the data we hold about you.' },
                { t: 'Right to rectification', d: 'You can request correction of inaccurate data.' },
                { t: 'Right to erasure', d: 'You can request deletion of your data unless law requires retention.' },
                { t: 'Right to data portability', d: 'You can receive your data in a machine-readable format.' },
                { t: 'Right to object', d: 'You can object to processing based on legitimate interests.' },
                { t: 'Right to lodge a complaint', d: 'You can file a complaint with the Data Protection Ombudsman (tietosuoja.fi).' },
              ].map((r) => (
                <div key={r.t} className="bg-stone-50 rounded-xl p-4">
                  <p className="font-medium text-stone-700 text-xs mb-1">{r.t}</p>
                  <p className="text-stone-500 text-xs">{r.d}</p>
                </div>
              ))}
            </div>
            <p>Contact us at: <a href="mailto:info@aavafloristi.fi" className="text-rose-500 hover:underline">info@aavafloristi.fi</a>. We will respond within 30 days.</p>
          </>
        ),
      },
      {
        title: '8. Data Security',
        body: <p>Our site uses HTTPS encryption. Access to personal data is restricted to those who need it. In the event of a data breach, we will notify the authorities and affected individuals as required by law.</p>,
      },
      {
        title: '9. Changes to This Policy',
        body: <p>We reserve the right to update this Privacy Policy. We will notify users of significant changes on our website.</p>,
      },
    ],
    linksLabel: { privacy: 'Privacy Policy', terms: 'Terms of Service', faq: 'FAQ' },
    back: '← Back to home',
  },
};

export default function PrivacyPage() {
  const locale = useLocale() as 'fi' | 'en';
  const t = content[locale] ?? content.fi;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{t.badge}</p>
        <LangToggle />
      </div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">{t.title}</h1>
      <p className="text-stone-400 text-sm mb-10">{t.effective}</p>

      <div className="space-y-10 text-stone-600 text-sm leading-relaxed">
        {t.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold text-stone-800 mb-3">{section.title}</h2>
            {section.body}
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-stone-100 flex flex-wrap gap-4 items-center justify-between">
        <Link href="/" className="text-rose-500 hover:text-rose-600 text-sm font-medium">{t.back}</Link>
        <div className="flex gap-4 text-xs text-stone-400">
          <Link href="/terms" className="hover:text-stone-600">{t.linksLabel.terms}</Link>
          <Link href="/faq" className="hover:text-stone-600">{t.linksLabel.faq}</Link>
        </div>
      </div>
    </div>
  );
}
