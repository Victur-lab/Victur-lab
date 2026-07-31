import SwiftUI
import Charts

struct ContentView: View {
    @StateObject private var service = PriceService()

    private let foregroundRefreshSeconds: UInt64 = 60

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    priceCard

                    if let message = service.errorMessage {
                        errorBanner(message)
                    }

                    if service.history.count >= 2 {
                        chartCard
                    }

                    infoCard
                }
                .padding()
            }
            .navigationTitle("Victur Crypto")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        Task { await service.refresh() }
                    } label: {
                        if service.isLoading {
                            ProgressView()
                        } else {
                            Image(systemName: "arrow.clockwise")
                        }
                    }
                    .disabled(service.isLoading)
                }
            }
            .refreshable { await service.refresh() }
            .task {
                await service.refresh()
                while !Task.isCancelled {
                    try? await Task.sleep(nanoseconds: foregroundRefreshSeconds * 1_000_000_000)
                    await service.refresh()
                }
            }
        }
    }

    private var priceCard: some View {
        VStack(spacing: 8) {
            Text("\(PriceAPI.base)/\(PriceAPI.target)")
                .font(.headline)
                .foregroundStyle(.secondary)
            Text("SafeTrade · via CoinGecko")
                .font(.caption)
                .foregroundStyle(.tertiary)

            if let price = service.price {
                Text("$\(BackgroundNotifier.formatPrice(price))")
                    .font(.system(size: 44, weight: .bold, design: .rounded))
                    .contentTransition(.numericText())
                sessionChange
            } else if service.isLoading {
                ProgressView()
                    .padding(.vertical, 20)
            } else {
                Text("—")
                    .font(.system(size: 44, weight: .bold, design: .rounded))
                    .foregroundStyle(.secondary)
            }

            if let updated = service.lastUpdated {
                Text("Atualizado \(updated.formatted(date: .omitted, time: .standard))")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 20))
    }

    @ViewBuilder
    private var sessionChange: some View {
        if let first = service.history.first?.price,
           let current = service.price,
           first > 0 {
            let percent = (current - first) / first * 100
            if abs(percent) >= 0.005 {
                Label(
                    String(format: "%+.2f%% desde que o app abriu", percent),
                    systemImage: percent >= 0 ? "arrow.up.right" : "arrow.down.right"
                )
                .font(.caption.bold())
                .foregroundStyle(percent >= 0 ? .green : .red)
            }
        }
    }

    private var chartCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Nesta sessao")
                .font(.headline)

            Chart(service.history) { point in
                LineMark(
                    x: .value("Hora", point.date),
                    y: .value("Preco", point.price)
                )
                .interpolationMethod(.monotone)

                AreaMark(
                    x: .value("Hora", point.date),
                    y: .value("Preco", point.price)
                )
                .interpolationMethod(.monotone)
                .foregroundStyle(.linearGradient(
                    colors: [.accentColor.opacity(0.3), .clear],
                    startPoint: .top,
                    endPoint: .bottom
                ))
            }
            .chartYScale(domain: .automatic(includesZero: false))
            .frame(height: 180)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 20))
    }

    private var infoCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            if let volume = service.volume {
                LabeledContent("Volume 24h") {
                    Text("\(BackgroundNotifier.formatPrice(volume)) \(PriceAPI.base)")
                }
            }
            LabeledContent("Atualizacao com o app aberto") {
                Text("a cada 1 min")
            }
            LabeledContent("Notificacoes em segundo plano") {
                Text("controladas pelo iOS")
            }
            Text("Com o app fechado, o iPhone busca a cotacao e mostra uma notificacao igual a do Telegram. O iOS decide a frequencia exata para poupar bateria; para receber a cada 5 minutos cravados, o bot do Telegram continua funcionando.")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 20))
    }

    private func errorBanner(_ message: String) -> some View {
        Label(message, systemImage: "exclamationmark.triangle.fill")
            .font(.callout)
            .foregroundStyle(.orange)
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(.orange.opacity(0.12), in: RoundedRectangle(cornerRadius: 16))
    }
}

#Preview {
    ContentView()
}
