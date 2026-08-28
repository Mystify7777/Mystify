import { useState } from "react";

const MODES = ["recruiter", "explorer", "engineer"];

const ACCENT = {
  recruiter: { hex: "#c9924a", rgb: "201,146,74", label: "muted amber" },
  explorer:  { hex: "#9b7fd4", rgb: "155,127,212", label: "muted violet" },
  engineer:  { hex: "#00d4ff", rgb: "0,212,255",   label: "muted cyan" },
};

const SPEC = {
  recruiter: {
    topBar: [
      {
        zone: "LEFT",
        elements: [
          {
            name: "Mystify Logo",
            icon: "◈",
            description: "Responsive wordmark. Full 'Mystify' script on screens ≥500px. Shrinks to 'My' mark below 500px.",
            states: [
              { trigger: "Default", behavior: "Displays wordmark at low opacity. Sits quietly." },
              { trigger: "Hover", behavior: "Trace glow animates along letterforms. Slight scale-up (1.04×). No label." },
              { trigger: "Click", behavior: "Refreshes / reloads the page. Single action, no confirmation." },
            ],
          },
          {
            name: "◈ ENV Pill",
            icon: "◈ ENV",
            description: "Mode/environment indicator. Muted amber. Called ENV not MODE — 'environment' implies perspective, not settings.",
            states: [
              { trigger: "Default", behavior: "Static pill. Amber border, low opacity fill. No pulsing." },
              { trigger: "Hover", behavior: "Border brightens. Tooltip appears: 'Ready to change perspective'. Subtle glow." },
              { trigger: "Click", behavior: "Opens mode switch overlay (small, not fullscreen). Three options: Explorer · Engineer · Cancel." },
            ],
          },
        ],
      },
      {
        zone: "CENTER",
        elements: [
          {
            name: "Contextual Text",
            icon: "—",
            description: "Dynamic single-line readout. Small, monospace, low opacity. Feels like a system readout, not a message. Warm and clear — never mysterious in Recruiter.",
            states: [
              { trigger: "Default idle", behavior: "Welcome, Observer." },
              { trigger: "Quick Access open", behavior: "Here's what matters." },
              { trigger: "Profile open", behavior: "Getting to know me." },
              { trigger: "Projects open", behavior: "Reviewing my work." },
              { trigger: "Certificates open", behavior: "Proof of learning." },
              { trigger: "Resume / Contact open", behavior: "Ready to connect." },
              { trigger: "Idle 30s+", behavior: "Take your time." },
              { trigger: "Mode switch in progress", behavior: "Switching perspective..." },
              { trigger: "Hover", behavior: "Border glow appears. Text briefly glitches — 1–2 characters swap for a single frame, like a signal dropout. Then settles. Subtle." },
              { trigger: "Click (1–6×)", behavior: "Playful response appears in place of contextual text: 'you're too close, don't poke me or else...' Pulse animation on each click. Text resets after 3s." },
              { trigger: "Click (7× within 4s)", behavior: "Knight entity summoned. Silhouette appears top-right corner. 1.5 seconds. Looks toward cursor. Disappears. No text. No achievement. No explanation. localStorage: knight_seen=true. Future appearances rarer." },
            ],
          },
        ],
      },
      {
        zone: "RIGHT",
        elements: [
          {
            name: "Weather Widget",
            icon: "◌ Clear Skies",
            description: "Displays current weather at creator's location by default. Toggleable to visitor's location. Playful, slightly arrogant tone.",
            states: [
              { trigger: "Default", behavior: "Shows creator's weather + condition. e.g. 'Clear Skies'." },
              { trigger: "Hover", behavior: "Bottom glow. Tooltip: 'It's master's location, click to get yours.'" },
              { trigger: "Click (first)", behavior: "Requests location access. On grant: shows 'Clear Skies · Your Sector' for 1s, then resolves to actual city. e.g. 'Clear Skies · Patna'. Feels intelligent." },
              { trigger: "Hover (after visitor location set)", behavior: "Helpful ambient suggestion. e.g. 'Don't go out without an umbrella.' Context-aware." },
              { trigger: "Click (second)", behavior: "Switches back to creator's location." },
              { trigger: "Further clicks", behavior: "Toggles between creator and visitor location." },
            ],
          },
          {
            name: "Search / Command Palette",
            icon: "🔍",
            description: "Opens Command Palette. Acts as quick search across the observatory.",
            states: [
              { trigger: "Default", behavior: "Static icon. Low opacity." },
              { trigger: "Hover", behavior: "Subtle brightness increase. Tooltip: 'Looking for something?' Soft hover animation." },
              { trigger: "Click", behavior: "Opens Command Palette overlay." },
              { trigger: "Re-click", behavior: "Toggles Command Palette closed." },
            ],
          },
          {
            name: "Notification Dot",
            icon: "●",
            description: "Simple dot. Recruiter mode — no badge count. Dot only. Matches ambient accent color.",
            states: [
              { trigger: "No notifications", behavior: "Dot absent or barely visible." },
              { trigger: "New notification", behavior: "Dot appears in muted amber. No number." },
              { trigger: "Click", behavior: "Opens notification panel. Dot clears immediately on click." },
              { trigger: "Notification aging", behavior: "Fresh notifications: full opacity. After 10 min: faded. After 1 hr: auto-archived. Observatory cleans up after itself." },
            ],
          },
          {
            name: "Profile Button",
            icon: "👤",
            description: "Simplified icon in Recruiter mode — calm and trustworthy. No layered animation.",
            states: [
              { trigger: "Default", behavior: "Static minimal icon." },
              { trigger: "Hover", behavior: "Subtle brightness. No complex animation in Recruiter." },
              { trigger: "Click", behavior: "Reopens Quick Access Panel." },
            ],
          },
          {
            name: "Clock",
            icon: "18:41",
            description: "24hr format by default. Respects system preference. Real-time.",
            states: [
              { trigger: "Default", behavior: "24hr display. Updates every second." },
              { trigger: "Hover", behavior: "Bottom glow. Tooltip appears." },
              { trigger: "Click", behavior: "Toggles to 12hr format (AM/PM). Multiple clicks toggle between formats." },
            ],
          },
        ],
      },
    ],
    bottomBar: {
      visibility: "Auto-hides after 5s of inactivity. Reappears on mouse-near-bottom.",
      layout: "[ ● log message ·············································· v2.0.1 ]",
      elements: [
        { name: "Ambient Log", behavior: "Single line. Updates every 10–15s. Slow, not frantic. Examples: 'Interface ready. Awaiting input...' / 'Profile module loaded.' / 'Secure connection established.' / 'Session time: 00:01:23'" },
        { name: "Version", behavior: "Static. Bottom right. 'v2.0.1'. Low contrast." },
      ],
    },
  },

  explorer: {
    topBar: [
      {
        zone: "LEFT",
        elements: [
          {
            name: "Mystify Logo",
            icon: "◈",
            description: "Same responsive behavior as Recruiter. Different hover feel.",
            states: [
              { trigger: "Default", behavior: "Same as Recruiter." },
              { trigger: "Hover", behavior: "Trace glow — but slightly more alive. Hint of violet bleed." },
              { trigger: "Click", behavior: "Refreshes page. Same as Recruiter." },
            ],
          },
          {
            name: "◈ ENV Pill",
            icon: "◈ ENV",
            description: "Muted violet. Same pill. Different color, different atmosphere.",
            states: [
              { trigger: "Default", behavior: "Violet border. Soft pulse — almost biological. Barely noticeable." },
              { trigger: "Hover", behavior: "Border brightens. Tooltip: 'Ready to change perspective'." },
              { trigger: "Click", behavior: "Mode switch overlay. Same flow as Recruiter." },
            ],
          },
        ],
      },
      {
        zone: "CENTER",
        elements: [
          {
            name: "Contextual Text",
            icon: "—",
            description: "Atmospheric and aware. The observatory speaks. Never warm, never operational — somewhere between observant and unsettling.",
            states: [
              { trigger: "Default idle", behavior: "The observatory is watching." },
              { trigger: "Exploring desktop", behavior: "There's more than you can see." },
              { trigger: "Terminal open", behavior: "It noticed you opened this." },
              { trigger: "Near hidden area", behavior: "Something feels different here." },
              { trigger: "Entity nearby", behavior: "[empty — entity speaks for itself. No text.]" },
              { trigger: "Discovery made", behavior: "You found something." },
              { trigger: "Revisiting same area", behavior: "You've been here before." },
              { trigger: "Long idle", behavior: "The observatory is patient." },
              { trigger: "Hover", behavior: "Stronger glitch than Recruiter. Longer dropout. Stranger replacement characters. Feels like signal interference." },
              { trigger: "Click (1–6×)", behavior: "More cryptic response: 'the observatory does not appreciate being poked.' Pulse. Resets after 3s." },
              { trigger: "Click (7× within 4s)", behavior: "Knight entity. Same behavior as Recruiter. But in Explorer — Fairy may appear instead (randomized). localStorage tracks which appeared." },
            ],
          },
        ],
      },
      {
        zone: "RIGHT",
        elements: [
          {
            name: "Weather Widget",
            icon: "◌ Clear Skies",
            description: "Same data, different tone. The observatory reframes the weather as environmental awareness.",
            states: [
              { trigger: "Default", behavior: "Creator's weather. Same display." },
              { trigger: "Hover", behavior: "Tooltip: 'The observatory knows where you are.' Slightly unsettling. True." },
              { trigger: "Click", behavior: "Same location request flow. City name appears after 1s delay. But tooltip changes: 'And now it knows where you are too.'" },
            ],
          },
          {
            name: "Search / Command Palette",
            icon: "🔍",
            description: "Same function. Explorer tooltip is different.",
            states: [
              { trigger: "Hover", behavior: "Tooltip: 'Looking for something?' Same as Recruiter." },
              { trigger: "Click", behavior: "Opens Command Palette. In Explorer — palette shows discovered items and hidden hints alongside standard navigation." },
            ],
          },
          {
            name: "Discovery Indicator",
            icon: "◎ ◎ ◌ ◌",
            description: "Quiet progress marker. 4 circles. Fills as hidden things are found. No label. No tooltip explaining what it is. Users figure it out.",
            states: [
              { trigger: "Default (0 found)", behavior: "Four empty circles: ◌ ◌ ◌ ◌" },
              { trigger: "1 discovery", behavior: "◎ ◌ ◌ ◌" },
              { trigger: "All found", behavior: "◎ ◎ ◎ ◎  — subtle pulse for 2s, then settles. No fanfare." },
              { trigger: "Hover", behavior: "No tooltip. Nothing. The silence is intentional." },
            ],
          },
          {
            name: "Observatory Pulse",
            icon: "·",
            description: "A faint breathing dot. Signals the observatory is aware of this session. Not a notification. Not a status. Just presence.",
            states: [
              { trigger: "Default", behavior: "Slow, irregular breathing rhythm. Slightly offset from any other animations." },
              { trigger: "User exploring hidden areas", behavior: "Amplitude increases subtly. Still below conscious notice." },
              { trigger: "Hover", behavior: "Nothing. No tooltip. No response." },
              { trigger: "Click", behavior: "Nothing." },
            ],
          },
          {
            name: "Motion Toggle",
            icon: "∿",
            description: "Controls environmental animation density. Present in Explorer — this mode has the most motion.",
            states: [
              { trigger: "Full motion", behavior: "Soft waveform icon ∿. Animated subtly." },
              { trigger: "Reduced motion", behavior: "Flat line icon —. Stable." },
              { trigger: "Click", behavior: "Toggles between states. No label. Icon communicates state." },
            ],
          },
          {
            name: "Notification Dot",
            icon: "●",
            description: "Numbered badge. Explorer gets counts — they're discovering things.",
            states: [
              { trigger: "New notification", behavior: "Numbered badge in muted violet." },
              { trigger: "Click", behavior: "Opens panel. Badge clears on click." },
              { trigger: "Notification aging", behavior: "Same aging rules as Recruiter. Observatory cleans up." },
            ],
          },
          {
            name: "Profile Button",
            icon: "👤",
            description: "Richer hover in Explorer. Layered animation available.",
            states: [
              { trigger: "Hover", behavior: "More elaborate hover animation than Recruiter. Environmental effect — slight particle or glow." },
              { trigger: "Click", behavior: "Reopens Quick Access Panel." },
            ],
          },
          {
            name: "Clock",
            icon: "18:41",
            description: "Same as Recruiter. 24hr default, toggleable.",
            states: [
              { trigger: "Click", behavior: "Toggles 12/24hr." },
            ],
          },
        ],
      },
    ],
    bottomBar: {
      visibility: "Auto-hides after 5s. Pulse indicates it's alive even when hidden.",
      layout: "[ ● log ·············· ● · ● ·············· ◎ ]",
      elements: [
        { name: "Observant Log", behavior: "Reacts to what the user is doing. Updates contextually, not on a timer. Examples: '[observatory] visitor detected. cataloguing behavior...' / '[memory] 3 interactions recorded.' / '[entity:fairy] signal trace: dormant.' / '[warning] uncharted area ahead.'" },
        { name: "Pulse Dots", behavior: "Three dots. Slightly offset breathing — not synchronized. Biological rhythm. Occasionally sync briefly, then drift apart. Never perfectly mechanical." },
        { name: "Hint Trigger ◎", behavior: "Click: surfaces one cryptic hint from assistant. One per session maximum. Not a help button — more like shaking a magic 8-ball. Icon: ◎ not ?." },
      ],
    },
  },

  engineer: {
    topBar: [
      {
        zone: "LEFT",
        elements: [
          {
            name: "Mystify Logo",
            icon: "◈",
            description: "Same responsive behavior. Sharper feel in Engineer context.",
            states: [
              { trigger: "Default", behavior: "Same as other modes." },
              { trigger: "Hover", behavior: "Trace glow. Cyan bleed. Feels more precise than warm." },
              { trigger: "Click", behavior: "Refreshes page." },
            ],
          },
          {
            name: "◈ ENV Pill",
            icon: "◈ ENV",
            description: "Muted cyan. Sharp edge. No pulse — stable and trustworthy.",
            states: [
              { trigger: "Default", behavior: "Cyan border. No animation. Engineers trust stability." },
              { trigger: "Hover", behavior: "Border brightens. Tooltip: 'Ready to change perspective'." },
              { trigger: "Click", behavior: "Mode switch overlay." },
            ],
          },
        ],
      },
      {
        zone: "CENTER",
        elements: [
          {
            name: "Contextual Text",
            icon: "—",
            description: "Operational readout only. No personality. No glitch. No playfulness. Engineers need to trust this text — it must be stable and precise.",
            states: [
              { trigger: "Default idle", behavior: "All systems nominal." },
              { trigger: "Engine Room open", behavior: "Runtime: healthy." },
              { trigger: "Topology refreshed", behavior: "Topology refreshed." },
              { trigger: "Latency injected", behavior: "Latency: +200ms injected." },
              { trigger: "Cache disabled", behavior: "Cache layer: offline." },
              { trigger: "Chaos mode active", behavior: "⚠ System under stress." },
              { trigger: "Diagnostics open", behavior: "Inspecting runtime state." },
              { trigger: "Safe mode", behavior: "Safe mode: recovering." },
              { trigger: "Hover", behavior: "No glitch. Border glow only. Text is stable — it's a system readout." },
              { trigger: "Click", behavior: "Opens mini diagnostic card inline. 5-line system snapshot: Health · Uptime · Response · Active nodes · Last deploy. No playfulness." },
            ],
          },
        ],
      },
      {
        zone: "RIGHT",
        elements: [
          {
            name: "◉ Connectivity",
            icon: "◉",
            description: "System health + network state. Leftmost in right zone — connection state is foundational. Everything else depends on it. Color encodes state.",
            states: [
              { trigger: "◉ Cyan", behavior: "Connected. Good signal. All nominal." },
              { trigger: "◉ Amber", behavior: "Connected. Degraded. Possibly chaos mode side effect." },
              { trigger: "◉ Red", behavior: "Poor connection. Timeout risk." },
              { trigger: "◉ Gray", behavior: "Offline / cannot reach." },
              { trigger: "Hover", behavior: "Panel appears. Monospace. No charts. Pure signal:\n  Network:    Home-WiFi-5G\n  IP:         192.168.1.xxx (partial mask)\n  Public IP:  102.xx.xx.xx (masked)\n  Latency:    14ms\n  Down:       ↓ 84 Mbps\n  Up:         ↑ 22 Mbps\n  Protocol:   HTTPS / TLS 1.3\nPanel disappears on cursor leave." },
              { trigger: "Unavailable data", behavior: "Row shows 'unavailable' — never disappears. Honest about browser API limitations." },
            ],
          },
          {
            name: "FPS Counter",
            icon: "FPS 60",
            description: "Live frame rate. Color encodes performance tier. Number itself does not animate — only color changes.",
            states: [
              { trigger: "≥55 FPS", behavior: "Cyan. Nominal." },
              { trigger: "40–54 FPS", behavior: "Amber. Degraded." },
              { trigger: "<40 FPS", behavior: "Red. Performance warning." },
              { trigger: "Hover", behavior: "Tooltip: current render tier + what's affecting it." },
              { trigger: "Click", behavior: "Opens performance overlay (if diagnostics available)." },
            ],
          },
          {
            name: "Search / Command Palette",
            icon: "🔍",
            description: "Same function. Engineer palette shows system commands alongside navigation.",
            states: [
              { trigger: "Click", behavior: "Opens Command Palette. Engineer variant includes: system commands, chaos controls shortcuts, debug toggles." },
            ],
          },
          {
            name: "⚙ Debug Toggle",
            icon: "⚙",
            description: "Direct toggle for diagnostic overlay. No modal — immediate.",
            states: [
              { trigger: "Default (off)", behavior: "Icon at low opacity." },
              { trigger: "Hover", behavior: "Brightens. Tooltip: 'Toggle diagnostics overlay'." },
              { trigger: "Click (activate)", behavior: "Diagnostic overlay appears. Icon gets cyan fill + subtle border." },
              { trigger: "Click (deactivate)", behavior: "Overlay dismisses. Icon returns to low opacity." },
            ],
          },
          {
            name: "Motion Toggle",
            icon: "∿",
            description: "Same as Explorer. Present in Engineer — topology animations can be heavy.",
            states: [
              { trigger: "Full motion", behavior: "Waveform ∿." },
              { trigger: "Reduced", behavior: "Flat line —." },
            ],
          },
          {
            name: "Notification Badge",
            icon: "[N]",
            description: "Numbered. Muted cyan outlined capsule. Never red. Categorized by type.",
            states: [
              { trigger: "New notification", behavior: "Count increments. Cyan outlined capsule." },
              { trigger: "Hover", behavior: "Preview of latest notification." },
              { trigger: "Click", behavior: "Opens panel with categories:\n  ⚡ Performance — FPS warnings, render issues\n  ⚙ System — chaos side effects, recovery needed\n  ◈ Observatory — entity appearances, discoveries" },
              { trigger: "Panel options", behavior: "Mark all read OR mark individual items." },
              { trigger: "Notification aging", behavior: "Fresh: full opacity. 10min: faded. 1hr: auto-archived." },
            ],
          },
          {
            name: "Profile Button",
            icon: "👤",
            description: "Richer than Recruiter. Environmental effects available.",
            states: [
              { trigger: "Hover", behavior: "Layered animation. Subtle environmental effect." },
              { trigger: "Click", behavior: "Reopens Quick Access Panel." },
            ],
          },
          {
            name: "Clock",
            icon: "18:41",
            description: "24hr default. Toggleable.",
            states: [
              { trigger: "Click", behavior: "Toggles 12/24hr format." },
            ],
          },
        ],
      },
    ],
    bottomBar: {
      visibility: "Always fixed. Never auto-hides. Critical information always accessible.",
      layout: "[ >_ SYSTEM LOG · ◎ VISITOR ANALYSIS · 🔒 SECURE CONNECTION · ⏱ SESSION · v2.0.1 ]",
      elements: [
        { name: "System Log", behavior: "Clickable — opens terminal in passive log mode. Updates every 500ms. Reflects real system state. Examples: '[21:41:26] Mode switch initiated.' / '[21:41:28] Loading essential data...' / '[21:41:29] Render node online.' / '[21:41:31] FPS dropped below threshold.'" },
        { name: "Visitor Analysis", behavior: "Shows detected intent. Updates when behavior shifts. Examples: 'Intent: Engineer' / 'Intent: Exploring' / 'Intent: Uncertain...' (hesitates) / 'Intent: Testing limits' (chaos mode). Occasionally hesitates — behavioral responsiveness." },
        { name: "Secure Connection", behavior: "Mostly static. States: 'End-to-end encrypted' (normal) / 'Connection nominal' (after chaos op) / 'Verifying integrity...' (brief flash after latency injection)." },
        { name: "Session Timer", behavior: "Always running. 00:00:00 format. Simple. Grounding." },
        { name: "Version", behavior: "Static. 'v2.0.1'." },
      ],
    },
  },
};

