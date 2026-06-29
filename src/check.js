import { fetchTicker } from "./safetrade.js";
import { resolveChatId, sendTelegram } from "./telegram.js";

export async function checkAndNotify({ coinId, exchangeId, base, target, token, chatId }) {
  const ticker = await fetchTicker({ coinId, exchangeId, base, target });
  const text = `${base.toUpperCase()}/${target.toUpperCase()} (SafeTrade): $${ticker.last}`;

  console.log(new Date().toISOString(), text);

  // Se o chat_id nao foi informado, tenta descobrir automaticamente (e mostra no log).
  let resolvedChatId = chatId;
  if (!resolvedChatId) {
    resolvedChatId = await resolveChatId({ token });
    if (!resolvedChatId) {
      throw new Error(
        "Nao consegui descobrir o TELEGRAM_CHAT_ID. Mande uma mensagem qualquer pro seu bot no Telegram e rode de novo."
      );
    }
    console.log("TELEGRAM_CHAT_ID descoberto:", resolvedChatId);
  }

  await sendTelegram({ token, chatId: resolvedChatId, text });
  return text;
}
