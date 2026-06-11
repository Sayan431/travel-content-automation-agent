import { useEffect, useState } from "react";
import api from "../api/client";

const STAT_CONFIG = {
  total_rss_articles: {
    label: "Total RSS Articles",
    meta: "Fetched from feeds",
    icon: "ti-news",
    color: "teal",
  },
  pending_review: {
    label: "Pending Review",
    meta: "Awaiting approval",
    icon: "ti-clock",
    color: "amber",
  },
  rejected: {
    label: "Rejected",
    meta: "Declined content",
    icon: "ti-circle-x",
    color: "red",
  },
  posted: {
    label: "Posted",
    meta: "Live on site",
    icon: "ti-send",
    color: "blue",
  },
  social_posts: {
    label: "Social Posts",
    meta: "Across platforms",
    icon: "ti-brand-instagram",
    color: "orange",
  },
};

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analytics/summary")
      .then((res) => setData(res.data || {}))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dash-loading">
        <i className="ti ti-loader-2" />
        Loading dashboard…
      </div>
    );
  }

  const statKeys = Object.keys(STAT_CONFIG);

  return (
    <>
      <div className="dash-head">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-sub">Content pipeline overview</p>
      </div>

      {Object.keys(data).length === 0 ? (
        <div className="card">
          <p>No dashboard data available.</p>
        </div>
      ) : (
        <div className="dash-stats">
          {statKeys.map((key) => {
            const cfg = STAT_CONFIG[key];
            const value = data[key] ?? 0;
            return (
              <div key={key} className={`dash-stat-card dash-stat-${cfg.color}`}>
                <div className={`dash-stat-icon dash-stat-icon-${cfg.color}`}>
                  <i className={`ti ${cfg.icon}`} aria-hidden="true" />
                </div>
                <div className="dash-stat-label">{cfg.label}</div>
                <div className="dash-stat-value">{value}</div>
                <div className="dash-stat-meta">{cfg.meta}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
