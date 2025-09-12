// src/components/dashboard/Portfolio.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/portfolio.css";

export default function Portfolio() {
  const [coins, setCoins] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();

  const TOP = 50;
  const PER_PAGE = 5;
  const user = localStorage.getItem("username") || "Guest";

  // Fetch coins
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${TOP}&page=1&sparkline=false`
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Failed to fetch coins:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  // Load portfolio from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("portfolio");
    if (stored) setPortfolio(JSON.parse(stored));
  }, []);

  // Fetch prices for portfolio coins
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const coinIds = Object.keys(portfolio).join(",");
        if (!coinIds) return;
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
      }
    };
    fetchPrices();
  }, [portfolio]);

  // Add/Remove coin
  const toggleCoin = (coinId, qty = 1) => {
    let updated = { ...portfolio };
    if (updated[coinId]) {
      delete updated[coinId];
    } else {
      updated[coinId] = { quantity: parseFloat(qty) || 1 };
    }
    setPortfolio(updated);
    localStorage.setItem("portfolio", JSON.stringify(updated));
  };

  // Navigate to coin detail page
  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`, { state: { from: "/portfolio" } });
  };

  // Total portfolio value
  const totalValue = Object.keys(portfolio).reduce((sum, coinId) => {
    const qty = portfolio[coinId]?.quantity || 0;
    const price = prices[coinId]?.usd || 0;
    return sum + qty * price;
  }, 0);

  // Pagination
  const startIndex = (page - 1) * PER_PAGE;
  const paginatedCoins = coins.slice(startIndex, startIndex + PER_PAGE);
  const totalPages = Math.ceil(coins.length / PER_PAGE);

  // Handle popup confirm
  const handleConfirm = () => {
    if (selectedCoin && quantity) {
      toggleCoin(selectedCoin, quantity);
    }
    setShowPopup(false);
    setQuantity("");
    setSelectedCoin(null);
  };

  return (
    <div className="portfolio-container">
      {/* Top Portfolio Section */}
      <div className="portfolio-header">
        <span className="username">👤 {user}</span>
        <h2>💰 My Portfolio</h2>
        <span className="total-value">
          Total Value: ${totalValue.toLocaleString()}
        </span>
      </div>

      {/* Selected Portfolio Coins */}
      <div className="portfolio-selected">
        {Object.keys(portfolio).length === 0 ? (
          <p>No coins added yet.</p>
        ) : (
          Object.keys(portfolio).map((coinId) => {
            const coin = coins.find((c) => c.id === coinId);
            const qty = portfolio[coinId]?.quantity || 0;
            const price = prices[coinId]?.usd || coin?.current_price || 0;
            const value = qty * price;

            return (
              coin && (
                <div
                  key={coin.id}
                  className="portfolio-coin"
                  onClick={() => handleCoinClick(coin.id)}
                >
                  <img src={coin.image} alt={coin.name} className="coin-icon" />
                  <div>
                    <h4>{coin.name}</h4>
                    <p>
                      ${price.toLocaleString()} × {qty} = $
                      {value.toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCoin(coin.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )
            );
          })
        )}
      </div>

      {/* Main Coin List */}
      {loading && <p>Loading coins…</p>}
      <div className="dashboard">
        {paginatedCoins.map((coin) => {
          const qty = portfolio[coin.id]?.quantity || 0;
          const price = prices[coin.id]?.usd || coin.current_price || 0;
          const value = qty * price;
          const isActive = portfolio[coin.id];

          return (
            <div
              key={coin.id}
              className="coin-card"
              onClick={() => handleCoinClick(coin.id)}
            >
              <div className="coin-details">
                <div className="coin-title">
                  <img src={coin.image} alt={coin.name} className="coin-icon" />
                  <div>
                    <h3>{coin.name}</h3>
                    <span className="symbol">{coin.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <div className="coin-price">
                  ${price.toLocaleString()} | Qty: {qty} | Value: $
                  {value.toLocaleString()}
                </div>
              </div>
              <button
                className={`start-btn ${isActive ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering coin navigation
                  if (isActive) {
                    toggleCoin(coin.id);
                  } else {
                    setSelectedCoin(coin.id);
                    setShowPopup(true);
                  }
                }}
              >
                {isActive ? "Started" : "Start"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ◀ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next ▶
        </button>
      </div>

      {/* Popup Box */}
      {showPopup && (
        <div className="popup-box">
          <h3>Enter Quantity</h3>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div className="popup-actions">
            <button className="confirm-btn" onClick={handleConfirm}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
