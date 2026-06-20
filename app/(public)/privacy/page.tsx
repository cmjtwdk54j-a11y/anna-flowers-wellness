import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function PrivacyPage() {
  const tFooter = useTranslations('footer');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">{tFooter('privacy')}</h1>
      <p className="text-stone-400 text-sm mb-10">Aavafloristi · Helsinki</p>

      <div className="prose prose-stone max-w-none space-y-8 text-stone-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">1. Rekisterinpitäjä</h2>
          <p>Aavafloristi, Puistolantori 1, 00760 Helsinki, Finland. Sähköposti: info@annaflowers.fi</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">2. Kerättävät tiedot</h2>
          <p>
            Keräämme tilauksiin liittyen nimeäsi, sähköpostiosoitettasi, puhelinnumeroasi ja
            toimitusosoitettasi. Yhteystietolomakkeen kautta keräämme nimen, sähköpostin ja viestin sisällön.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">3. Tietojen käyttötarkoitus</h2>
          <p>
            Käytämme tietojasi tilausten käsittelyyn, toimituksen järjestämiseen ja asiakasviestintään.
            Emme myy tai luovuta tietojasi kolmansille osapuolille markkinointitarkoituksiin.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">4. Tietojen säilytysaika</h2>
          <p>
            Säilytämme tilaus- ja asiakastietoja 2 vuotta tilauksen tekemisestä, jonka jälkeen tiedot
            poistetaan järjestelmästämme.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">5. Evästeet</h2>
          <p>
            Käytämme evästeitä ostoskorin toiminnan ylläpitoon ja kielen tallentamiseen.
            Nämä evästeet ovat välttämättömiä sivuston toiminnalle.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">6. Rekisteröidyn oikeudet</h2>
          <p>
            Sinulla on oikeus pyytää pääsy tietoihisi, oikaista virheellisiä tietoja tai pyytää
            tietojesi poistamista. Ota yhteyttä: info@annaflowers.fi
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-3">7. Maksut</h2>
          <p>
            Maksujen käsittelystä vastaa Stripe Inc. Emme tallenna korttitietoja palvelimillemme.
            Lisätietoja: stripe.com/privacy
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
