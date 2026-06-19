import "dotenv/config";
import { checkAndNotify } from "./check.js";

const {
  MARKET = "prlusdt",
  SAFETRADE_TICKER_URL = "https://safe.trade/api/v2/peatio/public/markets/{market}/tickers",
  WHATSAPP_PHONE,
  WHATSAPP_APIKEY,
} = process.env;

if (!WHATSAPP_PHONE || !WHATSAPP_APIKEY) {
  console.error("Defina WHATSAPP_PHONE e WHATSAPP_APIKEY (env vars ou secrets do GitHub Actions).");
  process.exit(1);
}

checkAndNotify({
  market: MARKET,
  tickerUrl: SAFETRADE_TICKER_URL,
  phone: WHATSAPP_PHONE,
  apikey: WHATSAPP_APIKEY,
}).catch((err) => {
  console.error("Erro ao verificar/notificar cotacao:", err.message);
  process.exit(1);
});
