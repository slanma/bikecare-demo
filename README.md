# BikeCare – funkční demo příjmu cykloservisu

Online repozitář: <https://github.com/slanma/bikecare-demo>

Samostatné demo bez instalace závislostí. Data se ukládají lokálně v prohlížeči.

## Spuštění

V této složce spusťte:

```bash
python3 -m http.server 4173
```

Potom otevřete `http://localhost:4173`.

## Co lze vyzkoušet

- vytvoření nové servisní zakázky,
- sledování opravy pomocí vzniklého kódu,
- zákaznický demo kód `BC-2407`,
- administrační přehled přes tlačítko **Pro servis**,
- hledání a filtrování zakázek,
- změnu stavu opravy,
- doplnění ceny v detailu zakázky.
- prezentační stránku pilotu `pilot.html`,
- obchodní scénář a plán měření pilotu.

## Veřejné nasazení

Repozitář obsahuje workflow `.github/workflows/pages.yml`. V GitHubu otevřete **Settings → Pages** a jako **Source** nastavte **GitHub Actions**. Po pushi se web publikuje na `https://slanma.github.io/bikecare-demo/`.

Před prezentací nahraďte demonstrační e-mail `pilot@bikecare.cz` v `pilot.html` vlastním kontaktem.

## Automatické nahrávání na GitHub

Na macOS lze jedním příkazem zapnout lokální LaunchAgent. Každých 30 sekund zkontroluje nový commit a odešle jej na větev `main`:

```bash
./scripts/install-auto-push.sh
```

Log je uložen pouze lokálně v `.git/auto-push/auto-push.log`. Vypnutí:

```bash
./scripts/uninstall-auto-push.sh
```

## Omezení dema

Jde o produktové demo. Pro ostrý provoz je potřeba doplnit serverovou databázi, přihlášení, oprávnění jednotlivých provozoven, odesílání e-mailů/SMS, zálohy a právní texty konkrétního provozovatele.
