const notificationTypes = { received: ['Potvrzení přijetí', 'Zakázku jsme uložili a servis se brzy ozve.'], diagnosis: ['Diagnostika dokončena', 'Prohlídka kola je hotová. Zákazník dostane aktuální informace.'], approval: ['Schválení kalkulace', 'Před pokračováním potřebujeme potvrdit rozsah a cenu opravy.'], ready: ['Připraveno k vyzvednutí', 'Servis je dokončený a kolo je připravené.'] };
window.openNotificationCenter = function(order) {
  document.querySelector('#notification-order').textContent = `${order.code} · ${order.email}`;
  document.querySelector('#notification-templates').innerHTML = Object.entries(notificationTypes).map(([key,[title,text]]) => `<button class="notification-template" data-notify="${key}"><span>${title}</span><small>${text}</small><b>Otevřít náhled →</b></button>`).join('');
  document.querySelector('#notification-dialog').showModal();
  document.querySelectorAll('[data-notify]').forEach(button => button.addEventListener('click', () => previewNotification(order, button.dataset.notify)));
};
function previewNotification(order,type) {
  const [title,text] = notificationTypes[type];
  const history = JSON.parse(localStorage.getItem('bikecare-notification-history') || '[]'); history.unshift({code:order.code,email:order.email,type,title,created:new Date().toISOString(),demo:true}); localStorage.setItem('bikecare-notification-history',JSON.stringify(history.slice(0,50)));
  document.querySelector('#notification-preview').innerHTML = `<div class="mail-preview"><div class="mail-brand">BikeCare <small>SERVIS BEZ CHAOSU</small></div><div class="mail-body"><small>KOMU: ${order.email}</small><h3>${title}</h3><p>Dobrý den, ${order.name},</p><p>${text}</p><div class="mail-order"><b>${order.brand} ${order.model||''}</b><span>${order.issue}</span><small>Kód ${order.code}</small></div><button class="btn primary">Zobrazit stav opravy</button></div></div><p class="demo-warning">Náhled. Skutečné odesílání se aktivuje po připojení Supabase Auth a Resend.</p>`;
}
