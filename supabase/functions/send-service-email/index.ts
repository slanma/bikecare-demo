const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'BikeCare <servis@example.com>';
const APP_URL = Deno.env.get('APP_URL') ?? 'https://slanma.github.io/bikecare-demo';
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? APP_URL;
type EmailType = 'received' | 'diagnosis' | 'approval' | 'ready';
type Payload = { type: EmailType; order: { code: string; name: string; email: string; brand: string; model?: string; issue: string; price?: number } };
const subjects: Record<EmailType, string> = { received: 'Přijali jsme vaše kolo do servisu', diagnosis: 'Diagnostika vašeho kola je hotová', approval: 'Prosíme o schválení opravy', ready: 'Vaše kolo je připravené k vyzvednutí' };
function escapeHtml(value = '') { return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!)); }
function emailHtml({ order, type }: Payload) {
  const intro: Record<EmailType, string> = { received: 'Zakázku jsme bezpečně uložili. Jakmile kolo převezmeme, začneme s diagnostikou.', diagnosis: 'Prohlídku kola jsme dokončili. Níže najdete aktuální informace.', approval: 'Než budeme pokračovat, potřebujeme potvrdit navržený rozsah a cenu opravy.', ready: 'Dobrá zpráva — servis je dokončený a kolo si můžete vyzvednout.' };
  const price = order.price ? `<p><b>Kalkulace:</b> ${new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(order.price)}</p>` : '';
  return `<!doctype html><html><body style="margin:0;background:#f6f4ee;font-family:Arial,sans-serif;color:#13231f"><div style="max-width:620px;margin:auto;padding:32px 18px"><div style="background:#173f35;color:white;padding:24px;border-radius:18px 18px 0 0"><b style="font-size:22px">BikeCare</b><div style="color:#dff36b;font-size:12px">SERVIS BEZ CHAOSU</div></div><div style="background:white;padding:30px;border-radius:0 0 18px 18px"><p>Dobrý den, ${escapeHtml(order.name)},</p><h1>${subjects[type]}</h1><p style="line-height:1.65;color:#5e6c67">${intro[type]}</p><div style="background:#f4f6f2;padding:18px;border-radius:12px;margin:22px 0"><b>${escapeHtml(order.brand)} ${escapeHtml(order.model ?? '')}</b><p>${escapeHtml(order.issue)}</p>${price}<p><b>Kód:</b> ${escapeHtml(order.code)}</p></div><a href="${APP_URL}/?track=${encodeURIComponent(order.code)}" style="display:inline-block;background:#173f35;color:white;text-decoration:none;padding:13px 18px;border-radius:10px;font-weight:bold">Zobrazit stav opravy</a></div></div></body></html>`;
}
Deno.serve(async req => {
  const cors = { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN, 'Access-Control-Allow-Headers': 'authorization, content-type, apikey', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: cors });
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ') || auth.length < 30) return Response.json({ error: 'Authentication required' }, { status: 401, headers: cors });
  if (!RESEND_API_KEY) return Response.json({ error: 'Email provider is not configured' }, { status: 503, headers: cors });
  const payload = await req.json() as Payload;
  if (!payload?.order?.email || !subjects[payload.type]) return Response.json({ error: 'Invalid payload' }, { status: 400, headers: cors });
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json', 'User-Agent': 'BikeCare/1.0', 'Idempotency-Key': `${payload.order.code}-${payload.type}` }, body: JSON.stringify({ from: FROM_EMAIL, to: [payload.order.email], subject: subjects[payload.type], html: emailHtml(payload), tags: [{ name: 'order', value: payload.order.code.replace(/[^a-zA-Z0-9_-]/g, '_') }, { name: 'type', value: payload.type }] }) });
  return Response.json(await response.json(), { status: response.status, headers: { ...cors, 'Content-Type': 'application/json' } });
});
