import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function TermsPage() {
  const tFooter = useTranslations('footer');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">{tFooter('terms')}</h1>
      <p className="text-stone-400 text-sm mb-10">Aavafloristi · Helsinki</p>

      <div className="prose prose-stone max-w-none space-y-8 text-stone-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">1. Palveluntarjoaja</h2>
          <p>
            Aavafloristi, Puistolantori 1, 00760 Helsinki, Finland. Käyttämällä sivustoamme hyväksyt nämä käyttöehdot.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">2. Tilaukset</h2>
          <p>
            Tilaus on sitova, kun olet saanut tilausvahvistuksen sähköpostiisi.
            Pidätämme oikeuden kieltäytyä tilauksesta tuotteiden saatavuuden tai muun perustellun
            syyn vuoksi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">3. Hinnat ja maksaminen</h2>
          <p>
            Kaikki hinnat sisältävät arvonlisäveron (24%). Maksaminen tapahtuu turvallisesti
            Stripe-maksunvälittäjän kautta. Hyväksytyt maksutavat: pankki- ja luottokortit (Visa, Mastercard),
            MobilePay sekä Edenred-kulttuurisetelit.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">4. Toimitus</h2>
          <p>
            Toimitamme kukat Helsingissä, Espoossa, Vantaalla ja Keravalla. Toimitusaika on
            yleensä 2–5 tuntia tilauksesta. Ennakkotilaukset toimitetaan valittuna ajankohtana.
            Toimitusmaksu määräytyy toimitusalueen mukaan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">5. Peruutukset ja palautukset</h2>
          <p>
            Kukkatuotteet ovat pilaantuvia tuotteita, joten peruutuksia hyväksytään vain ennen
            kuin toimitus on aloitettu. Ota yhteyttä mahdollisimman pian puhelimitse tai WhatsAppilla.
            Jos tuote on vahingoittunut toimituksen aikana, otamme asian välittömästi käsittelyyn.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">6. Lahjakortit</h2>
          <p>
            Lahjakortit ovat voimassa 12 kuukautta ostopäivästä. Niitä ei voi vaihtaa rahaksi.
            Kadonnutta lahjakorttia ei korvata. Lahjakortti voidaan käyttää sekä kukkaostoksiin
            että päänahkahierontaan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">7. Vastuunrajoitus</h2>
          <p>
            Emme vastaa viivästyksistä tai vahingoista, jotka johtuvat ylivoimaisesta esteestä
            (esim. liikenteen häiriöt, sääolosuhteet). Korvausvastuu rajoittuu tilauksen arvoon.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">8. Sovellettava laki</h2>
          <p>
            Näihin käyttöehtoihin sovelletaan Suomen lakia. Mahdolliset riidat ratkaistaan
            Helsingin käräjäoikeudessa.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-stone-100">
        <Link href="/" className="text-rose-500 hover:text-rose-600 text-sm font-medium">
          ← Etusivulle
        </Link>
      </div>
    </div>
  );
}
