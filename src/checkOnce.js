import "dotenv/config";
import { checkAndNotify } from "./check.js";

const {
  COIN_ID = "pearl-2",
  EXCHANGE_ID = "safe_trade",
  BASE = "PRL",
  TARGET = "USDT",
  TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID,
} = process.env;

if (!TELEGRAM_TOKEN) {
  console.error("Defina TELEGRAM_TOKEN (env var ou secret do GitHub Actions).");
  process.exit(1);
}

checkAndNotify({
  coinId: COIN_ID,
  exchangeId: EXCHANGE_ID,
  base: BASE,
  target: TARGET,
  token: TELEGRAM_TOKEN,
  chatId: TELEGRAM_CHAT_ID,
}).catch((err) => {
  console.error("Erro ao verificar/notificar cotacao:", err.message);
  process.exit(1);
});
