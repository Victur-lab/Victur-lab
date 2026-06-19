import "dotenv/config";
import cron from "node-cron";
import { checkAndNotify } from "./check.js";

const {
  COIN_ID = "pearl-2",
  EXCHANGE_ID = "safe-trade",
  BASE = "PRL",
  TARGET = "USDT",
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
    coinId: COIN_ID,
    exchangeId: EXCHANGE_ID,
    base: BASE,
    target: TARGET,
    phone: WHATSAPP_PHONE,
    apikey: WHATSAPP_APIKEY,
  }).catch((err) => console.error("Erro ao verificar/notificar cotacao:", err.message));
}

const minutes = Number(INTERVAL_MINUTES) || 5;
console.log(`Notificando ${BASE}/${TARGET} a cada ${minutes} minuto(s) via WhatsApp.`);

run();
cron.schedule(`*/${minutes} * * * *`, run);
