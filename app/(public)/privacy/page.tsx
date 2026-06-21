import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Tietosuojaseloste' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">Oikeudelliset tiedot</p>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Tietosuojaseloste</h1>
      <p className="text-stone-400 text-sm mb-10">Aavafloristi · Voimassa 1.1.2025 alkaen · Helsinki</p>

      <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">1. Rekisterinpitäjä</h2>
          <p>
            <strong className="text-stone-700">Aavafloristi</strong><br />
            Puistolantori 1, 00760 Helsinki, Suomi<br />
            Sähköposti: <a href="mailto:info@annaflowers.fi" className="text-rose-500 hover:underline">info@annaflowers.fi</a><br />
            Puhelin: <a href="tel:+358501234567" className="text-rose-500 hover:underline">+358 50 123 4567</a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">2. Kerättävät henkilötiedot</h2>
          <p className="mb-3">Keräämme seuraavia henkilötietoja palveluidemme tarjoamiseksi:</p>
          <ul className="space-y-2 list-disc list-inside text-stone-500">
            <li><strong className="text-stone-600">Yhteystiedot:</strong> nimi, sähköpostiosoite, puhelinnumero</li>
            <li><strong className="text-stone-600">Toimitusosoite:</strong> katuosoite, postinumero ja kaupunki</li>
            <li><strong className="text-stone-600">Tilaukset:</strong> tilatut tuotteet, hinnat, toimitustapa ja tilauksen ajankohta</li>
            <li><strong className="text-stone-600">Viestit:</strong> yhteydenottolomakkeen kautta lähetetyt viestit</li>
            <li><strong className="text-stone-600">Tekniset tiedot:</strong> selain, IP-osoite ja evästeet teknistä toimintaa varten</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">3. Tietojen käyttötarkoitus ja oikeusperuste</h2>
          <div className="space-y-3">
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-1">Tilausten käsittely</p>
              <p className="text-stone-500">Käytämme tietojasi tilausten vastaanottamiseen, toimituksen järjestämiseen ja tilausvahvistusten lähettämiseen. Oikeusperuste: sopimuksen täyttäminen (GDPR 6 art. 1 b).</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-1">Asiakaspalvelu</p>
              <p className="text-stone-500">Käytämme tietojasi yhteydenottoihin vastaamiseen ja reklamaatioiden käsittelyyn. Oikeusperuste: oikeutettu etu (GDPR 6 art. 1 f).</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-1">Lakisääteiset velvollisuudet</p>
              <p className="text-stone-500">Säilytämme kirjanpitolainsäädännön edellyttämät tiedot. Oikeusperuste: lakisääteinen velvollisuus (GDPR 6 art. 1 c).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">4. Tietojen jakaminen</h2>
          <p className="mb-3">Emme myy tai luovuta henkilötietojasi kolmansille osapuolille markkinointitarkoituksiin. Käytämme seuraavia alihankkijoita palvelun tuottamiseen:</p>
          <ul className="space-y-2 list-disc list-inside text-stone-500">
            <li><strong className="text-stone-600">Resend</strong> — sähköpostien toimitus (tilausvahvistukset). Tietosuoja: resend.com/privacy</li>
            <li><strong className="text-stone-600">Vercel</strong> — web-hosting. Tietosuoja: vercel.com/legal/privacy-policy</li>
            <li><strong className="text-stone-600">Neon / PostgreSQL</strong> — tietokannan tallennus EU-alueella</li>
          </ul>
          <p className="mt-3">Viranomaisille luovutamme tietoja vain lain niin edellyttäessä.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">5. Tietojen säilytysaika</h2>
          <ul className="space-y-2 list-disc list-inside text-stone-500">
            <li><strong className="text-stone-600">Tilaukset ja asiakastiedot:</strong> 2 vuotta viimeisestä tilauksesta</li>
            <li><strong className="text-stone-600">Kirjanpitoaineisto:</strong> 6 vuotta (kirjanpitolaki)</li>
            <li><strong className="text-stone-600">Yhteydenottoviestit:</strong> 1 vuosi viestin lähettämisestä</li>
          </ul>
          <p className="mt-3">Tietojen säilytysajan päätyttyä tiedot poistetaan tai anonymisoidaan.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">6. Evästeet</h2>
          <p className="mb-3">Käytämme evästeitä seuraaviin tarkoituksiin:</p>
          <ul className="space-y-2 list-disc list-inside text-stone-500">
            <li><strong className="text-stone-600">Välttämättömät evästeet:</strong> ostoskorin toiminta, kielen tallennus, kirjautuminen admin-paneeliin</li>
            <li><strong className="text-stone-600">Analytiikkaevästeet:</strong> sivuston käytön seuranta (vain suostumuksella)</li>
          </ul>
          <p className="mt-3">Voit hallita evästeasetuksia selaimesi asetuksista tai sivuston cookie-bannerista.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">7. Rekisteröidyn oikeudet</h2>
          <p className="mb-3">Sinulla on seuraavat oikeudet henkilötietoihisi:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'Oikeus tutustua tietoihin', desc: 'Voit pyytää kopiota tallentamistamme tiedoistasi.' },
              { title: 'Oikeus oikaista tietoja', desc: 'Voit pyytää virheellisten tietojen korjaamista.' },
              { title: 'Oikeus poistaa tiedot', desc: 'Voit pyytää tietojesi poistamista, ellei laki edellytä säilyttämistä.' },
              { title: 'Oikeus siirtää tiedot', desc: 'Voit saada tietosi koneluettavassa muodossa.' },
              { title: 'Oikeus vastustaa käsittelyä', desc: 'Voit vastustaa tietojesi käsittelyä oikeutetun edun perusteella.' },
              { title: 'Oikeus tehdä valitus', desc: 'Voit tehdä valituksen tietosuojavaltuutetulle (tietosuoja.fi).' },
            ].map((right) => (
              <div key={right.title} className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 text-xs mb-1">{right.title}</p>
                <p className="text-stone-500 text-xs">{right.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">Oikeuksien käyttämiseksi ota yhteyttä: <a href="mailto:info@annaflowers.fi" className="text-rose-500 hover:underline">info@annaflowers.fi</a>. Vastaamme 30 päivän kuluessa.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">8. Tietoturva</h2>
          <p>
            Suojaamme henkilötietosi asianmukaisin teknisin ja organisatorisin toimenpitein.
            Sivustomme käyttää HTTPS-suojausta. Pääsy henkilötietoihin on rajattu vain niitä
            tarvitseville henkilöille. Tietomurron tapahtuessa ilmoitamme asiasta viranomaisille
            ja asianomaisille henkilöille lain edellyttämällä tavalla.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">9. Muutokset tietosuojaselosteeseen</h2>
          <p>
            Pidätämme oikeuden päivittää tätä tietosuojaselostetta. Merkittävistä muutoksista
            ilmoitamme sivustollamme. Uusin versio on aina saatavilla tällä sivulla.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-stone-100 flex flex-wrap gap-4 items-center justify-between">
        <Link href="/" className="text-rose-500 hover:text-rose-600 text-sm font-medium">
          ← Etusivulle
        </Link>
        <div className="flex gap-4 text-xs text-stone-400">
          <Link href="/terms" className="hover:text-stone-600">Käyttöehdot</Link>
          <Link href="/faq" className="hover:text-stone-600">UKK</Link>
        </div>
      </div>
    </div>
  );
}
