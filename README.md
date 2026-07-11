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

## Omezení dema

Jde o produktové demo. Pro ostrý provoz je potřeba doplnit serverovou databázi, přihlášení, oprávnění jednotlivých provozoven, odesílání e-mailů/SMS, zálohy a právní texty konkrétního provozovatele.
