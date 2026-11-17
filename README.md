# Crema Lab

Pomocnik parzenia kawy na iPhone'a: jedna strona HTML, bez instalacji i bez serwera.

## Co potrafi

- **6 metod parzenia:** espresso, AeroPress, V60, French press, kawa po turecku, kawiarka Bialetti Venus (indukcja).
- **Timer z animacją parzenia:** strumień „mysi ogonek”, napełnianie filiżanki, szacowana ekstrakcja.
- **Młynki:** 1Zpresso K-Pro (skala 0–10, 10 kliknięć) i Lelit William PL72 (pokrętło 1–10, mielenie na czas, kalibracja g/s).
- **Ekspres Lelit Anna PL41TEM:** manometr 8–12 bar, PID wg stopnia palenia, licznik rozgrzewania, spienianie mleka i uzupełnianie kotła.
- **Alerty:** dźwięk, głos i kolor ekranu na każdym kroku oraz w chwili, gdy trzeba przerwać ekstrakcję.
- **„Prowadź mnie”:** tryb krok po kroku od młynka do filiżanki.
- **Ocena naparu:** konkretne podpowiedzi zmian (mielenie, temperatura, proporcja) i historia 5 ostatnich kaw.
- **Serwis:** przypomnienia o płukaniu, backflushu, odkamienianiu, filtrze i żarnach.

Ustawienia i historia zapisują się lokalnie w przeglądarce (`localStorage`).

## Uruchomienie na iPhonie (GitHub Pages)

1. W repozytorium: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** → Save.
2. Po chwili aplikacja będzie pod adresem `https://auriol-kno.github.io/crema-lab/`.
3. Otwórz ten adres w Safari → **Udostępnij → Do ekranu początkowego**.

Aplikacja otwiera się wtedy na pełnym ekranie, z ikoną filiżanki i bez logowania.

## Pliki

- `index.html`: cała aplikacja (HTML, CSS, JS i ikona w jednym pliku).
