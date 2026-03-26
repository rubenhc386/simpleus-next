type ChecklistBoxProps = {
  items?: string[] | null;
  title?: string;
};

export default function ChecklistBox({
  items,
  title = "Checklist recomendado",
}: ChecklistBoxProps) {
  if (!items || items.length === 0) return null;

  return (
    <div
      style={{
        background: "#f0fdf4",
        border: "1px solid #86efac",
        borderRadius: "16px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "999px",
            background: "#dcfce7",
            border: "1px solid #86efac",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#166534",
            fontWeight: 800,
            fontSize: "14px",
            flexShrink: 0,
          }}
        >
          ✓
        </div>

        <strong style={{ color: "#166534", fontSize: "16px" }}>
          {title}
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#ffffff",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                minWidth: "20px",
                borderRadius: "6px",
                border: "2px solid #22c55e",
                background: "#ffffff",
                marginTop: "1px",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                color: "#166534",
                lineHeight: 1.6,
                fontSize: "15px",
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}