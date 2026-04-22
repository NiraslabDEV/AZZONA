// ── Reservation form ──────────────────────────────────────────
const form     = document.getElementById('reservationForm');
const success  = document.getElementById('formSuccess');
const errors   = document.getElementById('formErrors');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const spinner  = document.getElementById('submitSpinner');

// Set minimum date to today
const dateInput = form.querySelector('[name="date"]');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

function showErrors(msgs) {
  errors.innerHTML = msgs.map(m =>
    `<p class="text-red-400 font-syne text-[11px] tracking-[1px]">• ${m}</p>`
  ).join('');
  errors.classList.remove('hidden');
}

function clearErrors() {
  errors.innerHTML = '';
  errors.classList.add('hidden');
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitText.textContent = loading ? 'A enviar…' : 'Confirmar Reserva';
  spinner.classList.toggle('hidden', !loading);
  submitBtn.classList.toggle('opacity-70', loading);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  setLoading(true);

  const data = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      showErrors(json.errors || [json.error || 'Erro ao enviar reserva.']);
      return;
    }

    form.classList.add('hidden');
    success.classList.remove('hidden');
  } catch (_) {
    showErrors(['Erro de ligação. Verifique a sua internet e tente novamente.']);
  } finally {
    setLoading(false);
  }
});

window.resetForm = function () {
  form.reset();
  form.classList.remove('hidden');
  success.classList.add('hidden');
  clearErrors();
};
