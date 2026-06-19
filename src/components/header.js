import React from "react";

export default function Header({ tab, setTab, tabs }) {
  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        padding: "1rem",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* TITLE */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 500 }}>☕ Sam</span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>Café & CBD</span>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              border: "none",
              padding: "6px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              background: tab === t.id
                ? "var(--color-background-secondary)"
                : "transparent",
              color: tab === t.id
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
              borderBottom: tab === t.id
                ? "2px solid var(--color-text-primary)"
                : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}