const modeColor = (m) => ACCENT[m].hex;

function Badge({ text, color }) {
  return (
    <span style={{
      fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
      border: `1px solid ${color}55`, color, padding: "2px 8px",
      borderRadius: 2, fontFamily: "monospace",
    }}>{text}</span>
  );
}

function StateRow({ trigger, behavior }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "140px 1fr",
      gap: 12, padding: "7px 0",
      borderBottom: "1px solid rgba(255,255,255,0.03)",
    }}>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", fontFamily: "monospace", lineHeight: 1.5 }}>
        {trigger}
      </div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {behavior}
      </div>
    </div>
  );
}

function ElementBlock({ el, accent }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      marginBottom: 8,
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 3,
      overflow: "hidden",
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px", cursor: "pointer",
          background: open ? "rgba(255,255,255,0.03)" : "transparent",
          transition: "background 0.15s",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 11, color: accent, minWidth: 70, letterSpacing: "0.08em" }}>
          {el.icon}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em", flex: 1 }}>
          {el.name}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
          {open ? "▲ collapse" : "▼ expand"}
        </span>
      </div>
      {open && (
        <div style={{ padding: "0 14px 12px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, fontFamily: "monospace", margin: "10px 0 10px", letterSpacing: "0.04em" }}>
            {el.description}
          </p>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Interaction States
          </div>
          {el.states.map((s, i) => <StateRow key={i} {...s} />)}
        </div>
      )}
    </div>
  );
}

