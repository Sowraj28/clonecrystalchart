import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/coin.css";

export default function CoinPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [related, setRelated] = useState([]);
  const [convertAmount, setConvertAmount] = useState(1);
  const [convertedValue, setConvertedValue] = useState(0);
  const [targetCurrency, setTargetCurrency] = useState("inr");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // --- Single API call to your Django proxy ---
        // This call will now return both coin and trending data.
        const res = await axios.get(
          `http://localhost:8000/api/v1/api/coins/${id}/`
        );

        // Use the data returned from your proxy
        setCoin(res.data.coin);
        setTrending(res.data.trending);

        // --- Simplified related coins logic ---
        // Since the proxy doesn't fetch related coins by category,
        // we'll use a slice of the trending coins as a fallback.
        // This ensures the "Related Coins" section still has content.
        const relatedCoinsData = res.data.trending
          .filter((c) => c.item.id !== id)
          .slice(0, 5);
        setRelated(relatedCoinsData);
      } catch (err) {
        console.error("Failed to fetch data from proxy:", err);
        setCoin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  if (loading) return <div className="coin-loading">Loading coin details…</div>;
  if (!coin) return <div className="coin-error">Coin not found</div>;

  const priceChange24h = coin.market_data?.price_change_percentage_24h ?? 0;
  const handleConvert = () => {
    const price = coin.market_data?.current_price?.[targetCurrency];
    if (price) {
      setConvertedValue(convertAmount * price);
    }
  };

  return (
    <div className="coin-container">
      <div className="coin-top">
        <div className="coin-left">
          <div className="coin-header">
            <img src={coin.image?.large} alt={coin.name} className="coin-img" />
            <div>
              <h1>{coin.name}</h1>
              <span className="symbol">{coin.symbol?.toUpperCase()}</span>
              <p className="rank">Rank #{coin.market_cap_rank}</p>
            </div>
            <button className="favorite-btn"></button>
          </div>
          <div className="coin-stats">
            <p>
              <strong>Current Price:</strong> ₹
              {coin.market_data?.current_price?.inr?.toLocaleString() ?? "-"}
            </p>
            <p>
              <strong>Market Cap:</strong> ₹
              {coin.market_data?.market_cap?.inr?.toLocaleString() ?? "-"}
            </p>
            <p>
              <strong>24h Volume:</strong> ₹
              {coin.market_data?.total_volume?.inr?.toLocaleString() ?? "-"}
            </p>
            <p>
              <strong>Circulating Supply:</strong>{" "}
              {coin.market_data?.circulating_supply?.toLocaleString() ?? "-"}
            </p>
            <p>
              <strong>Total Supply:</strong>{" "}
              {coin.market_data?.total_supply
                ? coin.market_data.total_supply.toLocaleString()
                : "∞"}
            </p>
          </div>
          <div className="coin-description">
            <h3>About {coin.name}</h3>
            <p>
              {coin.description?.en
                ? coin.description.en.split(". ")[0] + "."
                : "No description available."}
            </p>
          </div>
        </div>
        <div className="coin-right">
          <div className="graph-box">
            <h3>{coin.name} Price Trend (7d)</h3>
            <div className="sparkline">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={priceChange24h > 0 ? "green" : "red"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  points={
                    coin.market_data?.sparkline_7d?.price
                      ? coin.market_data.sparkline_7d.price
                          .map((p, i) => {
                            const prices = coin.market_data.sparkline_7d.price;
                            const maxPrice = Math.max(...prices);
                            const minPrice = Math.min(...prices);
                            const scaledY =
                              100 -
                              ((p - minPrice) / (maxPrice - minPrice)) * 100;
                            const x = (i / (prices.length - 1)) * 100;
                            return `${x},${scaledY}`;
                          })
                          .join(" ")
                      : ""
                  }
                />
              </svg>
            </div>
            <p className="indicator">
              <strong>24h Change:</strong>{" "}
              <span className={priceChange24h > 0 ? "pos" : "neg"}>
                {priceChange24h.toFixed(2)}%{" "}
                {priceChange24h > 0
                  ? "↑ Likely to Increase"
                  : "↓ Likely to Decrease"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="coin-bottom">
        <h2>Top Exchanges</h2>
        <table className="exchange-table">
          <thead>
            <tr>
              <th>Exchange</th>
              <th>Pair</th>
              <th>Price</th>
              <th>Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {coin.tickers?.slice(0, 5).map((t, i) => (
              <tr
                key={i}
                onClick={() => window.open(t.trade_url, "_blank")}
                className="exchange-row"
              >
                <td>{t.market?.name}</td>
                <td>
                  {t.base}/{t.target}
                </td>
                <td>${t.last?.toLocaleString()}</td>
                <td>${t.volume?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="coin-history-converter">
        <div className="coin-historical small-box">
          <h2>{coin.name} Historical Price</h2>
          <p>
            Last Updated:{" "}
            {new Date(coin.market_data?.last_updated).toLocaleString()}
          </p>
          <p>
            <strong>ATH:</strong> ₹
            {coin.market_data?.ath?.inr?.toLocaleString()} on{" "}
            {new Date(coin.market_data?.ath_date?.inr).toLocaleDateString()}
          </p>
          <p>
            <strong>ATL:</strong> ₹
            {coin.market_data?.atl?.inr?.toLocaleString()} on{" "}
            {new Date(coin.market_data?.atl_date?.inr).toLocaleDateString()}
          </p>
        </div>
        <div className="coin-converter small-box">
          <h2>{coin.name} Converter</h2>
          <input
            type="number"
            value={convertAmount}
            onChange={(e) => setConvertAmount(e.target.value)}
          />
          <select
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
          >
            <option value="inr">INR (₹)</option>
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
          </select>
          <button onClick={handleConvert}>Convert</button>
          {convertedValue > 0 && (
            <p>
              {convertAmount} {coin.symbol?.toUpperCase()} ≈{" "}
              {convertedValue.toLocaleString()} {targetCurrency.toUpperCase()}
            </p>
          )}
        </div>
      </div>
      <div className="related-coins">
        <h2>Explore More Coins</h2>
        <div className="coin-grid">
          {related.map((rc) => (
            <div
              key={rc.item.id}
              className="coin-card"
              onClick={() => navigate(`/coin/${rc.item.id}`)}
            >
              <img src={rc.item.small} alt={rc.item.name} />
              <p>{rc.item.name}</p>
              <span>₹{rc.item?.data?.price?.toLocaleString() ?? "-"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="trending-coins">
        <h2>Trending Coins</h2>
        <div className="coin-grid">
          {trending.map((tc) => (
            <div
              key={tc.item.id}
              className="coin-card"
              onClick={() => navigate(`/coin/${tc.item.id}`)}
            >
              <img src={tc.item.small} alt={tc.item.name} />
              <p>{tc.item.name}</p>
              <span>Rank #{tc.item.market_cap_rank}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
