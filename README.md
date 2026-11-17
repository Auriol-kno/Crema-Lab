# Crema Lab

Polskojęzyczny pomocnik parzenia kawy na iPhone'a, zbudowany z React, TypeScript i Vite. Sześć metod parzenia, trzy motywy, prowadzenie krok po kroku i timer działający podczas nawigacji między ekranami.

## Ekrany

- **Kawa:** wybór metody, presetu i ścieżki „Prowadź mnie” / „Sam timer”.
- **Parzenie:** duży czas, etap, cel, start/stop, ocena kawy oraz rozwijane etapy i wizualizacja. Ciśnienie i ekstrakcja są symulacją, nie pomiarem z urządzenia.
- **Sprzęt:** osobne zakładki młynków, Lelit Anna i serwisu. K-Pro ma regulację pojedynczym kliknięciem. William zachowuje kalibrację g/s i czas, także gdy inne metody korzystają z K-Pro. Anna zachowuje PID, licznik rozgrzewania i instrukcje obsługi mleka/kotła.
- **Historia:** pięć ostatnich ocenionych kaw i ponowne użycie ustawień. Eksport/import kopii JSON przenosi dane między urządzeniami.

Ustawienia → Motyw aplikacji: Jasna kawiarnia (domyślny), Espresso Bar, Studio ekstrakcji. Zmiana motywu i ekranu nie resetuje timera.

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
- `app/src/theme.ts`: typowane motywy i ich trwały zapis.
- `app/src/brewing.js`: zachowany mechanizm parzenia, alertów, sprzętu, historii i animacji z poprzedniej wersji, wydzielony z monolitycznego HTML. Migracja tego silnika do TypeScript pozostaje osobnym zadaniem; jego kontrakt z React jest opisany w `brewing.d.ts`.
- `app/src/screens/*.html`: stałe fragmenty kontrolek silnika, importowane przez Vite. React utrzymuje je zamontowane podczas nawigacji, aby nie tracić odliczania i obsługi zdarzeń. Fragmenty nie pochodzą z plików użytkownika.
- `app/src/app.css`: kompaktowy układ mobilny i nawigacja; `legacy.css`: style zachowanych kontrolek i wizualizacji.

Zachowano klucze localStorage `cremalab.iphone.v3`, `cremalab.iphone.v2` (odczyt migracyjny) i `cremalab.theme`. Aktualizacja pod dotychczasowym adresem zachowuje historię i kalibrację. Aktywne odliczanie przetrwa zmianę ekranu i motywu, ale nie pełne odświeżenie strony.

## Testy

```sh
npx playwright install --with-deps chromium
npm test
```

Przy systemowym Chromium: `CHROMIUM_PATH=/usr/bin/chromium npm test`. Test uruchamia własny serwer preview i wymaga wcześniejszego builda. Obejmuje sześć metod, prowadzenie, timer podczas nawigacji, motywy, K-Pro, Williama, PID/rozgrzewanie/mleko/serwis, ocenę i historię, eksport/import oraz zachowanie istniejących danych. Układ sprawdzany przy 320, 375, 390 i 430 px w trzech motywach. Zrzuty trafiają do `test-results/`.

Pozostaje test na fizycznym iPhonie w Safari, w tym dźwięk/głos, blokada ekranu oraz powrót po zminimalizowaniu aplikacji. Aplikacja nie łączy się z urządzeniami kawowymi i nie potwierdza ich rzeczywistej temperatury ani ciśnienia.
