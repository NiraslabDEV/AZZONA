const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function fmtDate(d) {
  if (!d) return d;
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// ── Email para o dono quando chega nova reserva ───────────────
async function notifyOwner(reservation) {
  if (!process.env.EMAIL_USER || !process.env.OWNER_EMAIL) return;
  const t = createTransport();
  const { customer_name, customer_email, customer_phone, date, time, guests, notes, id } = reservation;
  await t.sendMail({
    from: `"Azzona Reservas" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `🍽️ Nova reserva — ${customer_name} · ${fmtDate(date)} às ${time}`,
    html: `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Arial',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(201,169,110,0.2);max-width:560px;width:100%">
        <!-- Header -->
        <tr><td style="padding:36px 40px 24px;border-bottom:1px solid rgba(201,169,110,0.1)">
          <div style="font-size:11px;letter-spacing:5px;color:#C9A96E;text-transform:uppercase;margin-bottom:8px">Nova Reserva Recebida</div>
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#E8E0D0">AZZONA</div>
          <div style="font-size:11px;letter-spacing:3px;color:#8A8276;text-transform:uppercase;margin-top:4px">Polana District · Maputo</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px">
          <div style="font-size:13px;color:#8A8276;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px">Detalhes da Reserva</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(201,169,110,0.08)">
                <div style="font-size:10px;letter-spacing:2px;color:#8A8276;text-transform:uppercase;margin-bottom:4px">Cliente</div>
                <div style="font-size:16px;color:#E8E0D0;font-family:Georgia,serif">${customer_name}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(201,169,110,0.08)">
                <div style="font-size:10px;letter-spacing:2px;color:#8A8276;text-transform:uppercase;margin-bottom:4px">Data & Hora</div>
                <div style="font-size:22px;color:#C9A96E;font-family:Georgia,serif;font-weight:400">${fmtDate(date)} às ${time}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(201,169,110,0.08)">
                <div style="font-size:10px;letter-spacing:2px;color:#8A8276;text-transform:uppercase;margin-bottom:4px">Pessoas</div>
                <div style="font-size:16px;color:#E8E0D0">${guests} pessoa${guests > 1 ? 's' : ''}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(201,169,110,0.08)">
                <div style="font-size:10px;letter-spacing:2px;color:#8A8276;text-transform:uppercase;margin-bottom:4px">Contacto</div>
                <div style="font-size:14px;color:#E8E0D0">${customer_phone}</div>
                <div style="font-size:13px;color:#8A8276;margin-top:2px">${customer_email}</div>
              </td>
            </tr>
            ${notes ? `
            <tr>
              <td style="padding:12px 0">
                <div style="font-size:10px;letter-spacing:2px;color:#8A8276;text-transform:uppercase;margin-bottom:4px">Observações</div>
                <div style="font-size:14px;color:#E8E0D0;font-style:italic;border-left:2px solid rgba(201,169,110,0.3);padding-left:12px">${notes}</div>
              </td>
            </tr>` : ''}
          </table>
          <div style="margin-top:28px;padding:16px;background:rgba(201,169,110,0.06);border:1px solid rgba(201,169,110,0.15);border-radius:2px">
            <div style="font-size:11px;color:#8A8276;letter-spacing:1px">Esta reserva está <strong style="color:#E67E22">Pendente</strong> de confirmação. Aceda ao painel para confirmar ou cancelar.</div>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(201,169,110,0.08)">
          <div style="font-size:10px;color:rgba(138,130,118,0.5);letter-spacing:2px;text-transform:uppercase">© 2026 Azzona · Sistema de Reservas Automático · ID: ${id.slice(0,8)}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

// ── Email de confirmação para o cliente ───────────────────────
async function confirmCustomer(reservation) {
  if (!process.env.EMAIL_USER) return;
  const t = createTransport();
  const { customer_name, customer_email, date, time, guests, notes } = reservation;
  await t.sendMail({
    from: `"Azzona" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: customer_email,
    subject: `✅ Reserva confirmada — ${fmtDate(date)} às ${time} · Azzona`,
    html: `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Arial',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(201,169,110,0.2);max-width:560px;width:100%">
        <!-- Header -->
        <tr><td style="padding:36px 40px 24px;border-bottom:1px solid rgba(201,169,110,0.1);text-align:center">
          <div style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#C9A96E;letter-spacing:8px">AZZONA</div>
          <div style="font-size:10px;letter-spacing:4px;color:#8A8276;text-transform:uppercase;margin-top:6px">Polana District · Maputo</div>
        </td></tr>
        <!-- Confirmation badge -->
        <tr><td style="padding:28px 40px 16px;text-align:center">
          <div style="display:inline-block;background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);padding:10px 28px;margin-bottom:20px">
            <div style="font-size:11px;letter-spacing:4px;color:#27AE60;text-transform:uppercase">✓ &nbsp; Reserva Confirmada</div>
          </div>
          <div style="font-family:Georgia,serif;font-size:22px;color:#E8E0D0;font-weight:400">Olá, ${customer_name}!</div>
          <div style="font-size:14px;color:#8A8276;margin-top:10px;line-height:1.6">A sua reserva no Azzona foi confirmada.<br>Estamos ansiosos por recebê-lo(a).</div>
        </td></tr>
        <!-- Reservation details -->
        <tr><td style="padding:16px 40px 32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,169,110,0.15)">
            <tr>
              <td style="padding:20px;border-right:1px solid rgba(201,169,110,0.1);border-bottom:1px solid rgba(201,169,110,0.08);width:50%;vertical-align:top">
                <div style="font-size:9px;letter-spacing:3px;color:#8A8276;text-transform:uppercase;margin-bottom:6px">Data</div>
                <div style="font-family:Georgia,serif;font-size:18px;color:#C9A96E">${fmtDate(date)}</div>
              </td>
              <td style="padding:20px;border-bottom:1px solid rgba(201,169,110,0.08);width:50%;vertical-align:top">
                <div style="font-size:9px;letter-spacing:3px;color:#8A8276;text-transform:uppercase;margin-bottom:6px">Hora</div>
                <div style="font-family:Georgia,serif;font-size:18px;color:#C9A96E">${time}</div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding:20px">
                <div style="font-size:9px;letter-spacing:3px;color:#8A8276;text-transform:uppercase;margin-bottom:6px">Pessoas</div>
                <div style="font-size:16px;color:#E8E0D0">${guests} pessoa${guests > 1 ? 's' : ''}</div>
                ${notes ? `<div style="margin-top:12px;font-size:9px;letter-spacing:3px;color:#8A8276;text-transform:uppercase;margin-bottom:6px">Notas</div><div style="font-size:13px;color:#8A8276;font-style:italic">${notes}</div>` : ''}
              </td>
            </tr>
          </table>
        </td></tr>
        <!-- Location -->
        <tr><td style="padding:0 40px 28px">
          <div style="background:rgba(201,169,110,0.05);border:1px solid rgba(201,169,110,0.1);padding:16px 20px">
            <div style="font-size:10px;letter-spacing:3px;color:#C9A96E;text-transform:uppercase;margin-bottom:6px">Como Chegar</div>
            <div style="font-size:13px;color:#8A8276;line-height:1.6">Azzona Restaurant · Polana District, Maputo<br>Aberto de Terça a Domingo · 18h00 – 00h00</div>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(201,169,110,0.08);text-align:center">
          <div style="font-size:11px;color:#8A8276;margin-bottom:6px">Para alterações contacte-nos diretamente.</div>
          <div style="font-size:10px;color:rgba(138,130,118,0.4);letter-spacing:2px;text-transform:uppercase">© 2026 Azzona · Polana District · Maputo</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

module.exports = { notifyOwner, confirmCustomer };
