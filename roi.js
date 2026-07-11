const jobs = document.querySelector('#jobs');
const minutes = document.querySelector('#minutes');
const rate = document.querySelector('#rate');
const money = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 });

function calculateROI() {
  const weeklyJobs = Number(jobs.value);
  const minutesPerJob = Number(minutes.value);
  const hourlyRate = Number(rate.value);
  const monthlyHoursSaved = weeklyJobs * 4.2 * minutesPerJob / 60 * 0.35;
  const monthlySavings = monthlyHoursSaved * hourlyRate;
  const monthsToPayback = 2900 / monthlySavings;

  document.querySelector('#jobs-output').textContent = weeklyJobs;
  document.querySelector('#minutes-output').textContent = `${minutesPerJob} min`;
  document.querySelector('#rate-output').textContent = money.format(hourlyRate);
  document.querySelector('#savings').textContent = money.format(monthlySavings);
  document.querySelector('#hours').textContent = `${monthlyHoursSaved.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} hodiny získaného času`;
  document.querySelector('#payback').textContent = monthsToPayback < 1 ? 'méně než 1 měsíc' : `${monthsToPayback.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} měsíce`;
}

[jobs, minutes, rate].forEach(input => input.addEventListener('input', calculateROI));
calculateROI();
