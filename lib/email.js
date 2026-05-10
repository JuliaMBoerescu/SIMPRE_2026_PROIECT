import { EmailClient } from '@azure/communication-email';

export async function sendOrderEmail({ to, name, orderId, total, items }) {
  if (!process.env.ACS_EMAIL_CONNECTION_STRING || !process.env.ACS_EMAIL_SENDER) {
    console.warn('Email not sent: ACS config missing');
    return { skipped: true };
  }

  const client = new EmailClient(process.env.ACS_EMAIL_CONNECTION_STRING);
  const list = items.map(i => `<li>${i.name} x ${i.quantity} - ${i.price * i.quantity} lei</li>`).join('');

  const message = {
    senderAddress: process.env.ACS_EMAIL_SENDER,
    content: {
      subject: `Confirmare comandă #${orderId}`,
      plainText: `Bună, ${name}! Comanda ta #${orderId} a fost plasată. Total: ${total} lei.`,
      html: `<h2>Confirmare comandă</h2><p>Bună, ${name}!</p><p>Comanda ta <b>#${orderId}</b> a fost plasată.</p><ul>${list}</ul><p><b>Total:</b> ${total} lei</p>`
    },
    recipients: { to: [{ address: to, displayName: name }] }
  };

  const poller = await client.beginSend(message);
  return poller.pollUntilDone();
}
