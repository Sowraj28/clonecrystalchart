// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/dashboard.css";

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();

  const PER_PAGE = 10;
  const TOP = 50;
  const user = localStorage.getItem("username") || "Guest";

  // --- Fetch favorites from backend on mount ---
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get("/api/favorites/");
        const favs = {};
        res.data.forEach((f) => {
          favs[f.coin_id] = true;
        });
        setFavorites(favs);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  // --- Toggle favorite in backend ---
  const toggleFavorite = async (coin) => {
    try {
      const res = await axios.post("/api/favorites/toggle/", {
        coin_id: coin.id,
      });
      setFavorites((prev) => {
        const updated = { ...prev };
        if (res.data.added) updated[coin.id] = true;
        if (res.data.removed) delete updated[coin.id];
        return updated;
      });
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // --- Fetch top coins ---
  useEffect(() => {
    const fetchTopCoins = async () => {
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
    fetchTopCoins();
  }, []);

  const goToCoin = (id) => navigate(`/coin/${id}`);
  const totalPages = Math.ceil(coins.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const shown = coins.slice(start, start + PER_PAGE);


  return (
    <div>
      {/* Dashboard header with Favorites button on right */}
      <div
        className="dashboard-header"
        style={{ justifyContent: "space-between" }}
      >
        <h2 style={{ color: "#b98e02ff", margin: 0 }}>
          <strong style={{ color: "#b98e02ff" }}>H</strong>ello{" "}
          <strong style={{ color: "#b98e02ff" }}>{user}!</strong>
        </h2>
        <button
          className="favorites-page-btn"
          onClick={() => navigate("/favorites")}
        >
          ⭐ My Portfolio
        </button>
      </div>

      {loading && <div className="loading">Loading coins…</div>}

      {!loading && (
        <>
          <div className="dashboard">
            {shown.map((coin, index) => {
              const isFav = !!favorites[coin.id]; // check if favorited
              return (
                <div
                  key={coin.id}
                  className="coin-card"
                  onClick={() => goToCoin(coin.id)}
                >
                  <div className="coin-badge">
                    <span className="coin-rank">#{start + index + 1}</span>
                    <div className="top-actions">
                      {/* Favorite Star Button */}
                      <button
                        className="favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(coin);
                        }}
                        style={{
                          color: isFav ? "gold" : "#bbb",
                        }}
                      >
                        ★
                      </button>
                      <button className="buy-btn">Buy</button>
                    </div>
                  </div>

                  <div className="coin-details">
                    <div className="coin-main">
                      <div className="coin-title">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="coin-icon"
                        />
                        <div>
                          <h3 className="coin-name">{coin.name}</h3>
                          <span className="symbol">
                            {coin.symbol.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="coin-price">
                      ${coin.current_price?.toLocaleString() ?? "-"}
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
                        {coin.price_change_percentage_1h_in_currency?.toFixed(
                          2
                        ) ?? "-"}
                        %
                      </span>
                      <span
                        className={
                          coin.price_change_percentage_24h_in_currency > 0
                            ? "pos"
                            : "neg"
                        }
                      >
                        24h:{" "}
                        {coin.price_change_percentage_24h_in_currency?.toFixed(
                          2
                        ) ?? "-"}
                        %
                      </span>
                      <span
                        className={
                          coin.price_change_percentage_7d_in_currency > 0
                            ? "pos"
                            : "neg"
                        }
                      >
                        7d:{" "}
                        {coin.price_change_percentage_7d_in_currency?.toFixed(
                          2
                        ) ?? "-"}
                        %
                      </span>
                    </div>

                    <div className="meta">
                      <p>
                        24h Volume: $
                        {coin.total_volume?.toLocaleString() ?? "-"}
                      </p>
                      <p>
                        Market Cap: ${coin.market_cap?.toLocaleString() ?? "-"}
                      </p>
                    </div>
                  </div>

                  {coin.sparkline_in_7d?.price && (
                    <div className="dash-graph">
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
                              const scaleHeight = 70;
                              const scaledY =
                                scaleHeight -
                                ((p - minPrice) / (maxPrice - minPrice)) *
                                  scaleHeight;
                              const x =
                                (i / (coin.sparkline_in_7d.price.length - 1)) *
                                100;
                              return `${x},${scaledY}`;
                            })
                            .join(" ")}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
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