function ZoneBlock({ zone, accent }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
        color: accent, marginBottom: 10, paddingBottom: 6,
        borderBottom: `1px solid ${accent}33`,
        fontFamily: "monospace",
      }}>
        ── {zone.zone} ZONE
      </div>
      {zone.elements.map((el, i) => <ElementBlock key={i} el={el} accent={accent} />)}
    </div>
  );
}

function BottomBarBlock({ bar, accent }) {
  return (
    <div style={{
      marginTop: 8,
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 3,
      padding: 16,
    }}>
      <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, marginBottom: 12, fontFamily: "monospace" }}>
        BOTTOM BAR
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 6, letterSpacing: "0.06em" }}>
        Visibility: {bar.visibility}
      </div>
      <div style={{
        background: "rgba(0,0,0,0.3)", borderRadius: 2, padding: "8px 12px",
        fontFamily: "monospace", fontSize: 9, color: `${accent}88`,
        letterSpacing: "0.06em", marginBottom: 14,
      }}>
        {bar.layout}
      </div>
      {bar.elements.map((el, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "130px 1fr",
          gap: 12, padding: "7px 0",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}>
          <div style={{ fontSize: 10, color: accent, fontFamily: "monospace", letterSpacing: "0.06em" }}>{el.name}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: "monospace", lineHeight: 1.7 }}>{el.behavior}</div>
        </div>
      ))}
    </div>
  );
}

