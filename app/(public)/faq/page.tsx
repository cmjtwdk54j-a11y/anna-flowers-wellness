'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Flower2, Truck, CreditCard, Gift, Hand, ShoppingBag } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  icon: React.ReactNode;
  title: string;
  items: FaqItem[];
}

const categories: FaqCategory[] = [
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: 'Tilaukset',
    items: [
      {
        q: 'Miten teen tilauksen?',
        a: 'Selaa tuotevalikoimaamme Kukat-sivulla, lisää haluamasi tuotteet ostoskoriin ja siirry kassalle. Syötä yhteystietosi ja valitse toimitustapa. Saat tilausvahvistuksen sähköpostiisi heti tilauksen jälkeen.',
      },
      {
        q: 'Voinko muuttaa tai peruuttaa tilaukseni?',
        a: 'Voit peruuttaa tai muuttaa tilaustasi ottamalla yhteyttä meille mahdollisimman pian puhelimitse tai WhatsAppilla numeroon +358 50 123 4567. Peruutus on mahdollista ennen kuin toimitus on aloitettu. Valmisteilla olevia tai jo toimitettuja tilauksia ei voida peruuttaa.',
      },
      {
        q: 'Mistä tiedän, että tilaukseni on vastaanotettu?',
        a: 'Saat automaattisen tilausvahvistuksen sähköpostiisi heti tilauksen tekemisen jälkeen. Sähköposti sisältää tilausnumeron, tilatut tuotteet, hinnan ja toimitustiedot. Jos et saa vahvistusta, tarkista roskapostikansio tai ota yhteyttä meille.',
      },
      {
        q: 'Voiko tilata lahjaksi toiselle henkilölle?',
        a: 'Kyllä! Kassalla voit syöttää vastaanottajan nimen, puhelinnumeron ja toimitusosoitteen erikseen. Voit myös lisätä henkilökohtaisen korttiviestin kimpun mukaan.',
      },
    ],
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: 'Toimitus',
    items: [
      {
        q: 'Minne toimitatte?',
        a: 'Toimitamme kukat Helsinkiin, Espooseen, Vantaalle ja Keravalle. Toimitusalueen ulkopuolelle ei tällä hetkellä toimiteta, mutta nouto myymälästä on aina mahdollista.',
      },
      {
        q: 'Kuinka kauan toimitus kestää?',
        a: 'Tavallisesti toimitus tapahtuu 2–5 tunnin kuluessa tilauksesta. Ennakkotilaukset toimitetaan valitsemassasi ajankohdassa. Suosittelemme tekemään tilauksen hyvissä ajoin erityistilaisuuksia varten.',
      },
      {
        q: 'Paljonko toimitus maksaa?',
        a: 'Toimitusmaksu määräytyy toimitusalueen mukaan. Tarkka hinta näkyy kassalla ennen tilauksen vahvistamista. Nouto myymälästä on aina maksuton.',
      },
      {
        q: 'Voinko valita tarkan toimitusajan?',
        a: 'Kyllä! Kassalla voit valita "Ajoitettu toimitus" -vaihtoehdon ja määrittää haluamasi päivän ja kellonajan. Otamme toiveen huomioon parhaana mahdollisena ajankohtana.',
      },
      {
        q: 'Mitä tapahtuu jos kukaan ei ole kotona vastaanottamassa?',
        a: 'Kuljettaja ottaa yhteyttä puhelimitse ennen toimitusta. Jos vastaanottaja ei ole tavoitettavissa, yritämme jättää kukat naapurille tai turvalliseen paikkaan. Otamme sinuun yhteyttä, jos toimitus ei onnistu.',
      },
    ],
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Maksaminen',
    items: [
      {
        q: 'Mitä maksutapoja hyväksytään?',
        a: 'Hyväksymme pankki- ja luottokortit (Visa, Mastercard), MobilePay sekä Edenred-kulttuurisetelit. Kaikki maksut käsitellään turvallisesti.',
      },
      {
        q: 'Sisältävätkö hinnat ALV:n?',
        a: 'Kyllä, kaikki hinnat sisältävät arvonlisäveron (24%). Hinnoissa ei ole piilomaksuja.',
      },
      {
        q: 'Onko verkkokauppa turvallinen?',
        a: 'Kyllä. Sivustomme käyttää HTTPS-suojausta ja maksut käsitellään turvallisesti. Emme tallenna korttitietoja palvelimillemme.',
      },
    ],
  },
  {
    icon: <Flower2 className="w-5 h-5" />,
    title: 'Kukat ja tuotteet',
    items: [
      {
        q: 'Ovatko kukat tuoreita?',
        a: 'Kyllä! Saamme tuoreita kukkia useita kertoja viikossa suoraan tukusta. Kaikki kukat valitaan huolellisesti laadun varmistamiseksi.',
      },
      {
        q: 'Mitä teen jos kukat ovat vahingoittuneet toimituksessa?',
        a: 'Jos kukat saapuvat vahingoittuneina tai laadulle ei vastaa odotuksia, ota meihin välittömästi yhteyttä valokuvan kanssa. Hyvitämme tai korvaamme tilauksen viivytyksettä.',
      },
      {
        q: 'Voinko tilata tietyn värisiä tai lajisia kukkia?',
        a: 'Voit lisätä toiveen tilauksen yhteydessä "Lisätiedot"-kenttään. Teemme parhaamme toiveidesi toteuttamiseksi, mutta sesongin mukaan kaikkia kukkia ei aina ole saatavilla.',
      },
      {
        q: 'Kuinka kauan kukat kestävät?',
        a: 'Tuoreilla kukilla on normaalisti 5–10 päivän kesto. Pidennät kukkasten ikää pitämällä ne viileässä, vaihtamalla veden päivittäin ja leikkaamalla varsia vinoon säännöllisesti.',
      },
    ],
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: 'Lahjakortit',
    items: [
      {
        q: 'Miten lahjakortti toimii?',
        a: 'Lahjakortin voi ostaa verkkokaupastamme tai myymälästä. Lahjakortti toimitetaan sähköpostitse koodina, jonka voi lunastaa kassalla. Lahjakortti käy sekä kukkiin että päänahkahierontaan.',
      },
      {
        q: 'Kuinka kauan lahjakortti on voimassa?',
        a: 'Lahjakortit ovat voimassa 12 kuukautta ostopäivästä. Voimassaoloa ei voi jatkaa eikä lahjakorttia vaihtaa rahaksi.',
      },
      {
        q: 'Mitä jos lahjakortti katoaa?',
        a: 'Säilytä lahjakortin koodi huolellisesti. Kadonnutta lahjakorttia ei voida korvata. Jos sinulla on ostokuitti, ota yhteyttä meille ja yritämme auttaa.',
      },
    ],
  },
  {
    icon: <Hand className="w-5 h-5" />,
    title: 'Päänahkahieronta',
    items: [
      {
        q: 'Mitä päänahkahieronta on?',
        a: 'Päänahkahieronta on rentouttava hoito, joka stimuloi hiuspohjaa, lievittää jännitystä ja edistää verenkiertoa. Se sopii erinomaisesti stressin lievitykseen ja hyvinvoinnin parantamiseen.',
      },
      {
        q: 'Kuinka kauan hierontaistunto kestää?',
        a: 'Hierontaistunto kestää noin 45–60 minuuttia. Tarkat tiedot löydät Hieronta-sivulta.',
      },
      {
        q: 'Miten varaan hieronta-ajan?',
        a: 'Varaukset tehdään puhelimitse tai WhatsAppilla numeroon +358 50 123 4567. Voit myös ottaa yhteyttä sähköpostitse osoitteeseen info@annaflowers.fi.',
      },
      {
        q: 'Onko hierontaan vasta-aiheita?',
        a: 'Hieronta ei sovi jos sinulla on akuutti infektio, ihottuma päänahan alueella tai äskettäinen leikkaus. Epäselvissä tapauksissa suosittelemme konsultoimaan lääkäriä etukäteen.',
      },
    ],
  },
];

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-stone-100">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left py-4 flex items-start justify-between gap-4 group"
          >
            <span className="text-sm font-medium text-stone-800 group-hover:text-rose-600 transition-colors">
              {item.q}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open === i ? 'rotate-180 text-rose-500' : ''}`}
            />
          </button>
          {open === i && (
            <div className="pb-4 pr-8">
              <p className="text-sm text-stone-500 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-stone-50 to-violet-50 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">Apua & tukea</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-3">Usein kysytyt kysymykset</h1>
          <p className="text-stone-500">
            Löydät vastaukset yleisimpiin kysymyksiin alta. Jos et löydä vastausta, ota rohkeasti yhteyttä.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {categories.map((cat, ci) => (
            <div key={ci} className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-6 py-4 bg-stone-50 border-b border-stone-100">
                <div className="w-8 h-8 bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {cat.icon}
                </div>
                <h2 className="font-semibold text-stone-800">{cat.title}</h2>
              </div>
              <div className="px-6">
                <FaqAccordion items={cat.items} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-stone-50 border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Etkö löytänyt vastausta?</h2>
          <p className="text-stone-500 text-sm mb-6">Olemme täällä auttamassa. Ota yhteyttä puhelimitse, WhatsAppilla tai sähköpostitse.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Ota yhteyttä
            </Link>
            <a
              href="https://wa.me/358501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-rose-500 hover:text-rose-600 text-sm font-medium">
          ← Etusivulle
        </Link>
      </div>
    </div>
  );
}
