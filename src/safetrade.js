export async function fetchTicker(market, tickerUrlTemplate) {
  const url = tickerUrlTemplate.replace("{market}", market);
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`SafeTrade respondeu ${res.status} ao buscar ${url}`);
  }

  const data = await res.json();
  // API estilo Peatio/Openware: { ticker: { last, high, low, vol, ... } } ou { <market>: { ticker: {...} } }
  const ticker = data.ticker ?? data[market]?.ticker ?? data;

  const last = ticker.last ?? ticker.price;
  if (last === undefined) {
    throw new Error(`Nao encontrei o preco na resposta da SafeTrade: ${JSON.stringify(data)}`);
  }

  return {
    last: Number(last),
    high: ticker.high !== undefined ? Number(ticker.high) : undefined,
    low: ticker.low !== undefined ? Number(ticker.low) : undefined,
    volume: ticker.vol ?? ticker.volume,
  };
}
