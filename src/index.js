import "dotenv/config";
import cron from "node-cron";
import { checkAndNotify } from "./check.js";

const {
  COIN_ID = "pearl-2",
  EXCHANGE_ID = "safe_trade",
  BASE = "PRL",
  TARGET = "USDT",
  INTERVAL_MINUTES = "5",
  TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID,
} = process.env;

if (!TELEGRAM_TOKEN) {
  console.error("Defina TELEGRAM_TOKEN no .env (veja README.md para criar o bot no Telegram).");
  process.exit(1);
}

function run() {
  checkAndNotify({
    coinId: COIN_ID,
    exchangeId: EXCHANGE_ID,
    base: BASE,
    target: TARGET,
    token: TELEGRAM_TOKEN,
    chatId: TELEGRAM_CHAT_ID,
  }).catch((err) => console.error("Erro ao verificar/notificar cotacao:", err.message));
}

const minutes = Number(INTERVAL_MINUTES) || 5;
console.log(`Notificando ${BASE}/${TARGET} a cada ${minutes} minuto(s) via Telegram.`);

run();
cron.schedule(`*/${minutes} * * * *`, run);
