'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import LangToggle from '@/components/LangToggle';

const content = {
  fi: {
    badge: 'Oikeudelliset tiedot',
    title: 'Käyttöehdot',
    effective: 'Aavafloristi · Voimassa 1.1.2025 alkaen · Helsinki',
    sections: [
      {
        title: '1. Palveluntarjoaja',
        body: (
          <>
            <p><strong className="text-stone-700">Aavafloristi</strong><br />Puistolantori 1, 00760 Helsinki, Suomi<br />
              Sähköposti: <a href="mailto:info@annaflowers.fi" className="text-rose-500 hover:underline">info@annaflowers.fi</a><br />
              Puhelin: <a href="tel:+358413191686" className="text-rose-500 hover:underline">+358 41 319 1686</a>
            </p>
            <p className="mt-3">Käyttämällä sivustoamme tai tekemällä tilauksen hyväksyt nämä käyttöehdot kokonaisuudessaan.</p>
          </>
        ),
      },
      {
        title: '2. Tilaukset',
        body: (
          <div className="space-y-3">
            <p><strong className="text-stone-700">Tilauksen syntyminen:</strong> Tilaus on sitova, kun olet vastaanottanut sähköpostivahvistuksen. Pidätämme oikeuden kieltäytyä tilauksesta tuotteiden saatavuuden tai muun perustellun syyn vuoksi.</p>
            <p><strong className="text-stone-700">Muutokset ja peruutukset:</strong> Voit muuttaa tai peruuttaa tilauksesi ottamalla yhteyttä meille ennen toimituksen aloittamista, puhelimitse tai WhatsAppilla.</p>
            <p><strong className="text-stone-700">Lahjatilaukset:</strong> Tilatessasi lahjaksi toiselle henkilölle olet vastuussa vastaanottajan yhteystietojen oikeellisuudesta.</p>
          </div>
        ),
      },
      {
        title: '3. Hinnat ja maksaminen',
        body: (
          <>
            <p className="mb-3">Kaikki hinnat sisältävät arvonlisäveron (24%). Hinnat voivat muuttua ilman ennakkoilmoitusta.</p>
            <div className="bg-stone-50 rounded-xl p-4 mb-3">
              <p className="font-medium text-stone-700 mb-2">Hyväksytyt maksutavat:</p>
              <ul className="space-y-1 list-disc list-inside text-stone-500">
                <li>Pankki- ja luottokortit (Visa, Mastercard)</li>
                <li>MobilePay</li>
                <li>Edenred-kulttuurisetelit</li>
                <li>Lahjakortit</li>
              </ul>
            </div>
            <p>Emme tallenna korttitietoja palvelimillemme.</p>
          </>
        ),
      },
      {
        title: '4. Toimitus',
        body: (
          <div className="space-y-3">
            <p><strong className="text-stone-700">Toimitusalue:</strong> Toimitamme kukat Helsinkiin, Espooseen, Vantaalle ja Keravalle. Nouto myymälästä on aina mahdollista.</p>
            <p><strong className="text-stone-700">Toimitusaika:</strong> Tavallisesti 2–5 tunnin kuluessa tilauksesta. Emme vastaa liikenteen tai muiden ylivoimaisten esteiden aiheuttamista viivästyksistä.</p>
            <p><strong className="text-stone-700">Toimitusmaksu:</strong> Määräytyy toimitusalueen mukaan ja näkyy kassalla. Nouto on maksuton.</p>
            <p><strong className="text-stone-700">Epäonnistunut toimitus:</strong> Jos vastaanottajaa ei tavoiteta, yritämme toimittaa uudelleen tai järjestää noudettavaksi. Lisätoimituksesta voidaan periä erillinen maksu.</p>
          </div>
        ),
      },
      {
        title: '5. Peruutukset ja palautukset',
        body: (
          <>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
              <p className="text-amber-800 text-xs font-medium mb-1">Huomio pilaantuvista tuotteista</p>
              <p className="text-amber-700 text-xs">EU:n kuluttajansuojadirektiivi (2011/83/EU) 16 artiklan mukaan pilaantuville tuotteille ei sovelleta 14 päivän peruuttamisoikeutta.</p>
            </div>
            <div className="space-y-3">
              <p><strong className="text-stone-700">Ennen toimitusta:</strong> Voit peruuttaa tilauksen ennen toimituksen aloittamista. Maksu palautetaan kokonaisuudessaan.</p>
              <p><strong className="text-stone-700">Vahingoittunut tuote:</strong> Ota yhteyttä 24 tunnin kuluessa toimituksesta valokuvan kanssa. Hyvitämme tai korvaamme tilauksen tapauskohtaisesti.</p>
            </div>
          </>
        ),
      },
      {
        title: '6. Lahjakortit',
        body: (
          <ul className="space-y-2 list-disc list-inside text-stone-500">
            <li>Lahjakortit ovat voimassa <strong className="text-stone-600">12 kuukautta</strong> ostopäivästä</li>
            <li>Niitä ei voi vaihtaa rahaksi eikä voimassaoloa jatkaa</li>
            <li>Kadonnutta lahjakorttia ei korvata</li>
            <li>Lahjakortti käy sekä kukkaostoksiin että päänahkahierontaan</li>
          </ul>
        ),
      },
      {
        title: '7. Päänahkahieronta',
        body: <p>Hieronta-ajan peruutus tai siirto on tehtävä vähintään <strong className="text-stone-700">24 tuntia ennen</strong> sovittua aikaa, muutoin varaus veloitetaan täysimääräisesti. Myöhästyminen yli 15 minuuttia voidaan katsoa peruutukseksi.</p>,
      },
      {
        title: '8. Vastuunrajoitus',
        body: <p>Emme vastaa vahingoista, jotka johtuvat ylivoimaisesta esteestä. Korvausvastuu rajoittuu enintään kyseisen tilauksen arvoon. Emme vastaa välillisistä vahingoista.</p>,
      },
      {
        title: '9. Immateriaalioikeudet',
        body: <p>Kaikki sivuston sisältö — kuvat, tekstit, logot ja muotoilu — on Aavafloristin omaisuutta tai lisensoitu käytettäväksi. Sisällön kopioiminen ilman lupaa on kielletty.</p>,
      },
      {
        title: '10. Käyttöehtojen muuttaminen',
        body: <p>Pidätämme oikeuden muuttaa näitä käyttöehtoja. Merkittävistä muutoksista ilmoitamme sivustollamme.</p>,
      },
      {
        title: '11. Sovellettava laki ja riitojenratkaisu',
        body: (
          <>
            <p className="mb-3">Näihin käyttöehtoihin sovelletaan Suomen lakia. Riidat ratkaistaan Helsingin käräjäoikeudessa.</p>
            <p>Kuluttajana sinulla on myös oikeus viedä asia kuluttajariitalautakuntaan (<a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">kuluttajariita.fi</a>) tai EU:n ODR-alustalle (<a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">ec.europa.eu/odr</a>).</p>
          </>
        ),
      },
    ],
    linksLabel: { privacy: 'Tietosuoja', terms: 'Käyttöehdot', faq: 'UKK' },
    back: '← Etusivulle',
  },
  en: {
    badge: 'Legal information',
    title: 'Terms of Service',
    effective: 'Aavafloristi · Effective 1 January 2025 · Helsinki',
    sections: [
      {
        title: '1. Service Provider',
        body: (
          <>
            <p><strong className="text-stone-700">Aavafloristi</strong><br />Puistolantori 1, 00760 Helsinki, Finland<br />
              Email: <a href="mailto:info@annaflowers.fi" className="text-rose-500 hover:underline">info@annaflowers.fi</a><br />
              Phone: <a href="tel:+358413191686" className="text-rose-500 hover:underline">+358 41 319 1686</a>
            </p>
            <p className="mt-3">By using our website or placing an order, you agree to these Terms of Service in full.</p>
          </>
        ),
      },
      {
        title: '2. Orders',
        body: (
          <div className="space-y-3">
            <p><strong className="text-stone-700">Order confirmation:</strong> An order is binding once you have received an email confirmation. We reserve the right to decline an order due to product unavailability or other justified reason.</p>
            <p><strong className="text-stone-700">Changes and cancellations:</strong> You may change or cancel your order by contacting us before delivery has started, by phone or WhatsApp.</p>
            <p><strong className="text-stone-700">Gift orders:</strong> When ordering as a gift for another person, you are responsible for the accuracy of the recipient's contact details.</p>
          </div>
        ),
      },
      {
        title: '3. Prices and Payment',
        body: (
          <>
            <p className="mb-3">All prices include VAT (24%). Prices may change without prior notice.</p>
            <div className="bg-stone-50 rounded-xl p-4 mb-3">
              <p className="font-medium text-stone-700 mb-2">Accepted payment methods:</p>
              <ul className="space-y-1 list-disc list-inside text-stone-500">
                <li>Debit and credit cards (Visa, Mastercard)</li>
                <li>MobilePay</li>
                <li>Edenred culture vouchers</li>
                <li>Gift cards</li>
              </ul>
            </div>
            <p>We do not store card details on our servers.</p>
          </>
        ),
      },
      {
        title: '4. Delivery',
        body: (
          <div className="space-y-3">
            <p><strong className="text-stone-700">Delivery area:</strong> We deliver to Helsinki, Espoo, Vantaa, and Kerava. In-store pickup is always available.</p>
            <p><strong className="text-stone-700">Delivery time:</strong> Usually within 2–5 hours of the order. We are not liable for delays caused by traffic or other force majeure.</p>
            <p><strong className="text-stone-700">Delivery fee:</strong> Depends on the delivery area and is shown at checkout. Pickup is free.</p>
            <p><strong className="text-stone-700">Failed delivery:</strong> If the recipient cannot be reached, we will attempt redelivery or arrange pickup. An additional delivery fee may apply.</p>
          </div>
        ),
      },
      {
        title: '5. Cancellations and Returns',
        body: (
          <>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
              <p className="text-amber-800 text-xs font-medium mb-1">Note on perishable goods</p>
              <p className="text-amber-700 text-xs">Under EU Consumer Rights Directive (2011/83/EU) Art. 16, the 14-day right of withdrawal does not apply to perishable goods such as flowers.</p>
            </div>
            <div className="space-y-3">
              <p><strong className="text-stone-700">Before delivery:</strong> You may cancel before delivery has started. A full refund will be issued.</p>
              <p><strong className="text-stone-700">Damaged goods:</strong> Contact us within 24 hours of delivery with a photo. We will refund or replace on a case-by-case basis.</p>
            </div>
          </>
        ),
      },
      {
        title: '6. Gift Cards',
        body: (
          <ul className="space-y-2 list-disc list-inside text-stone-500">
            <li>Gift cards are valid for <strong className="text-stone-600">12 months</strong> from the date of purchase</li>
            <li>They cannot be exchanged for cash or extended</li>
            <li>Lost gift cards cannot be replaced</li>
            <li>Usable for both flowers and head massage</li>
          </ul>
        ),
      },
      {
        title: '7. Head Massage',
        body: <p>Cancellation or rescheduling must be made at least <strong className="text-stone-700">24 hours before</strong> the appointment, otherwise the full fee will be charged. Arriving more than 15 minutes late may be treated as a cancellation.</p>,
      },
      {
        title: '8. Limitation of Liability',
        body: <p>We are not liable for damages caused by force majeure. Our liability is limited to the value of the specific order. We are not liable for indirect or consequential damages.</p>,
      },
      {
        title: '9. Intellectual Property',
        body: <p>All website content — images, text, logos, and design — is owned by or licensed to Aavafloristi. Copying or using content without permission is prohibited.</p>,
      },
      {
        title: '10. Changes to Terms',
        body: <p>We reserve the right to update these Terms. We will notify users of significant changes on our website.</p>,
      },
      {
        title: '11. Governing Law and Disputes',
        body: (
          <>
            <p className="mb-3">These Terms are governed by Finnish law. Disputes shall be settled in the District Court of Helsinki.</p>
            <p>As a consumer, you also have the right to refer the matter to the Consumer Disputes Board (<a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">kuluttajariita.fi</a>) or the EU ODR platform (<a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">ec.europa.eu/odr</a>).</p>
          </>
        ),
      },
    ],
    linksLabel: { privacy: 'Privacy Policy', terms: 'Terms of Service', faq: 'FAQ' },
    back: '← Back to home',
  },
};

export default function TermsPage() {
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
          <Link href="/privacy" className="hover:text-stone-600">{t.linksLabel.privacy}</Link>
          <Link href="/faq" className="hover:text-stone-600">{t.linksLabel.faq}</Link>
        </div>
      </div>
    </div>
  );
}