export default function StatusBarSpec() {
  const [mode, setMode] = useState("recruiter");
  const spec = SPEC[mode];
  const accent = modeColor(mode);

  return (
    <div style={{
      background: "#07070b",
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: "rgba(255,255,255,0.8)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "#0a0a0e",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <span style={{ color: accent, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Mystify Observatory
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, marginLeft: 12 }}>
            / Status Bar — Complete Spec
          </span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10, letterSpacing: "0.08em" }}>
          all modes · all interactions · v1.0
        </span>
      </div>

      {/* Mode switcher */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "#09090d",
      }}>
        {MODES.map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "11px 0",
            fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em",
            textTransform: "uppercase", background: "transparent", border: "none",
            borderBottom: mode === m ? `2px solid ${modeColor(m)}` : "2px solid transparent",
            color: mode === m ? modeColor(m) : "rgba(255,255,255,0.2)",
            cursor: "pointer", transition: "all 0.15s",
          }}>
            ◈ {m}
          </button>
        ))}
      </div>

      {/* Accent strip */}
      <div style={{
        padding: "10px 20px",
        background: `rgba(${ACCENT[mode].rgb},0.05)`,
        borderBottom: `1px solid rgba(${ACCENT[mode].rgb},0.1)`,
        display: "flex", gap: 20, alignItems: "center",
      }}>
        <Badge text={`${mode} mode`} color={accent} />
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
          accent: {ACCENT[mode].label} · {accent}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", marginLeft: "auto" }}>
          {spec.topBar.reduce((a, z) => a + z.elements.length, 0) + spec.bottomBar.elements.length} elements · click any to expand
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
        {/* Top bar label */}
        <div style={{
          fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)", marginBottom: 16, fontFamily: "monospace",
        }}>
          TOP BAR — 32px · always visible · always at top
        </div>

        {spec.topBar.map((zone, i) => (
          <ZoneBlock key={i} zone={zone} accent={accent} />
        ))}

        <BottomBarBlock bar={spec.bottomBar} accent={accent} />

        {/* Knight note */}
        {mode === "recruiter" && (
          <div style={{
            marginTop: 16, padding: "12px 16px",
            border: `1px solid rgba(${ACCENT.engineer.rgb},0.15)`,
            borderRadius: 3,
            background: "rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: 9, color: "#00d4ff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
              ◈ Knight Entity — Trigger Logic
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", lineHeight: 1.8 }}>
              Threshold: 7 clicks within 4 seconds on center text.<br />
              5 clicks = accidental. 10 clicks = tedious. 7 = intentional.<br />
              Behavior: silhouette appears top-right. 1.5s. Looks toward cursor. Disappears.<br />
              No text. No achievement. No explanation.<br />
              localStorage: knight_seen=true. Future appearances become rarer.
            </div>
          </div>
        )}

        {/* Language note */}
        <div style={{
          marginTop: 16, padding: "12px 16px",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 3,
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Observatory Language Reference
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8,
            fontSize: 9, fontFamily: "monospace", color: "rgba(255,255,255,0.3)", lineHeight: 1.8,
          }}>
            <div>ENV → environment / perspective<br />not "mode" or "settings"</div>
            <div>Sector → a zone or region<br />not "page" or "section"</div>
            <div>Entity → Fairy or Knight<br />not "character" or "mascot"</div>
            <div>Archive → projects store<br />not "portfolio" or "gallery"</div>
            <div>Signal Interface → Terminal<br />(Explorer language only)</div>
            <div>Null Container → Trash<br />(Engineer language only)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
