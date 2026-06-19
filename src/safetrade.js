export async function fetchTicker({ coinId, exchangeId, base, target }) {
  const url = `https://api.coingecko.com/api/v3/exchanges/${exchangeId}/tickers?coin_ids=${coinId}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`CoinGecko respondeu ${res.status} ao buscar ${url}`);
  }

  const data = await res.json();
  const ticker = data.tickers?.find(
    (t) => t.base.toUpperCase() === base.toUpperCase() && t.target.toUpperCase() === target.toUpperCase()
  );

  if (!ticker) {
    throw new Error(`Nao encontrei o par ${base}/${target} na resposta do CoinGecko: ${JSON.stringify(data)}`);
  }

  return {
    last: Number(ticker.last),
    volume: ticker.volume,
  };
}
