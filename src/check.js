import { fetchTicker } from "./safetrade.js";
import { sendWhatsapp } from "./whatsapp.js";

export async function checkAndNotify({ market, tickerUrl, phone, apikey }) {
  const ticker = await fetchTicker(market, tickerUrl);
  const symbol = market.toUpperCase();
  const text =
    `${symbol}: $${ticker.last}` +
    (ticker.high !== undefined ? ` | max: $${ticker.high}` : "") +
    (ticker.low !== undefined ? ` | min: $${ticker.low}` : "");

  console.log(new Date().toISOString(), text);
  await sendWhatsapp({ phone, apikey, text });
  return text;
}
