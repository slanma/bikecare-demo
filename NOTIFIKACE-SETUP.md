# Aktivace skutečných e-mailových notifikací

Frontend na GitHub Pages nesmí obsahovat Resend API klíč. E-maily proto odesílá Supabase Edge Function v `supabase/functions/send-service-email`.

## Potřebujete

1. Supabase projekt.
2. Resend účet, ověřenou vlastní doménu a API klíč.

V Supabase Dashboard otevřete **Edge Functions → Secrets** a nastavte `RESEND_API_KEY`, `FROM_EMAIL`, `APP_URL` a `ALLOWED_ORIGIN`. Klíče nikdy nevkládejte do GitHubu ani `app.js`.

```bash
supabase login
supabase link --project-ref VAS_PROJECT_REF
supabase functions deploy send-service-email
```

Funkce vyžaduje přihlášeného uživatele. Před připojením ostrého tlačítka **Odeslat** je proto potřeba dokončit Supabase Auth a role zaměstnanců. Připravené šablony: `received`, `diagnosis`, `approval`, `ready`.
