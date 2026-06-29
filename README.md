# Victur Crypto Notifier

App que verifica a cotacao da PRL/USDT na SafeTrade (https://safetrade.com/exchange/PRL-USDT) e avisa por **Telegram** a cada 5 minutos. O Telegram e **gratuito de verdade**, sem cobranca por mensagem.

Roda automaticamente e de forma gratuita via **GitHub Actions** (cron a cada 5 minutos) — nao precisa deixar nenhum computador ligado.

> Antes era usado o CallMeBot (WhatsApp), mas ele passou a cobrar. Por isso o canal agora e o Telegram, que e 100% gratuito.

## Existem 2 passos que so voce pode fazer (autenticacao de identidade)

Nenhum bot pode te mandar mensagem sem que VOCE crie o bot, nem adicionar segredos no SEU repositorio sem acesso a sua conta GitHub. Fora isso, tudo ja esta pronto no codigo.

### Passo 1 — Criar seu bot no Telegram (1 minuto)

1. No Telegram, procure por **@BotFather** e abra a conversa.
2. Envie `/newbot` e siga as instrucoes (escolha um nome e um username terminando em `bot`).
3. O BotFather vai te dar um **token** (algo como `123456789:AAE...`). Guarde esse token.
4. Abra a conversa do **seu novo bot** e mande qualquer mensagem (ex: `oi`). Isso e o que permite o app te encontrar.

### Passo 2 — Adicionar o segredo no repositorio do GitHub

No repositorio, va em **Settings > Secrets and variables > Actions > New repository secret** e crie:

| Nome | Valor |
|---|---|
| `TELEGRAM_TOKEN` | o token que o BotFather te deu no Passo 1 |

Pronto. O app descobre sozinho o `chat_id` a partir da mensagem que voce mandou pro bot. O workflow `.github/workflows/notify.yml` ja esta agendado para rodar a cada 5 minutos (`*/5 * * * *`) e vai te mandar a cotacao da PRL/USDT automaticamente.

Voce pode disparar manualmente uma execucao a qualquer momento em **Actions > Notificar cotacao PRL/USDT > Run workflow**, para testar sem esperar os 5 minutos.

> Opcional: se quiser fixar o destino, crie tambem o secret `TELEGRAM_CHAT_ID`. Se nao criar, o app resolve automaticamente.

## Rodando localmente (alternativa ao GitHub Actions)

```bash
npm install
cp .env.example .env
```

Edite o `.env` com seu token (e opcionalmente o chat id), depois:

```bash
npm start
```

Isso roda continuamente, enviando a primeira notificacao na hora e depois a cada `INTERVAL_MINUTES`. Para deixar ligado 24/7 em um servidor/VPS, use `pm2`:

```bash
npm i -g pm2
pm2 start src/index.js --name crypto-notifier
pm2 save
```

## Observacao sobre a fonte do preco

A API da SafeTrade (`safetrade.com` e `safe.trade`) bloqueia requisicoes vindas de servidores/datacenters (incluindo o GitHub Actions) com erro 403, mesmo simulando um navegador. Por isso o preco e obtido via **CoinGecko** (API publica gratuita, sem bloqueio de datacenter), buscando o ticker do par PRL/USDT especificamente dentro da exchange SafeTrade (`exchange_id=safe_trade`, `coin_id=pearl-2`), entao o valor enviado e o mesmo que aparece no SafeTrade.

## Limite gratuito do GitHub Actions

- Repositorio **publico**: minutos de Actions ilimitados.
- Repositorio **privado**: plano Free inclui 2.000 minutos/mes gratis. Rodando a cada 5 minutos (~288 execucoes/dia, poucos segundos cada) cabe tranquilamente dentro desse limite.

> Observacao: o agendamento `cron` do GitHub Actions nao e garantido em alta frequencia — o GitHub pode atrasar ou pular execucoes de crons curtos (`*/5`), especialmente em horarios de pico. As mensagens chegam, mas o intervalo real pode variar.
