import React from "react";

export default function Header({ tab, setTab, tabs }) {
  return (
    <header
      style={{
        background: "#f3f4f6",
        borderBottom: "1px solid #dcdfe4",
        padding: "1rem 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            ☕ Sam
          </span>

          <span
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Café & CBD
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {tabs.map((t) => {
            const active = tab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  transition: "all .15s ease",

                  background: active
                    ? "#ffffff"
                    : "transparent",

                  color: active
                    ? "#111827"
                    : "#6b7280",

                  boxShadow: active
                    ? "0 1px 3px rgba(0,0,0,0.08)"
                    : "none",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}