import Foundation

struct Ticker: Decodable {
    let base: String
    let target: String
    let last: Double
    let volume: Double?
}

struct TickersResponse: Decodable {
    let tickers: [Ticker]
}

struct PricePoint: Identifiable {
    let id = UUID()
    let date: Date
    let price: Double
}

enum PriceError: LocalizedError {
    case badResponse(Int)
    case pairNotFound

    var errorDescription: String? {
        switch self {
        case .badResponse(let code):
            return "O CoinGecko respondeu com erro \(code). Tente de novo em instantes."
        case .pairNotFound:
            return "Nao encontrei o par PRL/USDT na resposta do CoinGecko."
        }
    }
}

/// Busca a cotacao PRL/USDT da SafeTrade via CoinGecko — a mesma fonte usada
/// pelo notificador de Telegram deste repositorio (src/safetrade.js).
enum PriceAPI {
    static let base = "PRL"
    static let target = "USDT"
    static let coinId = "pearl-2"
    static let exchangeId = "safe_trade"

    static func fetchTicker() async throws -> Ticker {
        let url = URL(string: "https://api.coingecko.com/api/v3/exchanges/\(exchangeId)/tickers?coin_ids=\(coinId)")!
        var request = URLRequest(url: url)
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        let (data, response) = try await URLSession.shared.data(for: request)
        if let http = response as? HTTPURLResponse, http.statusCode != 200 {
            throw PriceError.badResponse(http.statusCode)
        }

        let decoded = try JSONDecoder().decode(TickersResponse.self, from: data)
        guard let ticker = decoded.tickers.first(where: {
            $0.base.uppercased() == base && $0.target.uppercased() == target
        }) else {
            throw PriceError.pairNotFound
        }
        return ticker
    }
}

@MainActor
final class PriceService: ObservableObject {
    @Published var price: Double?
    @Published var volume: Double?
    @Published var lastUpdated: Date?
    @Published var errorMessage: String?
    @Published var history: [PricePoint] = []
    @Published var isLoading = false

    private let maxHistoryPoints = 500

    func refresh() async {
        isLoading = true
        defer { isLoading = false }

        do {
            let ticker = try await PriceAPI.fetchTicker()

            price = ticker.last
            volume = ticker.volume
            lastUpdated = Date()
            errorMessage = nil

            history.append(PricePoint(date: Date(), price: ticker.last))
            if history.count > maxHistoryPoints {
                history.removeFirst(history.count - maxHistoryPoints)
            }
        } catch let error as PriceError {
            errorMessage = error.errorDescription
        } catch is DecodingError {
            errorMessage = "Nao consegui interpretar a resposta do CoinGecko."
        } catch {
            errorMessage = "Sem conexao ou o CoinGecko esta fora do ar. (\(error.localizedDescription))"
        }
    }
}
