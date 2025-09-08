import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/dashboard.css";

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const PER_PAGE = 10;
  const TOP = 100;

  useEffect(() => {
    const fetchTop100 = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: TOP,
              page: 1,
              sparkline: true,
              price_change_percentage: "1h,24h,7d",
            },
          }
        );
        setCoins(res.data);
      } catch (err) {
        console.error("CoinGecko fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTop100();
  }, []);

  const goToCoin = (id) => navigate(`/coin/${id}`);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const totalPages = Math.ceil(coins.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const shown = coins.slice(start, start + PER_PAGE);

  return (
    <div>
      {loading && <div className="loading">Loading coins…</div>}

      {!loading && (
        <>
          <div className="dashboard">
            {shown.map((coin, index) => (
              <div
                key={coin.id}
                className="coin-card"
                onClick={() => goToCoin(coin.id)}
              >
                {/* Rank and Favorite Star */}
                <div className="coin-badge">
                  <span className="coin-rank">#{start + index + 1}</span>
                  <button
                    className={`favorite-btn ${
                      favorites.includes(coin.id) ? "favorited" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(coin.id);
                    }}
                  >
                    ★
                  </button>
                </div>

                <div className="coin-main">
                  <div className="coin-title">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="coin-icon"
                    />
                    <div>
                      <h3>{coin.name}</h3>
                      <span className="symbol">
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button className="buy-btn">Buy</button>
                </div>

                <div className="coin-price">
                  ${coin.current_price.toLocaleString()}
                </div>

                <div className="changes">
                  <span
                    className={
                      coin.price_change_percentage_1h_in_currency > 0
                        ? "pos"
                        : "neg"
                    }
                  >
                    1h:{" "}
                    {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                  </span>
                  <span
                    className={
                      coin.price_change_percentage_24h_in_currency > 0
                        ? "pos"
                        : "neg"
                    }
                  >
                    24h:{" "}
                    {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                  </span>
                  <span
                    className={
                      coin.price_change_percentage_7d_in_currency > 0
                        ? "pos"
                        : "neg"
                    }
                  >
                    7d:{" "}
                    {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                  </span>
                </div>

                <div className="meta">
                  <p>24h Volume: ${coin.total_volume.toLocaleString()}</p>
                  <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
                </div>

                <div className="sparkline">
                  <svg>
                    <polyline
                      fill="none"
                      stroke={
                        coin.price_change_percentage_7d_in_currency > 0
                          ? "green"
                          : "red"
                      }
                      strokeWidth="2"
                      points={coin.sparkline_in_7d.price
                        .map((p, i) => {
                          const maxPrice = Math.max(
                            ...coin.sparkline_in_7d.price
                          );
                          const minPrice = Math.min(
                            ...coin.sparkline_in_7d.price
                          );
                          const scaleHeight = 120; // leave 10px padding top & bottom
                          const scaledY =
                            scaleHeight -
                            ((p - minPrice) / (maxPrice - minPrice)) *
                              scaleHeight;
                          const x =
                            (i / (coin.sparkline_in_7d.price.length - 1)) * 100;
                          return `${x},${scaledY}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination " style={{ backgroundColor: "#fffefe" }}>
              <button onClick={() => setPage(1)} disabled={page === 1}>
                First
              </button>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                Last
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
