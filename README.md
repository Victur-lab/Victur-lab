# Victur Crypto Notifier

App que verifica a cotacao da PRL/USDT na SafeTrade (https://safetrade.com/exchange/PRL-USDT) e te avisa por **WhatsApp** a cada 5 minutos. Usa o [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/), que e gratuito.

> SMS gratuito de verdade praticamente nao existe via API (operadoras cobram). Por isso o app usa WhatsApp, que e o canal gratuito que cumpre o mesmo objetivo.

## 1. Gerar a apikey gratuita do CallMeBot

1. Adicione o numero `+34 644 59 71 65` nos seus contatos do WhatsApp.
2. Envie para esse numero a mensagem: `I allow callmebot to send me messages`
3. Em poucos minutos voce recebe uma resposta com sua `apikey` (um numero).

## 2. Configurar o projeto

```bash
npm install
cp .env.example .env
```

Edite o `.env`:

```
WHATSAPP_PHONE=5511999998888   # seu numero com DDI, so digitos
WHATSAPP_APIKEY=123456         # apikey recebida do CallMeBot
MARKET=prlusdt                 # par de mercado (minusculo, sem hifen)
INTERVAL_MINUTES=5
```

## 3. Rodar

```bash
npm start
```

O app roda continuamente, manda uma mensagem de teste assim que inicia e depois a cada `INTERVAL_MINUTES` minutos.

Para deixar rodando 24/7, use um gerenciador de processos como `pm2`:

```bash
npm i -g pm2
pm2 start src/index.js --name crypto-notifier
pm2 save
```

## Observacao sobre a API da SafeTrade

O endpoint usado (`SAFETRADE_TICKER_URL` no `.env`) segue o padrao do motor Peatio/Openware que a SafeTrade utiliza:

```
https://safetrade.com/api/v2/peatio/public/markets/{market}/tickers
```

Se a SafeTrade mudar a URL da API publica, ajuste o valor de `SAFETRADE_TICKER_URL` no `.env` (mantenha o `{market}` no lugar do par, ex.: `prlusdt`).
