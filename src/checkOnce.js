import "dotenv/config";
import { checkAndNotify } from "./check.js";

const {
  COIN_ID = "pearl-2",
  EXCHANGE_ID = "safe-trade",
  BASE = "PRL",
  TARGET = "USDT",
  WHATSAPP_PHONE,
  WHATSAPP_APIKEY,
} = process.env;

if (!WHATSAPP_PHONE || !WHATSAPP_APIKEY) {
  console.error("Defina WHATSAPP_PHONE e WHATSAPP_APIKEY (env vars ou secrets do GitHub Actions).");
  process.exit(1);
}

checkAndNotify({
  coinId: COIN_ID,
  exchangeId: EXCHANGE_ID,
  base: BASE,
  target: TARGET,
  phone: WHATSAPP_PHONE,
  apikey: WHATSAPP_APIKEY,
}).catch((err) => {
  console.error("Erro ao verificar/notificar cotacao:", err.message);
  process.exit(1);
});
