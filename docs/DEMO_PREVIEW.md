# Crema Lab — podgląd przed publikacją

Stan: wersja testowa z gałęzi `quality/quality-gate-v1`, bez scalania z `main`.

## Podgląd interaktywny z rzeczywistego kodu

**StackBlitz:** https://stackblitz.com/github/Auriol-kno/Crema-Lab/tree/demo-crema-lab?startScript=dev

- Kod pochodzi z gałęzi `demo-crema-lab` (kopii aktualnego PR), a nie z działającej strony produkcyjnej.
- Import publicznego repozytorium uruchamia `npm run dev`. Projekt używa Vite `base: '/Crema-Lab/'`: w panelu podglądu wejdź na `/Crema-Lab/`, jeśli adres główny nie pokaże aplikacji.
- Możesz sprawdzić Palarnia / Kawiarnia / Soft, Polski / English, standard / compact, sześć metod parzenia, timer, młynki i historię.
- To środowisko developerskie, nie stały serwer aplikacji; zależy od możliwości przeglądarki i obsługi WebContainers. Nie używaj go do zapisywania prywatnej historii parzenia ani zdjęć kawy.

## Paczka zbudowanej aplikacji

GitHub Actions `Crema Lab preview package` (tylko PR) buduje Vite z względną ścieżką `--base=./`, a następnie dołącza artefakt `crema-lab-preview`. Nie wykonuje publikacji na GitHub Pages.

Pobierz ZIP w sekcji **Artifacts**:
https://github.com/Auriol-kno/Crema-Lab/actions/workflows/preview-package.yml

Po rozpakowaniu (wymagany serwer HTTP, nie `file://`) można uruchomić go np. w systemie Windows z zainstalowanym Pythonem:

```powershell
cd <folder-z-rozpakowana-paczka>
python -m http.server 8080
```

Otwórz `http://localhost:8080/`. Uwaga: funkcje PWA/service worker iOS wymagają HTTPS, więc localhost na Windowsie nie zastępuje testów iPhone.

## Bezpieczna weryfikacja i odbiór

- Nie scalać PR #11 bez finalnego zielonego CI, niezależnego review i testu na rzeczywistym iPhonie.
- W demo dane zapisują się lokalnie w kontekście danej przeglądarki. Używaj danych testowych i nie traktuj podglądu jako trwałej kopii danych.
- Wydanie pod osobnym stałym adresem wymaga połączenia dostawcy hostingu (np. Vercel) lub odrębnie skonfigurowanej witryny GitHub Pages.
- Obecna strona produkcyjna https://auriol-kno.github.io/Crema-Lab/ pokazuje `main` i **nie jest podglądem zmian z PR #11**.
