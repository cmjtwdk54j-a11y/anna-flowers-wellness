'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ChevronDown, Flower2, Truck, CreditCard, Gift, Hand, ShoppingBag } from 'lucide-react';
import LangToggle from '@/components/LangToggle';

interface FaqItem { q: string; a: string; }
interface FaqCategory { icon: React.ReactNode; title: string; items: FaqItem[]; }

const content = {
  fi: {
    badge: 'Apua & tukea',
    title: 'Usein kysytyt kysymykset',
    subtitle: 'Löydät vastaukset yleisimpiin kysymyksiin alta. Jos et löydä vastausta, ota rohkeasti yhteyttä.',
    notFound: 'Etkö löytänyt vastausta?',
    notFoundDesc: 'Olemme täällä auttamassa. Ota yhteyttä puhelimitse, WhatsAppilla tai sähköpostitse.',
    contact: 'Ota yhteyttä',
    back: '← Etusivulle',
    categories: [
      {
        title: 'Tilaukset',
        items: [
          { q: 'Miten teen tilauksen?', a: 'Selaa tuotevalikoimaamme Kukat-sivulla, lisää haluamasi tuotteet ostoskoriin ja siirry kassalle. Syötä yhteystietosi ja valitse toimitustapa. Saat tilausvahvistuksen sähköpostiisi heti tilauksen jälkeen.' },
          { q: 'Voinko muuttaa tai peruuttaa tilaukseni?', a: 'Voit peruuttaa tai muuttaa tilaustasi ottamalla yhteyttä meille mahdollisimman pian puhelimitse tai WhatsAppilla numeroon +358 50 123 4567. Peruutus on mahdollista ennen kuin toimitus on aloitettu.' },
          { q: 'Mistä tiedän, että tilaukseni on vastaanotettu?', a: 'Saat automaattisen tilausvahvistuksen sähköpostiisi heti tilauksen tekemisen jälkeen. Sähköposti sisältää tilausnumeron, tilatut tuotteet, hinnan ja toimitustiedot.' },
          { q: 'Voiko tilata lahjaksi toiselle henkilölle?', a: 'Kyllä! Kassalla voit syöttää vastaanottajan nimen, puhelinnumeron ja toimitusosoitteen erikseen. Voit myös lisätä henkilökohtaisen korttiviestin kimpun mukaan.' },
        ],
      },
      {
        title: 'Toimitus',
        items: [
          { q: 'Minne toimitatte?', a: 'Toimitamme kukat Helsinkiin, Espooseen, Vantaalle ja Keravalle. Nouto myymälästä on aina mahdollista.' },
          { q: 'Kuinka kauan toimitus kestää?', a: 'Tavallisesti toimitus tapahtuu 2–5 tunnin kuluessa tilauksesta. Ennakkotilaukset toimitetaan valitsemassasi ajankohdassa.' },
          { q: 'Paljonko toimitus maksaa?', a: 'Toimitusmaksu määräytyy toimitusalueen mukaan. Tarkka hinta näkyy kassalla ennen tilauksen vahvistamista. Nouto myymälästä on maksuton.' },
          { q: 'Voinko valita tarkan toimitusajan?', a: 'Kyllä! Kassalla voit valita "Ajoitettu toimitus" -vaihtoehdon ja määrittää haluamasi päivän ja kellonajan.' },
          { q: 'Mitä tapahtuu jos kukaan ei ole kotona vastaanottamassa?', a: 'Kuljettaja ottaa yhteyttä puhelimitse ennen toimitusta. Jos vastaanottaja ei ole tavoitettavissa, yritämme jättää kukat turvalliseen paikkaan. Otamme sinuun yhteyttä, jos toimitus ei onnistu.' },
        ],
      },
      {
        title: 'Maksaminen',
        items: [
          { q: 'Mitä maksutapoja hyväksytään?', a: 'Hyväksymme pankki- ja luottokortit (Visa, Mastercard), MobilePay sekä Edenred-kulttuurisetelit. Kaikki maksut käsitellään turvallisesti.' },
          { q: 'Sisältävätkö hinnat ALV:n?', a: 'Kyllä, kaikki hinnat sisältävät arvonlisäveron (24%). Hinnoissa ei ole piilomaksuja.' },
          { q: 'Onko verkkokauppa turvallinen?', a: 'Kyllä. Sivustomme käyttää HTTPS-suojausta. Emme tallenna korttitietoja palvelimillemme.' },
        ],
      },
      {
        title: 'Kukat ja tuotteet',
        items: [
          { q: 'Ovatko kukat tuoreita?', a: 'Kyllä! Saamme tuoreita kukkia useita kertoja viikossa suoraan tukusta. Kaikki kukat valitaan huolellisesti laadun varmistamiseksi.' },
          { q: 'Mitä teen jos kukat ovat vahingoittuneet toimituksessa?', a: 'Jos kukat saapuvat vahingoittuneina, ota meihin välittömästi yhteyttä valokuvan kanssa. Hyvitämme tai korvaamme tilauksen viivytyksettä.' },
          { q: 'Voinko tilata tietyn värisiä tai lajisia kukkia?', a: 'Voit lisätä toiveen tilauksen yhteydessä "Lisätiedot"-kenttään. Teemme parhaamme toiveidesi toteuttamiseksi.' },
          { q: 'Kuinka kauan kukat kestävät?', a: 'Tuoreilla kukilla on normaalisti 5–10 päivän kesto. Pidennät kukkasten ikää pitämällä ne viileässä, vaihtamalla veden päivittäin ja leikkaamalla varsia.' },
        ],
      },
      {
        title: 'Lahjakortit',
        items: [
          { q: 'Miten lahjakortti toimii?', a: 'Lahjakortin voi ostaa verkkokaupastamme tai myymälästä. Lahjakortti toimitetaan sähköpostitse koodina, jonka voi lunastaa kassalla. Se käy sekä kukkiin että päänahkahierontaan.' },
          { q: 'Kuinka kauan lahjakortti on voimassa?', a: 'Lahjakortit ovat voimassa 12 kuukautta ostopäivästä. Voimassaoloa ei voi jatkaa eikä lahjakorttia vaihtaa rahaksi.' },
          { q: 'Mitä jos lahjakortti katoaa?', a: 'Säilytä lahjakortin koodi huolellisesti. Kadonnutta lahjakorttia ei voida korvata.' },
        ],
      },
      {
        title: 'Päänahkahieronta',
        items: [
          { q: 'Mitä päänahkahieronta on?', a: 'Päänahkahieronta on rentouttava hoito, joka stimuloi hiuspohjaa, lievittää jännitystä ja edistää verenkiertoa. Se sopii erinomaisesti stressin lievitykseen.' },
          { q: 'Kuinka kauan hierontaistunto kestää?', a: 'Hierontaistunto kestää noin 45–60 minuuttia.' },
          { q: 'Miten varaan hieronta-ajan?', a: 'Varaukset tehdään puhelimitse tai WhatsAppilla numeroon +358 50 123 4567 tai sähköpostitse info@annaflowers.fi.' },
          { q: 'Onko hierontaan vasta-aiheita?', a: 'Hieronta ei sovi jos sinulla on akuutti infektio, ihottuma päänahan alueella tai äskettäinen leikkaus. Epäselvissä tapauksissa suosittelemme konsultoimaan lääkäriä.' },
        ],
      },
    ],
  },
  en: {
    badge: 'Help & Support',
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to the most common questions below. If you can\'t find what you\'re looking for, feel free to contact us.',
    notFound: 'Didn\'t find an answer?',
    notFoundDesc: 'We\'re here to help. Reach us by phone, WhatsApp, or email.',
    contact: 'Contact us',
    back: '← Back to home',
    categories: [
      {
        title: 'Orders',
        items: [
          { q: 'How do I place an order?', a: 'Browse our selection on the Flowers page, add items to your cart and proceed to checkout. Enter your details and choose a delivery method. You\'ll receive an order confirmation email immediately after placing your order.' },
          { q: 'Can I change or cancel my order?', a: 'You can cancel or modify your order by contacting us as soon as possible by phone or WhatsApp at +358 50 123 4567. Cancellation is possible before the delivery has started.' },
          { q: 'How do I know my order was received?', a: 'You\'ll receive an automatic order confirmation email right after placing your order. It includes the order number, items ordered, price, and delivery details.' },
          { q: 'Can I order as a gift for someone else?', a: 'Absolutely! At checkout you can enter the recipient\'s name, phone number, and delivery address separately. You can also add a personal card message with the bouquet.' },
        ],
      },
      {
        title: 'Delivery',
        items: [
          { q: 'Where do you deliver?', a: 'We deliver flowers to Helsinki, Espoo, Vantaa, and Kerava. In-store pickup at Puistolantori 1 is always available.' },
          { q: 'How long does delivery take?', a: 'Usually delivery takes place within 2–5 hours of placing the order. Pre-orders are delivered at the time you choose.' },
          { q: 'How much does delivery cost?', a: 'The delivery fee depends on the delivery area. The exact price is shown at checkout before confirming your order. In-store pickup is always free.' },
          { q: 'Can I choose a specific delivery time?', a: 'Yes! At checkout you can select "Scheduled delivery" and specify your preferred date and time.' },
          { q: 'What if no one is home to receive the delivery?', a: 'The driver will call before delivering. If the recipient is unavailable, we\'ll try to leave the flowers in a safe location. We\'ll contact you if delivery is not possible.' },
        ],
      },
      {
        title: 'Payment',
        items: [
          { q: 'What payment methods do you accept?', a: 'We accept debit and credit cards (Visa, Mastercard), MobilePay, and Edenred culture vouchers. All payments are processed securely.' },
          { q: 'Do prices include VAT?', a: 'Yes, all prices include VAT (24%). There are no hidden fees.' },
          { q: 'Is the online shop secure?', a: 'Yes. Our site uses HTTPS encryption. We do not store card details on our servers.' },
        ],
      },
      {
        title: 'Flowers & Products',
        items: [
          { q: 'Are the flowers fresh?', a: 'Absolutely! We receive fresh flowers several times a week directly from the wholesaler. All flowers are carefully selected to ensure quality.' },
          { q: 'What if my flowers arrive damaged?', a: 'If flowers arrive damaged, contact us immediately with a photo. We\'ll refund or replace your order without delay.' },
          { q: 'Can I request specific flower types or colours?', a: 'You can add a note in the "Additional information" field when ordering. We\'ll do our best to fulfil your wishes, though availability depends on the season.' },
          { q: 'How long will the flowers last?', a: 'Fresh flowers typically last 5–10 days. Keep them cool, change the water daily, and trim the stems at an angle to extend their life.' },
        ],
      },
      {
        title: 'Gift Cards',
        items: [
          { q: 'How do gift cards work?', a: 'Gift cards can be purchased in our online shop or in-store. The gift card is delivered by email as a code that can be redeemed at checkout. It can be used for both flowers and head massage.' },
          { q: 'How long is a gift card valid?', a: 'Gift cards are valid for 12 months from the date of purchase. The validity cannot be extended and gift cards cannot be exchanged for cash.' },
          { q: 'What if a gift card is lost?', a: 'Please keep the gift card code safe. Lost gift cards cannot be replaced.' },
        ],
      },
      {
        title: 'Head Massage',
        items: [
          { q: 'What is head massage?', a: 'Head massage is a relaxing treatment that stimulates the scalp, relieves tension, and promotes blood circulation. It\'s excellent for stress relief and overall well-being.' },
          { q: 'How long is a massage session?', a: 'A massage session lasts approximately 45–60 minutes.' },
          { q: 'How do I book a massage?', a: 'Bookings are made by phone or WhatsApp at +358 50 123 4567, or by email at info@annaflowers.fi.' },
          { q: 'Are there any contraindications for massage?', a: 'Massage is not recommended for those with an acute infection, scalp rash, or recent surgery in that area. If in doubt, we recommend consulting a doctor first.' },
        ],
      },
    ],
  },
};

