// Reusable components for the BIKEWATCH '99 UI kit

const Icon = ({ name, size = 24, color = "currentColor" }) => (
  <span style={{ display: "inline-block", height: size, lineHeight: 0, color }}>
    <img
      src={`../assets/icons/${name}.svg`}
      alt=""
      style={{
        height: size,
        imageRendering: "pixelated",
        filter: color === "currentColor" ? "none" : undefined,
      }}
    />
  </span>
)

const Button = ({
  variant = "primary",
  children,
  onClick,
  disabled,
  style,
  hotkey,
}) => {
  const palette =
    {
      primary: { bg: "var(--sunshine)", fg: "var(--ink)" },
      secondary: { bg: "var(--paper)", fg: "var(--ink)" },
      danger: { bg: "var(--cherry)", fg: "var(--paper)" },
      info: { bg: "var(--electric-cyan)", fg: "var(--ink)" },
      success: { bg: "var(--lime-zap)", fg: "var(--ink)" },
    }[variant] || {}
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bw-btn"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 12,
        textTransform: "uppercase",
        background: disabled ? "#c0c0c0" : palette.bg,
        color: disabled ? "#777" : palette.fg,
        border: "2px solid var(--ink)",
        padding: "10px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "4px 4px 0 0 var(--ink)",
        position: "relative",
        ...style,
      }}
    >
      {children}
      {hotkey && (
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            background: "var(--ink)",
            color: "var(--paper)",
            fontSize: 8,
            padding: "2px 4px",
            border: "2px solid var(--paper)",
          }}
        >
          {hotkey}
        </span>
      )}
    </button>
  )
}

const Sticker = ({
  children,
  color = "magenta",
  rotate = -8,
  style,
  ...rest
}) => {
  const fills =
    {
      magenta: { bg: "var(--hot-magenta)", fg: "var(--paper)" },
      cyan: { bg: "var(--electric-cyan)", fg: "var(--ink)" },
      sunshine: { bg: "var(--sunshine)", fg: "var(--ink)" },
      lime: { bg: "var(--lime-zap)", fg: "var(--ink)" },
      cherry: { bg: "var(--cherry)", fg: "var(--paper)" },
    }[color] || fills.magenta
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-sticker)",
        fontSize: 18,
        background: fills.bg,
        color: fills.fg,
        padding: "4px 10px",
        border: "2px solid var(--ink)",
        boxShadow: "3px 3px 0 0 var(--ink)",
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}

const Marquee = ({
  children,
  speed = 22,
  bg = "var(--ink)",
  fg = "var(--lime-zap)",
}) => (
  <div
    style={{
      background: bg,
      color: fg,
      fontFamily: "var(--font-display)",
      fontSize: 12,
      border: "2px solid var(--ink)",
      overflow: "hidden",
      whiteSpace: "nowrap",
      padding: "6px 0",
    }}
  >
    <span
      style={{
        display: "inline-block",
        paddingLeft: "100%",
        animation: `bw-mq ${speed}s linear infinite`,
      }}
    >
      {children}
    </span>
    <style>{`@keyframes bw-mq { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>
  </div>
)

const Meter = ({
  label,
  value,
  max = 100,
  color = "var(--lime-zap)",
  warnAt = null,
}) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const c = warnAt != null && pct < warnAt ? "var(--cherry)" : color
  return (
    <div className="meter">
      <span style={{ minWidth: 80 }}>{label}</span>
      <div className="meter-bar">
        <div className="fill" style={{ width: pct + "%", background: c }} />
      </div>
      <span style={{ minWidth: 32, textAlign: "right" }}>
        {Math.round(pct)}%
      </span>
    </div>
  )
}

const Frame = ({ children }) => (
  <div className="console">
    <div className="screen">{children}</div>
    <div className="console-pads">
      <div className="dpad">
        <div className="empty" />
        <div />
        <div className="empty" />
        <div />
        <div />
        <div />
        <div className="empty" />
        <div />
        <div className="empty" />
      </div>
      <div className="ab-buttons">
        <div className="ab" style={{ transform: "translateY(-6px)" }}>
          B
        </div>
        <div className="ab">A</div>
      </div>
    </div>
    <div className="console-row">
      <span>
        <span className="pip on"></span>POWER
      </span>
      <span style={{ color: "var(--ink-soft)" }}>
        BIKEWATCH '99 — DOT MATRIX WITH STEREO SOUND
      </span>
      <span>► START</span>
    </div>
  </div>
)

window.Icon = Icon
window.Button = Button
window.Sticker = Sticker
window.Marquee = Marquee
window.Meter = Meter
window.Frame = Frame
