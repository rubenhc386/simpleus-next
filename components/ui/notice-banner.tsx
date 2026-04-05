"use client";

type NoticeBannerProps = {
  title: string;
  message: string;
  type?: "warning" | "info" | "success";
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
  onClose?: () => void;
};

export default function NoticeBanner({
  title,
  message,
  type = "info",
  primaryAction,
  secondaryAction,
  onClose,
}: NoticeBannerProps) {
  const styles = {
    warning: {
      bg: "#fff7ed",
      border: "#fdba74",
      text: "#9a3412",
    },
    info: {
      bg: "#eff6ff",
      border: "#bfdbfe",
      text: "#1e3a8a",
    },
    success: {
      bg: "#ecfdf5",
      border: "#86efac",
      text: "#166534",
    },
  };

  const current = styles[type];

  return (
    <div
      style={{
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.text,
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "220px" }}>
          <div style={{ fontWeight: 700, marginBottom: "6px" }}>
            {title}
          </div>

          <div style={{ fontSize: "14px", lineHeight: 1.6 }}>
            {message}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: current.text,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {primaryAction?.href ? (
            <a
              href={primaryAction.href}
              style={{
                background: "#1d4ed8",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {primaryAction.label}
            </a>
          ) : primaryAction ? (
            <button
              onClick={primaryAction.onClick}
              style={{
                background: "#1d4ed8",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {primaryAction.label}
            </button>
          ) : null}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              style={{
                border: `1px solid ${current.border}`,
                background: "#ffffff",
                color: current.text,
                padding: "10px 14px",
                borderRadius: "10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}