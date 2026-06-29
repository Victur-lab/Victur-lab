// Envio de mensagens via Telegram Bot API (gratuito, sem cobranca por mensagem).

// Descobre automaticamente o chat_id da ultima conversa que alguem iniciou com o bot.
// Util para o setup: o usuario so precisa mandar uma mensagem qualquer pro bot.
export async function resolveChatId({ token }) {
  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(`Telegram getUpdates respondeu ${res.status}: ${JSON.stringify(data)}`);
  }

  const updates = data.result || [];
  for (let i = updates.length - 1; i >= 0; i--) {
    const chat = updates[i].message?.chat || updates[i].my_chat_member?.chat;
    if (chat?.id) return String(chat.id);
  }

  return null;
}

export async function sendTelegram({ token, chatId, text }) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Telegram respondeu ${res.status}: ${body}`);
  }

  return body;
}
