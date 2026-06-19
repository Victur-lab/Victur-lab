import { fetchTicker } from "./safetrade.js";
import { sendWhatsapp } from "./whatsapp.js";

export async function checkAndNotify({ coinId, exchangeId, base, target, phone, apikey }) {
  const ticker = await fetchTicker({ coinId, exchangeId, base, target });
  const text = `${base.toUpperCase()}/${target.toUpperCase()} (SafeTrade): $${ticker.last}`;

  console.log(new Date().toISOString(), text);
  await sendWhatsapp({ phone, apikey, text });
  return text;
}