const icons = [
  <ShoppingBag className="w-5 h-5" />,
  <Truck className="w-5 h-5" />,
  <CreditCard className="w-5 h-5" />,
  <Flower2 className="w-5 h-5" />,
  <Gift className="w-5 h-5" />,
  <Hand className="w-5 h-5" />,
];

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-pink-50">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left py-4 flex items-start justify-between gap-4 group"
          >
            <span className="text-sm font-medium text-gray-800 group-hover:text-burgundy transition-colors">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open === i ? 'rotate-180 text-burgundy' : ''}`} />
          </button>
          {open === i && (
            <div className="pb-4 pr-8">
              <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const locale = useLocale() as 'fi' | 'en';
  const t = content[locale] ?? content.fi;

  return (
    <div>
      <section className="bg-gradient-to-br from-[#fdf2f5] via-white to-[#f5f0ed] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-accent-pink uppercase tracking-widest">{t.badge}</p>
            <LangToggle />
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif text-4xl font-medium mb-3">{t.title}</h1>
          <p className="text-stone-500">{t.subtitle}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {t.categories.map((cat, ci) => (
            <div key={ci} className="bg-white border border-pink-100 rounded-[28px] overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-6 py-4 bg-soft-pink border-b border-pink-100">
                <div className="w-8 h-8 bg-soft-pink text-accent-pink rounded-lg flex items-center justify-center flex-shrink-0">
                  {icons[ci]}
                </div>
                <h2 className="font-serif text-xl text-burgundy">{cat.title}</h2>
              </div>
              <div className="px-6">
                <FaqAccordion items={cat.items} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 border-t border-pink-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg font-serif text-xl text-burgundy mb-2">{t.notFound}</h2>
          <p className="text-gray-500 text-sm mb-6">{t.notFoundDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy/90 text-white font-bold px-8 py-3 rounded-full uppercase tracking-widest text-xs transition-colors text-sm">
              {t.contact}
            </Link>
            <a href="https://wa.me/358501234567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-burgundy text-burgundy hover:bg-soft-pink font-bold px-8 py-3 rounded-full uppercase tracking-widest text-xs transition-colors text-sm">
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-burgundy hover:text-burgundy/80 text-sm font-bold uppercase tracking-widest">{t.back}</Link>
      </div>
    </div>
  );
}
