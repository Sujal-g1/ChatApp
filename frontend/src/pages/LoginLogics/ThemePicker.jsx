import React from "react";

const ThemePicker = ({ themes, theme, setTheme }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`theme-dot ${
            theme === t.id ? "active" : ""
          }`}
          style={{
            background: t.color,
          }}
          onClick={() => setTheme(t.id)}
          title={t.label}
        />
      ))}
    </div>
  );
};

export default ThemePicker;