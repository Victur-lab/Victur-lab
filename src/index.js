import "dotenv/config";
import cron from "node-cron";
import { fetchTicker } from "./safetrade.js";
import { sendWhatsapp } from "./whatsapp.js";

const {
  MARKET = "prlusdt",
  SAFETRADE_TICKER_URL = "https://safetrade.com/api/v2/peatio/public/markets/{market}/tickers",
  INTERVAL_MINUTES = "5",
  WHATSAPP_PHONE,
  WHATSAPP_APIKEY,
} = process.env;

if (!WHATSAPP_PHONE || !WHATSAPP_APIKEY) {
  console.error(
    "Defina WHATSAPP_PHONE e WHATSAPP_APIKEY no .env (veja README.md para gerar a apikey no CallMeBot)."
  );
  process.exit(1);
}

async function checkAndNotify() {
  try {
    const ticker = await fetchTicker(MARKET, SAFETRADE_TICKER_URL);
    const symbol = MARKET.toUpperCase();
    const text =
      `${symbol}: $${ticker.last}` +
      (ticker.high !== undefined ? ` | max: $${ticker.high}` : "") +
      (ticker.low !== undefined ? ` | min: $${ticker.low}` : "");

    console.log(new Date().toISOString(), text);
    await sendWhatsapp({ phone: WHATSAPP_PHONE, apikey: WHATSAPP_APIKEY, text });
  } catch (err) {
    console.error("Erro ao verificar/notificar cotacao:", err.message);
  }
}

const minutes = Number(INTERVAL_MINUTES) || 5;
console.log(`Notificando ${MARKET.toUpperCase()} a cada ${minutes} minuto(s) via WhatsApp.`);

checkAndNotify();
cron.schedule(`*/${minutes} * * * *`, checkAndNotify);
