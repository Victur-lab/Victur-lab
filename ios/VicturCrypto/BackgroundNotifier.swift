import Foundation
import BackgroundTasks
import UserNotifications

/// Replica o comportamento do notificador de Telegram: busca a cotacao
/// periodicamente e avisa com uma notificacao local no iPhone.
///
/// Importante: no iOS quem decide o momento exato da atualizacao em segundo
/// plano e o sistema (Background App Refresh). O app PEDE para rodar a cada
/// 5 minutos, mas o iOS pode espacar as execucoes para economizar bateria.
enum BackgroundNotifier {
    static let taskIdentifier = "com.victur.VicturCrypto.refresh"
    static let refreshIntervalMinutes: Double = 5

    /// Pede permissao para mostrar notificacoes (chamado na abertura do app).
    static func requestNotificationPermission() async {
        let center = UNUserNotificationCenter.current()
        _ = try? await center.requestAuthorization(options: [.alert, .sound, .badge])
    }

    /// Agenda a proxima verificacao em segundo plano.
    static func scheduleNextRefresh() {
        let request = BGAppRefreshTaskRequest(identifier: taskIdentifier)
        request.earliestBeginDate = Date(timeIntervalSinceNow: refreshIntervalMinutes * 60)
        try? BGTaskScheduler.shared.submit(request)
    }

    /// Executado pelo sistema quando a tarefa em segundo plano roda:
    /// busca o preco, notifica e ja agenda a proxima execucao.
    static func handleRefresh() async {
        scheduleNextRefresh()

        guard let ticker = try? await PriceAPI.fetchTicker() else { return }
        await postPriceNotification(price: ticker.last)
    }

    /// Mostra a notificacao no mesmo formato da mensagem do Telegram:
    /// "PRL/USDT (SafeTrade): $0.1234"
    static func postPriceNotification(price: Double) async {
        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized ||
              settings.authorizationStatus == .provisional else { return }

        let content = UNMutableNotificationContent()
        content.title = "\(PriceAPI.base)/\(PriceAPI.target) (SafeTrade)"
        content.body = "$\(formatPrice(price))"
        content.sound = .default

        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil
        )
        try? await center.add(request)
    }

    static func formatPrice(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 6
        formatter.locale = Locale(identifier: "en_US")
        return formatter.string(from: NSNumber(value: value)) ?? String(value)
    }
}
