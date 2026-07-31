import SwiftUI

@main
struct VicturCryptoApp: App {
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
                .task {
                    await BackgroundNotifier.requestNotificationPermission()
                }
        }
        .backgroundTask(.appRefresh(BackgroundNotifier.taskIdentifier)) {
            await BackgroundNotifier.handleRefresh()
        }
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase == .background {
                BackgroundNotifier.scheduleNextRefresh()
            }
        }
    }
}
