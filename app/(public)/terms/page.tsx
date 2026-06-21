import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Käyttöehdot' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">Oikeudelliset tiedot</p>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Käyttöehdot</h1>
      <p className="text-stone-400 text-sm mb-10">Aavafloristi · Voimassa 1.1.2025 alkaen · Helsinki</p>

      <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">1. Palveluntarjoaja</h2>
          <p>
            <strong className="text-stone-700">Aavafloristi</strong><br />
            Puistolantori 1, 00760 Helsinki, Suomi<br />
            Sähköposti: <a href="mailto:info@annaflowers.fi" className="text-rose-500 hover:underline">info@annaflowers.fi</a><br />
            Puhelin: <a href="tel:+358501234567" className="text-rose-500 hover:underline">+358 50 123 4567</a>
          </p>
          <p className="mt-3">Käyttämällä sivustoamme tai tekemällä tilauksen hyväksyt nämä käyttöehdot kokonaisuudessaan.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">2. Tilaukset</h2>
          <div className="space-y-3">
            <p>
              <strong className="text-stone-700">Tilauksen syntyminen:</strong> Tilaus on sitova, kun olet vastaanottanut
              sähköpostivahvistuksen tilauksestasi. Pidätämme oikeuden kieltäytyä tilauksesta tuotteiden
              saatavuuden tai muun perustellun syyn vuoksi, jolloin ilmoitamme asiasta välittömästi.
            </p>
            <p>
              <strong className="text-stone-700">Muutokset ja peruutukset:</strong> Voit muuttaa tai peruuttaa tilauksesi
              ottamalla yhteyttä meille ennen toimituksen aloittamista. Ota yhteyttä mahdollisimman pian
              puhelimitse tai WhatsAppilla. Valmisteilla olevia tai jo toimitettuja tilauksia ei voida peruuttaa.
            </p>
            <p>
              <strong className="text-stone-700">Lahjatilaukset:</strong> Tilatessasi lahjaksi toiselle henkilölle olet
              vastuussa vastaanottajan yhteystietojen oikeellisuudesta.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">3. Hinnat ja maksaminen</h2>
          <p className="mb-3">Kaikki hinnat sisältävät arvonlisäveron (24%). Hinnat voivat muuttua ilman ennakkoilmoitusta, mutta tilauksen tekemishetkellä voimassa oleva hinta on sitova.</p>
          <div className="bg-stone-50 rounded-xl p-4 mb-3">
            <p className="font-medium text-stone-700 mb-2">Hyväksytyt maksutavat:</p>
            <ul className="space-y-1 list-disc list-inside text-stone-500">
              <li>Pankki- ja luottokortit (Visa, Mastercard)</li>
              <li>MobilePay</li>
              <li>Edenred-kulttuurisetelit</li>
              <li>Lahjakortit</li>
            </ul>
          </div>
          <p>Maksu veloitetaan tilauksen yhteydessä. Emme tallenna korttitietoja palvelimillemme.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">4. Toimitus</h2>
          <div className="space-y-3">
            <p>
              <strong className="text-stone-700">Toimitusalue:</strong> Toimitamme kukat Helsinkiin, Espooseen,
              Vantaalle ja Keravalle. Nouto myymälästä Puistolantori 1, 00760 Helsinki on aina mahdollista.
            </p>
            <p>
              <strong className="text-stone-700">Toimitusaika:</strong> Tavallisesti toimitus tapahtuu 2–5 tunnin
              kuluessa tilauksesta. Ennakkotilaukset toimitetaan valitsemassasi ajankohdassa.
              Toimitusaika on arvio – emme vastaa liikenteen tai muiden ylivoimaisten esteiden aiheuttamista
              viivästyksistä.
            </p>
            <p>
              <strong className="text-stone-700">Toimitusmaksu:</strong> Toimitusmaksu määräytyy toimitusalueen
              mukaan ja näkyy kassalla ennen tilauksen vahvistamista. Nouto on maksuton.
            </p>
            <p>
              <strong className="text-stone-700">Epäonnistunut toimitus:</strong> Jos vastaanottaja ei ole
              tavoitettavissa eikä toimitusta voida suorittaa, yritämme toimittaa tilauksen uudelleen tai
              järjestää noudettavaksi. Lisätoimituksesta voidaan periä erillinen maksu.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">5. Peruutukset ja palautukset</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
            <p className="text-amber-800 text-xs font-medium mb-1">Huomio pilaantuvista tuotteista</p>
            <p className="text-amber-700 text-xs">Kukkatuotteet ovat pilaantuvia ja EU:n kuluttajansuojadirektiivi (2011/83/EU) 16 artiklan mukaan niille ei sovelleta 14 päivän peruuttamisoikeutta.</p>
          </div>
          <div className="space-y-3">
            <p>
              <strong className="text-stone-700">Ennen toimitusta:</strong> Voit peruuttaa tilauksen ottamalla
              yhteyttä meille ennen kuin toimitus on aloitettu. Maksu palautetaan kokonaisuudessaan.
            </p>
            <p>
              <strong className="text-stone-700">Vahingoittunut tuote:</strong> Jos tuote on vahingoittunut
              toimituksen aikana tai ei vastaa tilattua, ota yhteyttä 24 tunnin kuluessa toimituksesta
              valokuvan kanssa. Hyvitämme tai korvaamme tilauksen tapauskohtaisesti.
            </p>
            <p>
              <strong className="text-stone-700">Väärä toimitusosoite:</strong> Jos toimitus epäonnistuu
              virheellisen osoitteen vuoksi, asiakkaan vastuulla on lisätoimitusmaksu.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">6. Lahjakortit</h2>
          <ul className="space-y-2 list-disc list-inside text-stone-500">
            <li>Lahjakortit ovat voimassa <strong className="text-stone-600">12 kuukautta</strong> ostopäivästä</li>
            <li>Niitä ei voi vaihtaa rahaksi eikä voimassaoloa jatkaa</li>
            <li>Kadonnutta lahjakorttia ei korvata — säilytä koodi huolellisesti</li>
            <li>Lahjakortti käy sekä kukkaostoksiin että päänahkahierontaan</li>
            <li>Jos lahjakortin arvo ylittää ostoksen hinnan, erotusta ei palauteta rahana</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">7. Päänahkahieronta</h2>
          <p className="mb-3">
            Hieronta-ajan varaus on sitova. Peruutus tai siirto on tehtävä vähintään
            <strong className="text-stone-700"> 24 tuntia ennen </strong>
            sovittua aikaa, muutoin varaus veloitetaan täysimääräisesti. Myöhästyminen yli 15 minuuttia
            voidaan katsoa peruutukseksi.
          </p>
          <p>
            Hierontaa ei suositella henkilöille, joilla on akuutti infektio, ihottuma päänahan alueella
            tai äskettäinen leikkaus kyseisellä alueella.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">8. Vastuunrajoitus</h2>
          <p className="mb-3">
            Emme vastaa vahingoista, jotka johtuvat ylivoimaisesta esteestä, kuten liikenteen häiriöistä,
            sääolosuhteista tai muista ulkopuolisista tekijöistä. Korvausvastuu rajoittuu enintään
            kyseisen tilauksen arvoon.
          </p>
          <p>
            Emme vastaa välillisistä vahingoista, kuten menetetyistä tuloista tai tilaisuuden
            pilaamisen aiheuttamista haitoista.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">9. Immateriaalioikeudet</h2>
          <p>
            Kaikki sivuston sisältö — kuvat, tekstit, logot ja muotoilu — on Aavafloristin omaisuutta
            tai lisensoitu käytettäväksi. Sisällön kopioiminen tai käyttäminen ilman lupaa on kielletty.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">10. Käyttöehtojen muuttaminen</h2>
          <p>
            Pidätämme oikeuden muuttaa näitä käyttöehtoja. Merkittävistä muutoksista ilmoitamme
            sivustollamme. Tilauksen tekeminen muutosten jälkeen tarkoittaa uusien ehtojen hyväksymistä.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">11. Sovellettava laki ja riitojenratkaisu</h2>
          <p className="mb-3">
            Näihin käyttöehtoihin sovelletaan Suomen lakia. Pyrimme ratkaisemaan mahdolliset
            erimielisyydet ensisijaisesti neuvottelemalla. Jos ratkaisu ei löydy, riidat
            ratkaistaan Helsingin käräjäoikeudessa.
          </p>
          <p>
            Kuluttajana sinulla on myös oikeus viedä asia kuluttajariitalautakuntaan
            (<a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">kuluttajariita.fi</a>)
            tai EU:n verkkovälitteiseen riidanratkaisuun
            (<a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">ec.europa.eu/odr</a>).
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-stone-100 flex flex-wrap gap-4 items-center justify-between">
        <Link href="/" className="text-rose-500 hover:text-rose-600 text-sm font-medium">
          ← Etusivulle
        </Link>
        <div className="flex gap-4 text-xs text-stone-400">
          <Link href="/privacy" className="hover:text-stone-600">Tietosuoja</Link>
          <Link href="/faq" className="hover:text-stone-600">UKK</Link>
        </div>
      </div>
    </div>
  );
}
