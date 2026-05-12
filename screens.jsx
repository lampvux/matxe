// Screens for the BIKEWATCH '99 click-thru
const { useState, useEffect, useRef } = React

/* ---------------- TITLE ---------------- */
const TitleScreen = ({ onStart }) => (
  <>
    <div className="in-marquee">
      <span>
        ★ NEW HIGH SCORE: GORDO_88 — 14:22 ★ &nbsp;&nbsp; HOT TIP: HONK BEFORE
        YOU BLINK ★ &nbsp;&nbsp; THIEVES HATE THIS ONE WEIRD TRICK ★
        &nbsp;&nbsp;
      </span>
    </div>
    <div className="title-screen">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Sticker color="cherry" rotate={-12}>
          ★ NEW
        </Sticker>
        <h1>BIKEWATCH</h1>
        <Sticker color="sunshine" rotate={10}>
          '99
        </Sticker>
      </div>
      <div className="sub">don't look away. ever.</div>
      <div className="start blink-hard" onClick={() => { AudioEngine.start(); onStart(); }}>
        ▶ PRESS START
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--dmg-dark)",
          marginTop: 12,
        }}
      >
        ©1999 RAD SOFTWARE INC.
      </div>
    </div>
  </>
)

/* ---------------- WATCH (the game) ---------------- */
const WatchScreen = ({ onLose }) => {
  const [time, setTime] = useState(0) // seconds elapsed
  const [vigilance, setVigilance] = useState(100)
  const [panic, setPanic] = useState(0)
  const [thiefX, setThiefX] = useState(-15) // % from right
  const [warning, setWarning] = useState(false)
  const [blinkSticker, setBlinkSticker] = useState(false)

  // tick
  useEffect(() => {
    const t = setInterval(() => {
      setTime((s) => s + 1)
      setVigilance((v) => Math.max(0, v - 2))
    }, 500)
    return () => clearInterval(t)
  }, [])

  // thief approach: every 8s a thief might appear and walk in
  useEffect(() => {
    const id = setInterval(() => {
      if (thiefX < 0 && Math.random() < 0.5) {
        setWarning(true)
        setBlinkSticker(true)
        AudioEngine.thiefWarn()
      }
    }, 4000)
    return () => clearInterval(id)
  }, [thiefX])

  // thief walks in once warning fires
  useEffect(() => {
    if (!warning) return
    const id = setInterval(() => {
      setThiefX((x) => {
        const nx = x + 4
        setPanic((p) => Math.min(100, p + 6))
        if (nx >= 60) {
          AudioEngine.gameOver()
          onLose(time)
        }
        return nx
      })
    }, 250)
    return () => clearInterval(id)
  }, [warning, time, onLose])

  const honk = () => {
    AudioEngine.honk()
    if (warning) {
      setThiefX(-15)
      setWarning(false)
      setBlinkSticker(false)
      setPanic((p) => Math.max(0, p - 30))
      setVigilance(100)
    } else {
      setVigilance((v) => Math.min(100, v + 10))
    }
  }

  const mins = String(Math.floor(time / 120)).padStart(2, "0")
  const secs = String(Math.floor((time / 2) % 60)).padStart(2, "0")
  const ms = String((time * 5) % 100).padStart(2, "0")

  return (
    <>
      <div className="in-marquee">
        <span>
          ★{" "}
          {warning
            ? "INTRUDER ON SIDEWALK !! INTRUDER ON SIDEWALK !!"
            : "all quiet on pine st."}{" "}
          &nbsp;&nbsp; honk = scare ★ alarm = panic ★ &nbsp;&nbsp;
        </span>
      </div>
      <div className="hud" style={{ paddingTop: 24 }}>
        <div className="hud-top">
          <span>SCORE</span>
          <span style={{ fontSize: 14 }}>
            {mins}:{secs}.{ms}
          </span>
          <span>HI 14:22</span>
        </div>
        <div className="hud-stage">
          <Sprites.Sidewalk />
          <div className="bike-sprite">
            <Sprites.Bike scale={2} />
          </div>
          {warning && (
            <div
              className="thief-sprite"
              style={{ right: `${thiefX}%`, bottom: 18 }}
            >
              <Sprites.Thief scale={2} />
            </div>
          )}
          {blinkSticker && (
            <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
              <Sticker
                color="cherry"
                rotate={-8}
                style={{ animation: "blink-hard 0.4s steps(2) infinite" }}
              >
                !! THIEF !!
              </Sticker>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "4px 0",
          }}
        >
          <Meter label="VIGIL" value={vigilance} color="var(--dmg-darkest)" />
          <Meter label="PANIC" value={panic} color="var(--cherry)" />
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          <Button variant="primary" onClick={honk} hotkey="A">
            ▶ HONK
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              AudioEngine.alarm()
              setPanic(100)
              setTimeout(() => setWarning(false), 50)
              setThiefX(-20)
            }}
            hotkey="B"
          >
            !! ALARM
          </Button>
          <Button variant="secondary" onClick={() => { AudioEngine.gameOver(); onLose(time); }}>
            GIVE UP
          </Button>
        </div>
      </div>
    </>
  )
}

