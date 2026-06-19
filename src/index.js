import "dotenv/config";
import cron from "node-cron";
import { checkAndNotify } from "./check.js";

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

function run() {
  checkAndNotify({
    market: MARKET,
    tickerUrl: SAFETRADE_TICKER_URL,
    phone: WHATSAPP_PHONE,
    apikey: WHATSAPP_APIKEY,
  }).catch((err) => console.error("Erro ao verificar/notificar cotacao:", err.message));
}

const minutes = Number(INTERVAL_MINUTES) || 5;
console.log(`Notificando ${MARKET.toUpperCase()} a cada ${minutes} minuto(s) via WhatsApp.`);

run();
cron.schedule(`*/${minutes} * * * *`, run);
