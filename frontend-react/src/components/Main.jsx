import { useContext, useEffect, useState } from "react";
import Button from "./Button";
import { AuthContext } from "./AuthProvider";

const Main = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [news, setNews] = useState([]);

  // Fetch crypto news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Example free API (CryptoPanic) → you can replace with backend proxy if needed
        const res = await fetch(
          "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
        );
        const data = await res.json();
        setNews(data.Data.slice(0, 6)); // only first 6 news
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="container d-flex flex-column align-items-center vh-100 mb-5">
      {/* Hero Section */}
      <div className="p-5 border bg-light-dark rounded-3 text-center text-dark bg-light mt-5">
        <h1 className="fw-bold text-dark">Crystal Chart</h1>
        <p className="lead mt-3">
          <strong>
            Track the pulse of the cryptocurrency market. Crystal Chart delivers{" "}
          </strong>
          <strong>real-time prices</strong>,
          <strong> 7-day / 30-day history charts</strong> and
          <strong> AI-powered predictions for the world’s top coins.</strong>
        </p>

        <div className="mt-4">
          {isLoggedIn ? (
            <Button
              className="btn-outline-dark "
              text="Explore More"
              url="/dashboard"
            />
          ) : (
            <Button
              className="btn-outline-dark"
              text="Explore Now"
              url="/login"
            />
          )}
        </div>
      </div>

      {/* Latest News Section */}
      <div className="news-section mt-5 w-100">
        <h2 className="text-center mb-4 fw-bold">📢 Latest Crypto News</h2>
        <div className="row g-4 justify-content-center">
          {news.length > 0 ? (
            news.map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="news-card shadow-sm">
                  <img
                    src={item.imageurl}
                    alt={item.title}
                    className="news-img"
                  />
                  <div className="p-3">
                    <h5 className="news-title">{item.title}</h5>
                    <p className="news-body">
                      {item.body.length > 100
                        ? item.body.slice(0, 100) + "..."
                        : item.body}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-dark"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Loading latest news...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