/* ---------------- GAME OVER ---------------- */
const OverScreen = ({ onRetry, onMenu, finalTime }) => {
  const mins = String(Math.floor(finalTime / 120)).padStart(2, "0")
  const secs = String(Math.floor((finalTime / 2) % 60)).padStart(2, "0")
  const score = `${mins}:${secs}`
  return (
    <>
      <div
        className="in-marquee"
        style={{ background: "var(--cherry)", color: "var(--paper)" }}
      >
        <span>
          !! YOUR BIKE WAS STOLEN !! &nbsp;&nbsp; LAST SEEN: WEST ON PINE ST !!
          &nbsp;&nbsp; BUMMER DUDE !!
        </span>
      </div>
      <div className="over-screen" style={{ paddingTop: 36 }}>
        <div
          className="blink-hard"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            color: "var(--cherry)",
          }}
        >
          !!! GAME OVER !!!
        </div>
        <h2>BIKE STOLEN</h2>
        <div className="sub">
          you blinked at{" "}
          <span style={{ color: "var(--sunshine)" }}>{score}</span>. bummer
          dude.
        </div>
        <div className="scores">
          <div>
            <span>1. GORDO_88</span>
            <span>14:22</span>
          </div>
          <div>
            <span>2. RAD_TINA</span>
            <span>09:14</span>
          </div>
          <div style={{ color: "var(--hot-magenta)" }}>
            <span>3. YOU</span>
            <span>{score}</span>
          </div>
          <div>
            <span>4. PXLBOY</span>
            <span>00:48</span>
          </div>
        </div>
        <div className="actions">
          <button onClick={() => { AudioEngine.start(); onRetry(); }}>▶ TRY AGAIN</button>
          <button onClick={() => { AudioEngine.click(); onMenu(); }} className="ghost">
            MAIN MENU
          </button>
        </div>
      </div>
    </>
  )
}

