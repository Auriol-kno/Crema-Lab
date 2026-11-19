# Crema Lab

Polskojęzyczny pomocnik parzenia kawy na iPhone'a, zbudowany z React, TypeScript i Vite. Sześć metod parzenia, trzy motywy i opcjonalny widok kompaktowy, prowadzenie krok po kroku i timer działający podczas nawigacji między ekranami.

## Ekrany

- **Kawa:** wybór metody, presetu i ścieżki „Prowadź mnie” / „Sam timer”.
- **Parzenie:** duży czas, etap, cel, start/stop, ocena kawy oraz rozwijane etapy i wizualizacja. Ciśnienie i ekstrakcja są symulacją, nie pomiarem z urządzenia.
- **Sprzęt:** osobne zakładki młynków, Lelit Anna i serwisu. K-Pro ma regulację pojedynczym kliknięciem. William zachowuje kalibrację g/s i czas, także gdy inne metody korzystają z K-Pro. Anna zachowuje PID, licznik rozgrzewania i instrukcje obsługi mleka/kotła.
- **Historia:** 100 ostatnich ocenionych kaw (z licznikiem i usuwaniem pojedynczych wpisów) i ponowne użycie ustawień.
- **Baza kaw:** przy ocenie wybierasz jedną z ostatnio pitych kaw albo dopisujesz nową (marka i nazwa) i możesz zrobić zdjęcie opakowania. Zdjęcie jest zmniejszane do miniatury około 320 px i pokazywane w historii. Na ekranie Kawa wybierasz kawę, a aplikacja podpowiada jej najlepiej ocenione ustawienia dla bieżącej metody i ostrzega, gdy danych jest mało. W Historii lista „Twoje kawy” pokazuje liczbę naparów, średnią ocenę i najlepsze ustawienia dla każdej metody, z przyciskiem „Użyj”. Dane są w `cremalab.coffees.v1` i `cremalab.photos.v1` i wchodzą do kopii JSON. Eksport/import kopii JSON przenosi dane między urządzeniami.

Ustawienia zawierają niezależne wybory motywu, gęstości i języka:

- **Palarnia:** domyślny krem i bordo, duże kontrolki.
- **Kawiarnia:** motyw pod ladę kawiarni. W dzień ciepła biel i karmel, w nocy espresso i jasny karmel. Ma matowe szklane karty, pływający pasek kart, zaokrąglone cyfry timera czytelne z odległości i duże przyciski w kształcie pigułek. START jest karmelowy, STOP w kolorze espresso. Dawny motyw Szałwia jest automatycznie zamieniany na Kawiarnię, także przy wczytywaniu starej kopii.
- **Soft:** jasna szarość, zaokrąglenia i delikatny relief inspirowany drugą referencją, z czytelnymi stanami wyboru i fokusu.
- **Tryb Systemowy / Dzień / Noc:** każdy z trzech motywów ma wersję jasną i ciemną; „Systemowy” podąża za ustawieniem iPhone'a i przełącza się na żywo.
- **Standardowy / Kompaktowy:** kompaktowy zmniejsza tekst, odstępy, kafelki i licznik, zachowując główne cele dotykowe minimum 44 px.
- **Polski / English:** nawigacja, instrukcje sześciu metod, sprzęt, alerty (także mowa), historia i kopie danych.

Zmiany działają natychmiast bez restartu timera. Preferencje zapisują się w `cremalab.preferences.v1` i są uwzględniane w kopiach JSON. Starsze kopie nadal można wczytać. Dźwięk, głos i kolor pozostają wyłącznie w ustawieniach. Morski wyróżnia wybór młynka, ochra wybór napoju, a wybrany element ma też widoczny stan, niezależny od koloru.

## Uruchomienie i rozwój

Wymagany Node.js 22 i npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Otwórz adres Vite ze ścieżką `/Crema-Lab/`. Nawigacja wykorzystuje fragment URL (`#timer` itd.), więc odświeżanie działa na GitHub Pages bez reguł przekierowań.

## Publikacja

Strona: https://auriol-kno.github.io/Crema-Lab/

GitHub Pages nadal publikuje `main / (root)`. `npm run build` sprawdza TypeScript, buduje Vite i kopiuje wynik do głównego `index.html`, `assets/`, ikon, `manifest.webmanifest` i `sw.js`. **Nie trzeba już commitować tych plików w PR**: workflow App checks na PR buduje i testuje, a po scaleniu do `main` sam buduje stronę i commituje wynik (`github-actions[bot]`). **Nie edytuj głównego index.html ręcznie**; wejście aplikacji to `app/index.html`.

Aplikacja działa offline (service worker, network-first dla strony, cache dla zasobów), ma manifest do instalacji na ekranie początkowym i prosi przeglądarkę o trwałe przechowywanie danych. W Safari pokazuje jednorazową wskazówkę „Udostępnij → Do ekranu początkowego”, a gdy w historii są co najmniej 3 wpisy i od kopii minęło ponad 21 dni, przypomina o eksporcie.

## Struktura i migracja

