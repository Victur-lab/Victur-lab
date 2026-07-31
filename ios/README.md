# Victur Crypto — App para iPhone

App nativo (SwiftUI) que faz o mesmo que o notificador de Telegram deste repositorio:

- Mostra a cotacao **PRL/USDT da SafeTrade** ao vivo (via CoinGecko, a mesma fonte do bot).
- Com o app aberto, atualiza sozinho a cada 1 minuto (e tem "puxar para atualizar").
- Grafico da variacao do preco enquanto o app esta aberto.
- Com o app fechado, busca a cotacao em segundo plano e mostra uma **notificacao no iPhone** no mesmo formato da mensagem do Telegram: `PRL/USDT (SafeTrade): $0.1234`.

## O que voce precisa

- Um **Mac** com **Xcode 16 ou mais novo** (gratis na Mac App Store).
- Um **iPhone** com iOS 17 ou mais novo e um cabo (ou mesma rede Wi-Fi).
- Uma conta Apple (a gratuita serve — veja a observacao no final).

## Como instalar no seu iPhone

1. Clone este repositorio no Mac e abra `ios/VicturCrypto.xcodeproj` no Xcode (duplo clique).
2. No Xcode, clique no projeto **VicturCrypto** na barra lateral > aba **Signing & Capabilities**.
3. Em **Team**, escolha sua conta Apple (adicione em Xcode > Settings > Accounts se ainda nao tiver).
4. Se o Xcode reclamar do bundle identifier, troque `com.victur.VicturCrypto` por algo unico seu (ex: `com.SEUNOME.VicturCrypto`).
5. Conecte o iPhone no Mac, selecione ele na barra de dispositivos no topo e aperte **▶ (Run)**.
6. Na primeira vez, o iPhone vai pedir para confiar no desenvolvedor: **Ajustes > Geral > VPN e Gerenciamento de Dispositivo** > toque no seu perfil > **Confiar**.
7. Abra o app e aceite a permissao de **notificacoes**.
8. Para as notificacoes em segundo plano funcionarem, confira que **Ajustes > Geral > Atualizacao em 2o Plano** esta ligada para o app.

## Limitacao importante do iOS (leia!)

No iPhone, **quem decide quando um app roda em segundo plano e o iOS**, para economizar bateria. O app pede para verificar a cotacao a cada 5 minutos, mas o sistema pode espacar isso (as vezes so algumas execucoes por hora, dependendo do seu uso do aparelho e da bateria). A Apple nao permite que apps comuns rodem em intervalo exato garantido.

Ou seja:

- **Notificacoes cravadas a cada 5 minutos** → continue usando o **bot do Telegram** (ja funciona e e gratis).
- **Ver a cotacao na hora, com grafico, do jeito bonito** → use o app; com ele aberto a atualizacao e de 1 em 1 minuto, garantida.

Os dois convivem numa boa — o app nao substitui o bot, ele complementa.

## Observacao sobre conta Apple gratuita

Com conta Apple **gratuita**, o app instalado pelo Xcode **expira em 7 dias** — depois e so conectar o iPhone e apertar Run de novo para reinstalar. Com a conta paga do Apple Developer Program (US$ 99/ano) o app dura 1 ano e pode ir para a App Store/TestFlight.