/* ---------------- MARKETING SITE ---------------- */
const MarketingScreen = () => (
  <div className="marketing">
    <div className="marketing-inner">
      <div style={{ textAlign: "center" }}>
        <Marquee speed={26}>
          welcome to the official BIKEWATCH '99 homepage !! best viewed in
          netscape navigator 4 !! sign my guestbook !!
        </Marquee>
      </div>
      <div className="marketing-hero">
        <h1 className="blink-hard">BIKEWATCH '99</h1>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 12,
            color: "var(--ink-soft)",
          }}
        >
          THE GAME WHERE YOU JUST. WATCH. THE BIKE.
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 14,
            flexWrap: "wrap",
          }}
        >
          <Sticker color="sunshine" rotate={-8}>
            ★ DOWNLOAD
          </Sticker>
          <Sticker color="magenta" rotate={6}>
            SHAREWARE!
          </Sticker>
          <Sticker color="cyan" rotate={-3}>
            NEW VERSION 1.04
          </Sticker>
        </div>
      </div>

      <h2>★ WHAT IS THIS</h2>
      <p>
        so you've got a bike. someone's gonna steal it. your job is to keep an
        eye on it. don't blink. don't look away. don't check your beeper. don't
        even think about a snack. just <i>watch</i>.
      </p>

      <h2>★ FEATURES</h2>
      <div className="marketing-features">
        <div className="marketing-feature">
          <Icon name="eye" size={32} />
          <h3>VIGILANCE METER</h3>
          drops every second. honk to refill. simple as that.
        </div>
        <div className="marketing-feature">
          <Icon name="alarm" size={32} />
          <h3>THIEF AI</h3>
          they pedal up when you least expect it. scare them off!
        </div>
        <div className="marketing-feature">
          <Icon name="coin" size={32} />
          <h3>HIGH SCORES</h3>
          beat GORDO_88. nobody's beat GORDO_88. you might.
        </div>
      </div>

      <h2>★ SYSTEM REQUIREMENTS</h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 18 }}>
        a web browser (anything works really). a bike. eyes that work. one (1)
        attention span.
      </p>

      <h2>★ CONTACT</h2>
      <div
        style={{
          background: "var(--bg-alt)",
          border: "2px solid var(--ink)",
          boxShadow: "4px 4px 0 0 var(--ink)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontFamily: "var(--font-body)",
          fontSize: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="bell" size={24} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 11 }}>
            GOT A BUG? WANT TO SAY HI?
          </span>
        </div>
        <div>
          shoot an email to:{" "}
          <a
            href="mailto:tunglam195@gmail.com"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "var(--grape)",
              background: "var(--sunshine)",
              padding: "2px 6px",
              border: "2px solid var(--ink)",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            tunglam195@gmail.com
          </a>
        </div>
        <div
          style={{
            fontSize: 16,
            color: "var(--ink-soft)",
            borderTop: "2px dashed var(--ink)",
            paddingTop: 8,
          }}
        >
          also accepting high-score screenshots, fan art, and conspiracy
          theories about the thief.
        </div>
      </div>

      <h2>★ GUESTBOOK</h2>
      <div
        style={{
          background: "var(--paper)",
          border: "2px solid var(--ink)",
          padding: "12px",
          fontFamily: "var(--font-body)",
          fontSize: 18,
          color: "var(--ink-soft)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Icon name="heart" size={20} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 10 }}>
            LATEST ENTRIES
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 16,
          }}
        >
          <div>
            <span style={{ color: "var(--cherry)" }}>GORDO_88:</span> this game
            changed my life. i now watch my bike 24/7.
          </div>
          <div>
            <span style={{ color: "var(--electric-cyan)" }}>RAD_TINA:</span>{" "}
            beat my score or you're a coward !!!
          </div>
          <div>
            <span style={{ color: "var(--grape)" }}>PXLBOY:</span>{" "}
            the thief is actually a metaphor for capitalism. think about it.
          </div>
        </div>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <Sticker color="sunshine" rotate={-2}>
            SIGN IT !!
          </Sticker>
        </div>
      </div>

      <hr />
      <div className="visitor">VISITORS: 00,142,889</div>
      <div className="ring">
        <span>WEBRING:</span>
        <a href="#">[ prev ]</a>
        <a href="#">[ random ]</a>
        <a href="#">[ next ]</a>
        <span style={{ marginLeft: 12, color: "var(--ink-soft)" }}>
          built with NOTEPAD.EXE — last updated: 03 / 14 / '99
        </span>
      </div>
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <img
          src="../assets/sticker-construction.svg"
          style={{ height: 36, imageRendering: "pixelated" }}
        />
      </div>
    </div>
  </div>
)

window.TitleScreen = TitleScreen
window.WatchScreen = WatchScreen
window.OverScreen = OverScreen
window.MarketingScreen = MarketingScreen