- `app/src/App.tsx`: React, typowana nawigacja i niezależne widoki.
- `app/src/Backup.tsx`: eksport/import danych z walidacją i potwierdzeniem zastąpienia.
- `app/src/coffees.ts`: baza kaw (dodawanie bez duplikatów, najlepszy napar, podsumowania, walidacja, miniatury zdjęć) z testami w `tests/coffees.test.mjs`.
- `app/src/advice.ts`: czysta logika porad po ocenie (smak, ciało, czas → zmiana mielenia/proporcji/temperatury), testowana jednostkowo.
- Style są w warstwach CSS (`@layer legacy, app, palarnia, appearance, mode, polish, overrides`): późniejsza warstwa wygrywa bez `!important`. `!important` zostało tylko na `[hidden]`, a `overrides.css` zbiera kilka deklaracji, które muszą wygrywać z każdym motywem. Usunięcie 534 `!important` sprawdzono porównaniem stylów wyliczonych przez przeglądarkę dla każdego elementu w 64 stanach (motywy × tryby × gęstości × ekrany). Różnica wyniosła zero.
- `app/src/bar.css`: motyw Kawiarnia (dzień i noc).
- `app/src/mode.css`, `polish.css`: palety nocne trzech motywów oraz dopracowania układu (przyklejony przycisk startu, dok sterowania, ocena gwiazdkami).
- `app/src/recipes.ts`: typowane definicje metod i ustawienia początkowe.
- `app/src/preferences.ts`: typowane, niezależne preferencje wyglądu, gęstości i języka.
- `app/src/i18n.ts`, `messages.ts`: tłumaczenie w stylu gettext (kluczem jest polska fraza). React używa `t()`. Silnik zapisuje tekst przez `setText`, `setHTML` i `setAttr`, które tłumaczą w chwili zapisu i zapamiętują polskie źródło. Zmiana języka renderuje widoki od nowa, bez MutationObservera.
- `app/src/brewing.js`: zachowany mechanizm parzenia, alertów, sprzętu, historii i animacji z poprzedniej wersji, wydzielony z monolitycznego HTML. Migracja tego silnika do TypeScript pozostaje osobnym zadaniem; jego kontrakt z React jest opisany w `brewing.d.ts`.
- `app/src/screens/*.html`: stałe fragmenty kontrolek silnika, importowane przez Vite. React utrzymuje je zamontowane podczas nawigacji, aby nie tracić odliczania i obsługi zdarzeń. Fragmenty nie pochodzą z plików użytkownika.
- `app/src/app.css`: kompaktowy układ mobilny i nawigacja; `legacy.css`: style zachowanych kontrolek i wizualizacji.

Zachowano klucze localStorage `cremalab.iphone.v3`, `cremalab.iphone.v2` (odczyt migracyjny) i `cremalab.theme`. Aktualizacja pod dotychczasowym adresem zachowuje historię i kalibrację. Aktywne odliczanie przetrwa zmianę ekranu i motywu, ale nie pełne odświeżenie strony.

## Testy

```sh
npx playwright install --with-deps chromium
npm test
```

Przy systemowym Chromium: `CHROMIUM_PATH=/usr/bin/chromium npm test`. Test uruchamia własny serwer preview i wymaga wcześniejszego builda. Obejmuje sześć metod, prowadzenie, timer podczas nawigacji, alerty w ustawieniach, K-Pro, Williama, PID/rozgrzewanie/mleko/serwis, ocenę i historię, eksport/import oraz zachowanie istniejących danych. Układ sprawdzany przy 320, 375, 390 i 430 px w trzech motywach, obu językach i obu gęstościach. Zrzuty trafiają do `test-results/`.

`tests/advice.test.mjs` (jednostkowe porady), `tests/features.cjs` (tryb dzień/noc/systemowy we wszystkich motywach, dok Wznów/Zeruj podczas podglądu, monit oceny, usuwanie wpisu, pominięty alert po uśpieniu karty, manifest i start offline, przycisk startu widoczny bez przewijania przy 375×667).

Pozostaje test na fizycznym iPhonie w Safari, w tym dźwięk/głos, blokada ekranu oraz powrót po zminimalizowaniu aplikacji. Aplikacja nie łączy się z urządzeniami kawowymi i nie potwierdza ich rzeczywistej temperatury ani ciśnienia.

Palarnia zastępuje fotograficzny ekran espresso otwartym układem: duży licznik, pasek postępu, START/STOP 80 px i Zeruj 56 px. Postęp odpowiada upływowi czasu do końca docelowego okna metody, zatrzymuje się podczas pauzy i resetuje do zera. Po przekroczeniu celu pasek pozostaje na 100%, a timer i ostrzeżenia działają dalej. Masa, ciśnienie i ekstrakcja w rozwijanym podglądzie są symulacją. Gdy podgląd jest otwarty i główny przycisk zjedzie poza ekran, nad nawigacją pojawia się dok z czasem, Stop/Wznów i Zeruj. Motyw, gęstość i język są zapamiętywane bez zmiany danych parzenia.
