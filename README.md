# Victur Crypto Notifier

App que verifica a cotacao da PRL/USDT na SafeTrade (https://safetrade.com/exchange/PRL-USDT) e avisa por **WhatsApp** a cada 5 minutos, usando o [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) (gratuito).

Roda automaticamente e de forma gratuita via **GitHub Actions** (cron a cada 5 minutos) — nao precisa deixar nenhum computador ligado.

> SMS gratuito de verdade praticamente nao existe via API (operadoras cobram por mensagem). Por isso o canal usado e o WhatsApp.

## Existem 2 passos que so voce pode fazer (autenticacao de identidade)

Nenhum bot pode te enviar WhatsApp sem que VOCE autorize, nem adicionar segredos no SEU repositorio sem acesso a sua conta GitHub. Fora isso, tudo ja esta pronto no codigo.

### Passo 1 — Autorizar o CallMeBot a te mandar mensagem (30 segundos)

1. No celular numero `+55 17 99682-2110`, adicione o contato `+34 644 81 58 78` (numero oficial atual do CallMeBot).
2. Envie para esse numero, pelo WhatsApp, a mensagem exatamente assim:
   ```
   I allow callmebot to send me messages
   ```
3. Em poucos minutos o CallMeBot responde com sua **apikey** (um numero, ex: `123456`). Guarde esse numero.

### Passo 2 — Adicionar os segredos no repositorio do GitHub

No repositorio, vá em **Settings > Secrets and variables > Actions > New repository secret** e crie:

| Nome | Valor |
|---|---|
| `WHATSAPP_PHONE` | `5517996822110` |
| `WHATSAPP_APIKEY` | a apikey que voce recebeu no Passo 1 |

Pronto. O workflow `.github/workflows/notify.yml` ja esta agendado para rodar a cada 5 minutos (`*/5 * * * *`) e vai te mandar a cotacao da PRLUSDT automaticamente.

Voce pode disparar manualmente uma execucao a qualquer momento em **Actions > Notificar cotacao PRL/USDT > Run workflow**, para testar sem esperar os 5 minutos.

## Rodando localmente (alternativa ao GitHub Actions)

```bash
npm install
cp .env.example .env
```

Edite o `.env` com seu numero e apikey, depois:

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

A API da SafeTrade (`safetrade.com` e `safe.trade`) bloqueia requisicoes vindas de servidores/datacenters (incluindo o GitHub Actions) com erro 403, mesmo simulando um navegador. Por isso o preco e obtido via **CoinGecko** (API publica gratuita, sem bloqueio de datacenter), buscando o ticker do par PRL/USDT especificamente dentro da exchange SafeTrade (`exchange_id=safe-trade`, `coin_id=pearl-2`), entao o valor enviado e o mesmo que aparece no SafeTrade.

## Limite gratuito do GitHub Actions

- Repositorio **publico**: minutos de Actions ilimitados.
- Repositorio **privado**: plano Free inclui 2.000 minutos/mes gratis. Rodando a cada 5 minutos (~288 execucoes/dia, poucos segundos cada) cabe tranquilamente dentro desse limite.
