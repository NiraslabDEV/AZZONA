// ── Reservation form ──────────────────────────────────────────
const form      = document.getElementById('reservationForm');
const success   = document.getElementById('formSuccess');
const errors    = document.getElementById('formErrors');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const spinner   = document.getElementById('submitSpinner');

// Set minimum date to today
const dateInput = form.querySelector('[name="date"]');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
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

// ── CRM: debounce no campo telefone ───────────────────────────
const phoneInput = form.querySelector('[name="customer_phone"]');
let crmHint = null;
let crmTimer = null;

if (phoneInput) {
  // Criar elemento de hint
  crmHint = document.createElement('div');
  crmHint.className = 'font-syne text-[11px] tracking-[1px] mt-1 hidden';
  phoneInput.parentNode.appendChild(crmHint);

  phoneInput.addEventListener('input', () => {
    clearTimeout(crmTimer);
    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length < 9) {
      hideCrmHint();
      return;
    }
    crmTimer = setTimeout(() => lookupCustomer(phoneInput.value), 500);
  });
}

function hideCrmHint() {
  if (crmHint) crmHint.classList.add('hidden');
}

async function lookupCustomer(phone) {
  try {
    const res = await fetch(`/api/reservations/lookup?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    if (!data) { hideCrmHint(); return; }

    const lastDate = new Date(data.last_visit + 'T12:00:00').toLocaleDateString('pt-PT', { day:'numeric', month:'short' });
    const visits = data.visits;
    crmHint.innerHTML = `★ <span style="color:#C9A96E">${data.name}</span> — ${visits} visita${visits > 1 ? 's' : ''}, última em ${lastDate}`;
    crmHint.className = 'font-syne text-[11px] tracking-[1px] mt-1';
    crmHint.style.color = '#8A8276';
  } catch (_) {
    hideCrmHint();
  }
}

// ── Verificar se reservas estão fechadas ──────────────────────
async function checkBookingStatus() {
  try {
    const res = await fetch('/api/reservations/booking-status');
    const { booking_closed, absence_message } = await res.json();
    if (booking_closed) {
      const msg = absence_message || 'Reservas temporariamente indisponíveis.';
      form.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
      submitBtn.disabled = true;
      showErrors([`🔒 ${msg}`]);
    }
  } catch (_) {
    // Silent — não bloquear form se check falhar
  }
}

checkBookingStatus();

// ── Submit ────────────────────────────────────────────────────
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
      const msgs = json.errors || [json.message || json.error || 'Erro ao enviar reserva.'];
      showErrors(msgs);
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
  hideCrmHint();
  checkBookingStatus();
};
