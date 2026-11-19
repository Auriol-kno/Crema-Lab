# Crema Lab

Polskojęzyczny pomocnik parzenia kawy na iPhone'a, zbudowany z React, TypeScript i Vite. Sześć metod parzenia, trzy motywy i opcjonalny widok kompaktowy, prowadzenie krok po kroku i timer działający podczas nawigacji między ekranami.

## Ekrany

- **Kawa:** wybór metody, presetu i ścieżki „Prowadź mnie” / „Sam timer”.
- **Parzenie:** duży czas, etap, cel, start/stop, ocena kawy oraz rozwijane etapy i wizualizacja. Ciśnienie i ekstrakcja są symulacją, nie pomiarem z urządzenia.
- **Sprzęt:** osobne zakładki młynków, Lelit Anna i serwisu. K-Pro ma regulację pojedynczym kliknięciem. William zachowuje kalibrację g/s i czas, także gdy inne metody korzystają z K-Pro. Anna zachowuje PID, licznik rozgrzewania i instrukcje obsługi mleka/kotła.
- **Historia:** pięć ostatnich ocenionych kaw i ponowne użycie ustawień. Eksport/import kopii JSON przenosi dane między urządzeniami.

Ustawienia zawierają niezależne wybory motywu, gęstości i języka:

- **Palarnia:** domyślny krem i bordo, duże kontrolki.
- **Szałwia:** jasne szałwiowe tło, cienkie obrysy i typografia techniczna inspirowana pierwszą referencją.
- **Soft:** jasna szarość, zaokrąglenia i delikatny relief inspirowany drugą referencją, z czytelnymi stanami wyboru i fokusu.
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

GitHub Pages nadal publikuje `main / (root)`. `npm run build` sprawdza TypeScript, buduje Vite i kopiuje wynik do głównego `index.html`, `assets/` i `icon.png`. Te wygenerowane pliki należy commitować razem ze źródłami. **Nie edytuj głównego index.html ręcznie**; wejście aplikacji to `app/index.html`. Workflow App checks sprawdza, czy wynik builda odpowiada źródłom, i uruchamia testy przeglądarkowe.

## Struktura i migracja

- `app/src/App.tsx`: React, typowana nawigacja i niezależne widoki.
- `app/src/Backup.tsx`: eksport/import danych z walidacją i potwierdzeniem zastąpienia.
- `app/src/recipes.ts`: typowane definicje metod i ustawienia początkowe.
- `app/src/preferences.ts`: typowane, niezależne preferencje wyglądu, gęstości i języka.
- `app/src/i18n.ts`, `messages.ts`: lokalizacja tekstu i etykiet dostępności na granicy DOM istniejącego silnika; nie zastępuje kontrolek ani ich zdarzeń. Oryginalne polskie dane historii nie są nadpisywane przez tłumaczenie.
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

Pozostaje test na fizycznym iPhonie w Safari, w tym dźwięk/głos, blokada ekranu oraz powrót po zminimalizowaniu aplikacji. Aplikacja nie łączy się z urządzeniami kawowymi i nie potwierdza ich rzeczywistej temperatury ani ciśnienia.

Palarnia zastępuje fotograficzny ekran espresso otwartym układem: duży licznik, pasek postępu, START/STOP 80 px i Zeruj 56 px. Postęp odpowiada upływowi czasu do końca docelowego okna metody, zatrzymuje się podczas pauzy i resetuje do zera. Po przekroczeniu celu pasek pozostaje na 100%, a timer i ostrzeżenia działają dalej. Masa, ciśnienie i ekstrakcja w rozwijanym podglądzie są symulacją. Motyw, gęstość i język są zapamiętywane bez zmiany danych parzenia.
