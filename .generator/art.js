/* =========================================================
   Project illustrations — one bespoke, animated SVG per project
   that shows what the system actually does.
   Each takes a theme (LIGHT by default, LIME for hover states).
   ========================================================= */
const LIGHT = {
  bg: "#ebeee0", fg: "#282c20", onFg: "#d2ff00", ink: "#282c20",
  mute: "rgba(40,44,32,.5)", line: "rgba(40,44,32,.14)",
};
const LIME = {
  bg: "#d2ff00", fg: "#282c20", onFg: "#d2ff00", ink: "#282c20",
  mute: "rgba(40,44,32,.55)", line: "rgba(40,44,32,.16)",
};
const M = `font-family="JetBrains Mono, ui-monospace, monospace"`;
const D = `font-family="Bricolage Grotesque, system-ui, sans-serif" font-weight="800"`;
const B = `font-family="Inter, 'Nirmala UI', system-ui, sans-serif"`;

const wrap = (w, h, t, body) =>
  `<svg class="art-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="${w}" height="${h}" fill="${t.bg}"/>${body}</svg>`;
const flow = (d, t, dur = "1s") =>
  `<path d="${d}" fill="none" stroke="${t.fg}" stroke-width="1.5" stroke-dasharray="4 6"><animate attributeName="stroke-dashoffset" from="20" to="0" dur="${dur}" repeatCount="indefinite"/></path>`;
const blink = (dur = "1.2s") => `<animate attributeName="opacity" values="1;.25;1" dur="${dur}" repeatCount="indefinite"/>`;

const ART = {
  /* ---------- AirAsia gallery (400 x 500) ---------- */

  // MCP server: many agents ⇄ one protocol ⇄ many tools
  mcp: t => wrap(400, 400, t, `
    <text x="24" y="44" ${M} font-size="12" fill="${t.mute}">mcp://tools.internal</text>
    ${["legal-agent", "brd-agent", "mail-agent"].map((s, i) => {
      const y = 110 + i * 90;
      return `<rect x="16" y="${y}" width="108" height="36" rx="18" fill="none" stroke="${t.line}" stroke-width="1.5"/>
        <text x="70" y="${y + 22}" text-anchor="middle" ${M} font-size="11" fill="${t.ink}">${s}</text>
        ${flow(`M124 ${y + 18} C 142 ${y + 18}, 138 225, 156 225`, t)}`;
    }).join("")}
    ${["bigquery", "cloud storage", "internal apis"].map((s, i) => {
      const y = 110 + i * 90;
      return `<rect x="276" y="${y}" width="108" height="36" rx="10" fill="none" stroke="${t.line}" stroke-width="1.5"/>
        <text x="330" y="${y + 22}" text-anchor="middle" ${M} font-size="11" fill="${t.ink}">${s}</text>
        ${flow(`M244 225 C 262 225, 258 ${y + 18}, 276 ${y + 18}`, t)}`;
    }).join("")}
    <circle cx="200" cy="225" r="46" fill="none" stroke="${t.fg}">
      <animate attributeName="r" values="44;74" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".7;0" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <rect x="156" y="190" width="88" height="70" rx="18" fill="${t.fg}"/>
    <text x="200" y="234" text-anchor="middle" ${D} font-size="26" fill="${t.onFg}">MCP</text>
    <text x="200" y="384" text-anchor="middle" ${M} font-size="11" fill="${t.mute}">one protocol · every agent · every tool</text>`),

  // Legal Q&A: question → grounded answer with a citation; days → seconds
  legal: t => wrap(400, 400, t, `
    <text x="24" y="44" ${M} font-size="12" fill="${t.mute}">legal-qa · google adk</text>
    <rect x="96" y="66" width="280" height="62" rx="16" fill="${t.line}"/>
    <text ${B} font-size="13" fill="${t.ink}"><tspan x="114" y="93">Can we end the vendor contract</tspan><tspan x="114" y="113">early without a penalty?</tspan></text>
    <rect x="24" y="146" width="304" height="128" rx="16" fill="${t.fg}"/>
    <text ${B} font-size="13" fill="${t.onFg}"><tspan x="42" y="174">Yes. Clause 7.2 allows early</tspan><tspan x="42" y="194">termination with 30 days' written</tspan><tspan x="42" y="214">notice, and no penalty applies.</tspan></text>
    <rect x="40" y="232" width="196" height="26" rx="13" fill="${t.onFg}"/>
    <text x="54" y="249" ${M} font-size="10" fill="${t.fg}">§7.2 · vendor_msa.pdf · p.14</text>
    <circle cx="44" cy="300" r="3" fill="${t.mute}">${blink(".9s")}</circle>
    <circle cx="56" cy="300" r="3" fill="${t.mute}"><animate attributeName="opacity" values="1;.25;1" dur=".9s" begin=".2s" repeatCount="indefinite"/></circle>
    <circle cx="68" cy="300" r="3" fill="${t.mute}"><animate attributeName="opacity" values="1;.25;1" dur=".9s" begin=".4s" repeatCount="indefinite"/></circle>
    <text x="24" y="336" ${M} font-size="11" fill="${t.mute}">review turnaround</text>
    <text x="24" y="378" ${D} font-size="34" fill="${t.mute}">days</text>
    <line x1="20" y1="366" x2="104" y2="366" stroke="${t.mute}" stroke-width="3"/>
    <text x="118" y="378" ${D} font-size="34" fill="${t.fg}">→ seconds</text>`),

  // BRD generator: messy stakeholder notes → structured spec
  brd: t => {
    const notes = [[22, 78, -6, "faster refunds pls"], [30, 166, 5, "mobile first!"], [18, 252, -4, "KPI: CSAT up"], [64, 328, 3, "launch by Q3?"]];
    const secs = ["01 scope", "02 requirements", "03 success kpis", "04 timeline"];
    return wrap(400, 400, t, `
      <text x="24" y="44" ${M} font-size="12" fill="${t.mute}">stakeholder input → brd</text>
      ${notes.map(([x, y, r, s]) => `<g transform="rotate(${r} ${x + 60} ${y + 30})">
        <rect x="${x}" y="${y}" width="128" height="58" rx="6" fill="${t.line}"/>
        <text x="${x + 12}" y="${y + 34}" ${B} font-size="12" font-style="italic" fill="${t.ink}">${s}</text></g>`).join("")}
      <path d="M170 228 H 206" stroke="${t.fg}" stroke-width="2"/><path d="M200 221 L208 228 L200 235" fill="none" stroke="${t.fg}" stroke-width="2"/>
      <rect x="218" y="66" width="162" height="318" rx="10" fill="${t.ink}"/>
      <text x="234" y="98" ${D} font-size="17" fill="${t.onFg}">BRD v1.0</text>
      <rect x="234" y="108" width="40" height="4" rx="2" fill="${t.fg === "#d2ff00" ? "#9bbd00" : t.onFg}"/>
      ${secs.map((s, i) => {
        const y = 140 + i * 62;
        return `<text x="234" y="${y}" ${M} font-size="10" fill="${t.onFg}">${s}</text>
          <rect x="234" y="${y + 10}" width="${118 - i * 6}" height="6" rx="3" fill="${t.onFg}" opacity=".22"/>
          <rect x="234" y="${y + 22}" width="${84 + i * 8}" height="6" rx="3" fill="${t.onFg}" opacity=".22"/>`;
      }).join("")}`);
  },

  // Email routing: inbox → Gemini triage → regional queues
  email: t => {
    const rows = ["Refund request · AK 512", "Delayed baggage at KUL", "Group booking · 24 pax", "Seat change request"];
    const lanes = ["refunds", "baggage", "groups", "seats"];
    return wrap(400, 400, t, `
      <text x="24" y="44" ${M} font-size="12" fill="${t.mute}">shared inbox · unread</text>
      ${rows.map((s, i) => {
        const y = 60 + i * 38;
        return `<rect x="24" y="${y}" width="352" height="30" rx="8" fill="${t.line}"/>
          <circle cx="40" cy="${y + 15}" r="4" fill="${t.fg}"/>
          <text x="54" y="${y + 19}" ${B} font-size="12" fill="${t.ink}">${s}</text>`;
      }).join("")}
      ${flow("M200 214 V 236", t)}
      <path d="M200 236 C 203 252, 208 257, 224 260 C 208 263, 203 268, 200 284 C 197 268, 192 263, 176 260 C 192 257, 197 252, 200 236 Z" fill="${t.fg}">
        <animateTransform attributeName="transform" type="rotate" values="0 200 260;90 200 260;90 200 260" dur="3s" repeatCount="indefinite"/></path>
      <text x="236" y="264" ${M} font-size="10" fill="${t.mute}">gemini triage</text>
      ${lanes.map((s, i) => {
        const x = 24 + i * 90;
        return `<rect x="${x}" y="318" width="80" height="58" rx="10" fill="none" stroke="${t.line}" stroke-width="1.5"/>
          <text x="${x + 40}" y="344" text-anchor="middle" ${M} font-size="10" fill="${t.ink}">${s}</text>
          <text x="${x + 40}" y="364" text-anchor="middle" ${M} font-size="9" fill="${t.fg}">sla ✓</text>
          <circle r="4" fill="${t.fg}"><animateMotion dur="1.8s" begin="${i * 0.45}s" repeatCount="indefinite" path="M200 286 Q ${(200 + x + 40) / 2} 300 ${x + 40} 318"/></circle>`;
      }).join("")}`);
  },

  // Ingestion pipeline: unstructured text → stages → live dashboard
  pipeline: t => {
    const raw = [[24, 66, 210], [48, 80, 150], [24, 94, 260], [70, 108, 120], [24, 122, 190], [40, 136, 230]];
    const bars = [42, 58, 50, 76, 70, 96, 118];
    return wrap(400, 400, t, `
      <text x="24" y="44" ${M} font-size="12" fill="${t.mute}">raw comms → analytics</text>
      ${raw.map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="6" rx="3" fill="${t.mute}" opacity=".5"/>`).join("")}
      ${["extract", "structure", "bigquery"].map((s, i) => {
        const x = 24 + i * 124, last = i === 2;
        return `<rect x="${x}" y="176" width="104" height="36" rx="18" ${last ? `fill="${t.fg}"` : `fill="none" stroke="${t.line}" stroke-width="1.5"`}/>
          <text x="${x + 52}" y="199" text-anchor="middle" ${M} font-size="11" fill="${last ? t.onFg : t.ink}">${s}</text>`;
      }).join("")}
      ${flow("M128 194 H 148", t)}${flow("M252 194 H 272", t)}
      ${flow("M120 146 V 168", t)}
      <text x="24" y="250" ${M} font-size="11" fill="${t.mute}">leadership dashboard · live</text>
      <line x1="24" y1="376" x2="376" y2="376" stroke="${t.line}" stroke-width="1.5"/>
      ${bars.map((h, i) => `<rect x="${32 + i * 49}" y="${376 - h}" width="32" height="${h}" rx="4" fill="${t.fg}" opacity="${i === bars.length - 1 ? 1 : 0.35 + i * 0.07}">
        <animate attributeName="height" values="0;${h}" dur="1s" begin="${i * 0.08}s" fill="freeze"/>
        <animate attributeName="y" values="376;${376 - h}" dur="1s" begin="${i * 0.08}s" fill="freeze"/></rect>`).join("")}`);
  },

  // Link service: short link → IAM guard → landing page, with an audit trail
  link: t => wrap(400, 400, t, `
    <text x="24" y="44" ${M} font-size="12" fill="${t.mute}">link service · cloud run</text>
    <rect x="60" y="62" width="280" height="44" rx="22" fill="${t.fg}"/>
    <text x="200" y="89" text-anchor="middle" ${M} font-size="14" fill="${t.onFg}">go/raya-sale-26</text>
    ${flow("M200 106 V 146", t)}
    <path d="M200 148 L232 160 V 186 C 232 206, 218 218, 200 226 C 182 218, 168 206, 168 186 V 160 Z" fill="none" stroke="${t.fg}" stroke-width="2"/>
    <rect x="189" y="182" width="22" height="18" rx="3" fill="${t.fg}"/>
    <path d="M193 182 V 176 a7 7 0 0 1 14 0 V 182" fill="none" stroke="${t.fg}" stroke-width="2"/>
    <text x="246" y="186" ${M} font-size="10" fill="${t.mute}">iam · least</text>
    <text x="246" y="200" ${M} font-size="10" fill="${t.mute}">privilege</text>
    ${flow("M200 228 V 252", t)}
    <rect x="60" y="254" width="280" height="76" rx="10" fill="none" stroke="${t.line}" stroke-width="1.5"/>
    <circle cx="76" cy="268" r="3" fill="${t.mute}"/><circle cx="88" cy="268" r="3" fill="${t.mute}"/><circle cx="100" cy="268" r="3" fill="${t.mute}"/>
    <text x="76" y="298" ${B} font-size="13" fill="${t.ink}">Campaign landing page</text>
    <rect x="76" y="308" width="120" height="6" rx="3" fill="${t.line}"/>
    ${["12:01:07  302  logged", "12:01:09  302  logged", "12:01:12  302  logged"].map((s, i) =>
      `<text x="60" y="${358 + i * 16}" ${M} font-size="10" fill="${t.mute}">${s} <tspan fill="${t.fg}">✓</tspan></text>`).join("")}`),

  /* ---------- Featured (640 x 400) ---------- */

  // Milo: an agentic coding session running fully offline
  milo: t => {
    const ink = "#f1efe6", mute = "rgba(241,239,230,.45)", lime = "#d2ff00";
    const L = [
      [`<tspan fill="${lime}">$</tspan> milo "add retry logic to the http client"`, ink],
      ["  model     local llm · on-device", mute],
      ["  network   not required", mute],
      ["", ink],
      ["plan", lime],
      [`  <tspan fill="${lime}">✓</tspan> read    src/http/client.py`, ink],
      [`  <tspan fill="${lime}">✓</tspan> edit    add retry with exponential backoff`, ink],
      [`  <tspan fill="${lime}">✓</tspan> test    pytest · all passing`, ink],
      [`  <tspan fill="${lime}">▸</tspan> review  apply diff? [y/n]`, ink],
    ];
    return wrap(640, 400, t, `
      <rect x="30" y="28" width="580" height="344" rx="14" fill="#282c20" stroke="${t.line}"/>
      <circle cx="54" cy="48" r="5" fill="rgba(241,239,230,.2)"/><circle cx="72" cy="48" r="5" fill="rgba(241,239,230,.2)"/><circle cx="90" cy="48" r="5" fill="rgba(241,239,230,.2)"/>
      <text x="320" y="52" text-anchor="middle" ${M} font-size="11" fill="${mute}">milo — ~/projects/api</text>
      <line x1="30" y1="68" x2="610" y2="68" stroke="rgba(241,239,230,.1)"/>
      <rect x="494" y="82" width="96" height="24" rx="12" fill="none" stroke="${lime}"/>
      <text x="542" y="98" text-anchor="middle" ${M} font-size="10" fill="${lime}">● offline</text>
      ${L.map(([s, c], i) => `<text x="54" y="${100 + i * 29}" ${M} font-size="13" fill="${c}" xml:space="preserve">${s}</text>`).join("")}
      <rect x="292" y="322" width="9" height="16" fill="${lime}">${blink("1s")}</rect>`);
  },

  /* ---------- Project cards (400 x 400) ---------- */

  // Agronus: farmer asks → RAG copilot answers, grounded in documents
  agronus: t => {
    const px = 150;
    return wrap(400, 400, t, `
      ${[96, 160, 224].map((y, i) => `
        <path d="M24 ${y} h28 l12 12 v38 h-40 Z" fill="none" stroke="${t.line}" stroke-width="1.5"/>
        <rect x="31" y="${y + 18}" width="24" height="3" fill="${t.mute}"/><rect x="31" y="${y + 26}" width="18" height="3" fill="${t.mute}"/>
        ${flow(`M64 ${y + 26} C 100 ${y + 26}, 110 196, ${px + 14} 196`, t, `${1 + i * 0.2}s`)}`).join("")}
      <text x="22" y="296" ${M} font-size="10" fill="${t.mute}">crop docs</text>
      <rect x="${px}" y="20" width="220" height="360" rx="30" fill="none" stroke="${t.line}" stroke-width="2"/>
      <rect x="${px + 80}" y="32" width="60" height="8" rx="4" fill="${t.line}"/>
      <path d="M${px + 22} 70 c 0 -14, 12 -20, 22 -20 c 0 12, -6 22, -22 20 Z" fill="${t.fg}"/>
      <text x="${px + 50}" y="68" ${M} font-size="11" fill="${t.ink}">agronus</text>
      <rect x="${px + 64}" y="84" width="142" height="50" rx="12" fill="${t.line}"/>
      <text ${B} font-size="11" fill="${t.ink}"><tspan x="${px + 76}" y="105">Paddy leaves turning</tspan><tspan x="${px + 76}" y="121">yellow. What do I do?</tspan></text>
      <rect x="${px + 14}" y="146" width="176" height="104" rx="12" fill="${t.fg}"/>
      <text ${B} font-size="11" fill="${t.onFg}"><tspan x="${px + 26}" y="168">Likely nitrogen deficiency.</tspan><tspan x="${px + 26}" y="184">Apply a split dose of urea</tspan><tspan x="${px + 26}" y="200">once the rain clears.</tspan></text>
      <rect x="${px + 24}" y="216" width="150" height="20" rx="10" fill="${t.onFg}"/>
      <text x="${px + 34}" y="230" ${M} font-size="9" fill="${t.fg}">source · crop guide p.12</text>
      <rect x="${px + 14}" y="262" width="192" height="42" rx="10" fill="none" stroke="${t.line}" stroke-width="1.5"/>
      <text x="${px + 26}" y="288" ${M} font-size="10" fill="${t.ink}">☁ 28°C · rain 70% today</text>
      <rect x="${px + 14}" y="330" width="192" height="32" rx="16" fill="none" stroke="${t.line}" stroke-width="1.5"/>
      <text x="${px + 30}" y="350" ${M} font-size="10" fill="${t.mute}">ask anything…</text>
      <circle cx="${px + 188}" cy="346" r="10" fill="${t.fg}"/>`);
  },

  // RealEye: real vs fake classification + frequency-domain artifacts
  realeye: t => {
    const tiles = [[24, 24, true, "0.97"], [208, 24, false, "0.98"], [24, 160, false, "0.95"], [208, 160, true, "0.93"]];
    const spec = [6, 9, 7, 12, 8, 30, 10, 7, 9, 6, 11, 8, 34, 9, 7, 6, 10, 8, 26, 9, 7, 8, 6, 9];
    return wrap(400, 400, t, `
      ${tiles.map(([x, y, fake, p]) => `
        <rect x="${x}" y="${y}" width="168" height="124" rx="12" fill="${t.line}"/>
        <circle cx="${x + 84}" cy="${y + 58}" r="22" fill="${t.mute}" opacity=".55"/>
        <path d="M${x + 44} ${y + 124} C ${x + 44} ${y + 92}, ${x + 124} ${y + 92}, ${x + 124} ${y + 124} Z" fill="${t.mute}" opacity=".55"/>
        ${fake ? `
          <path d="M${x + 54} ${y + 30} h-10 v10 M${x + 114} ${y + 30} h10 v10 M${x + 54} ${y + 92} h-10 v-10 M${x + 114} ${y + 92} h10 v-10" fill="none" stroke="${t.fg}" stroke-width="2"/>
          <rect x="${x}" y="${y}" width="168" height="2" fill="${t.fg}" opacity=".8"><animate attributeName="y" values="${y + 4};${y + 118};${y + 4}" dur="2.6s" repeatCount="indefinite"/></rect>
          <rect x="${x + 8}" y="${y + 8}" width="84" height="20" rx="10" fill="${t.fg}"/>
          <text x="${x + 50}" y="${y + 22}" text-anchor="middle" ${M} font-size="10" fill="${t.onFg}">FAKE ${p}</text>`
        : `<rect x="${x + 8}" y="${y + 8}" width="84" height="20" rx="10" fill="none" stroke="${t.mute}"/>
          <text x="${x + 50}" y="${y + 22}" text-anchor="middle" ${M} font-size="10" fill="${t.ink}">REAL ${p}</text>`}`).join("")}
      <text x="24" y="314" ${M} font-size="10" fill="${t.mute}">frequency spectrum · gan artifacts</text>
      ${spec.map((h, i) => `<rect x="${24 + i * 10}" y="${372 - h}" width="6" height="${h}" rx="2" fill="${h > 20 ? t.fg : t.mute}" opacity="${h > 20 ? 1 : 0.5}"/>`).join("")}
      <text x="376" y="352" text-anchor="end" ${D} font-size="30" fill="${t.fg}">91%</text>
      <text x="376" y="372" text-anchor="end" ${M} font-size="10" fill="${t.mute}">recall</text>`);
  },

  // ICU posture: pose keypoints on a bed, pressure-risk zones, turn alert
  icu: t => {
    const P = { head: [125, 112], neck: [125, 140], ls: [95, 152], rs: [155, 152], le: [84, 204], re: [166, 204], lw: [80, 252], rw: [170, 252], lh: [108, 242], rh: [142, 242], lk: [106, 296], rk: [144, 296], la: [106, 344], ra: [144, 344] };
    const bones = [["neck", "ls"], ["neck", "rs"], ["ls", "le"], ["le", "lw"], ["rs", "re"], ["re", "rw"], ["neck", "lh"], ["neck", "rh"], ["lh", "rh"], ["lh", "lk"], ["lk", "la"], ["rh", "rk"], ["rk", "ra"]];
    const hot = [[125, 248], [106, 350], [144, 350]];
    return wrap(400, 400, t, `
      <rect x="36" y="32" width="178" height="340" rx="22" fill="none" stroke="${t.line}" stroke-width="2"/>
      <rect x="80" y="48" width="90" height="34" rx="10" fill="${t.line}"/>
      ${hot.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${t.fg}"><animate attributeName="opacity" values=".08;.35;.08" dur="2s" repeatCount="indefinite"/></circle>`).join("")}
      ${bones.map(([a, b]) => `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${t.fg}" stroke-width="2"/>`).join("")}
      <circle cx="${P.head[0]}" cy="${P.head[1]}" r="16" fill="none" stroke="${t.fg}" stroke-width="2"/>
      ${Object.entries(P).filter(([k]) => k !== "head").map(([, [x, y]]) => `<circle cx="${x}" cy="${y}" r="4" fill="${t.ink}"/>`).join("")}
      <text x="234" y="62" ${M} font-size="10" fill="${t.mute}">posture</text>
      <text x="234" y="88" ${D} font-size="22" fill="${t.ink}">supine</text>
      <text x="234" y="124" ${M} font-size="10" fill="${t.mute}">last repositioned</text>
      <text x="234" y="152" ${D} font-size="26" fill="${t.fg}">2h 14m</text>
      <rect x="234" y="170" width="142" height="36" rx="10" fill="${t.fg}">${blink("1.4s")}</rect>
      <text x="305" y="193" text-anchor="middle" ${M} font-size="11" fill="${t.onFg}">⚠ turn patient</text>
      <text x="234" y="240" ${M} font-size="10" fill="${t.mute}">pressure-risk zones</text>
      <text x="234" y="262" ${M} font-size="11" fill="${t.ink}">sacrum   high</text>
      <text x="234" y="280" ${M} font-size="11" fill="${t.ink}">heels    med</text>
      <text x="376" y="352" text-anchor="end" ${D} font-size="30" fill="${t.fg}">95%</text>
      <text x="376" y="372" text-anchor="end" ${M} font-size="10" fill="${t.mute}">accuracy</text>`);
  },

  // HealthSync: multilingual first-aid help + patient ⇄ doctor link
  healthsync: t => {
    const hi = [[20, 34, "Hello"], [262, 40, "Selamat"], [16, 222, "வணக்கம்"], [252, 216, "ආයුබෝවන්"]];
    return wrap(400, 400, t, `
      ${hi.map(([x, y]) => flow(`M${x + 64} ${y + 18} L 200 160`, t, "1.4s")).join("")}
      ${hi.map(([x, y, s]) => `<rect x="${x}" y="${y}" width="128" height="38" rx="19" fill="${t.bg}" stroke="${t.line}" stroke-width="1.5"/>
        <text x="${x + 64}" y="${y + 24}" text-anchor="middle" ${B} font-size="14" fill="${t.ink}">${s}</text>`).join("")}
      <circle cx="200" cy="160" r="48" fill="${t.fg}"/>
      <rect x="190" y="132" width="20" height="56" rx="3" fill="${t.onFg}"/>
      <rect x="172" y="150" width="56" height="20" rx="3" fill="${t.onFg}"/>
      ${[[80, "patient"], [320, "doctor"]].map(([x, s]) => `
        <circle cx="${x}" cy="316" r="13" fill="none" stroke="${t.ink}" stroke-width="2"/>
        <path d="M${x - 22} 356 C ${x - 22} 334, ${x + 22} 334, ${x + 22} 356" fill="none" stroke="${t.ink}" stroke-width="2"/>
        <text x="${x}" y="378" text-anchor="middle" ${M} font-size="10" fill="${t.mute}">${s}</text>`).join("")}
      <line x1="112" y1="330" x2="288" y2="330" stroke="${t.line}" stroke-width="1.5" stroke-dasharray="4 6"/>
      <circle r="5" fill="${t.fg}"><animateMotion dur="2.2s" repeatCount="indefinite" path="M112 330 H 288 H 112"/></circle>
      <text x="200" y="316" text-anchor="middle" ${M} font-size="10" fill="${t.fg}">consult</text>`);
  },

  // Chess coach (featured, 640 x 400): engine flags the blunder, the agent explains the better move
  chessFeature: t => wrap(640, 400, t, `
    <text x="40" y="48" ${M} font-size="12" fill="${t.mute}">game review · move 5 · black to play</text>
    ${chessBoard(t, 40, 72, 30)}
    <text x="320" y="100" ${D} font-size="34" fill="${t.ink}">5…Bxd1??</text>
    <text x="320" y="124" ${M} font-size="11" fill="${t.mute}">blunder · mate in 2 · −100% win chance</text>
    ${chessBubble(t, 320, 140, 280, 13)}
    ${chessCurve(t, 320, 600, 318, 344)}
    <text x="600" y="48" text-anchor="end" ${M} font-size="10" fill="${t.mute}">google adk · gemini · stockfish</text>`),

  // Milo card (400 x 400): the same offline agentic session, sized for the grid
  miloCard: t => {
    const ink = "#f1efe6", mute = "rgba(241,239,230,.45)", lime = "#d2ff00";
    const L = [
      [`<tspan fill="${lime}">$</tspan> milo "add retry logic"`, ink],
      ["  model    local llm · on-device", mute],
      ["  network  not required", mute],
      ["", ink],
      ["plan", lime],
      [`  <tspan fill="${lime}">✓</tspan> read    src/http/client.py`, ink],
      [`  <tspan fill="${lime}">✓</tspan> edit    retry + backoff`, ink],
      [`  <tspan fill="${lime}">✓</tspan> test    pytest · passing`, ink],
      [`  <tspan fill="${lime}">▸</tspan> review  apply diff? [y/n]`, ink],
    ];
    return wrap(400, 400, t, `
      <rect x="20" y="20" width="360" height="360" rx="14" fill="#282c20" stroke="${t.line}"/>
      <circle cx="42" cy="40" r="5" fill="rgba(241,239,230,.2)"/><circle cx="58" cy="40" r="5" fill="rgba(241,239,230,.2)"/><circle cx="74" cy="40" r="5" fill="rgba(241,239,230,.2)"/>
      <text x="220" y="44" text-anchor="middle" ${M} font-size="10" fill="${mute}">milo — ~/projects/api</text>
      <line x1="20" y1="60" x2="380" y2="60" stroke="rgba(241,239,230,.1)"/>
      <rect x="276" y="74" width="88" height="22" rx="11" fill="none" stroke="${lime}"/>
      <text x="320" y="89" text-anchor="middle" ${M} font-size="10" fill="${lime}">● offline</text>
      ${L.map(([s, c], i) => `<text x="40" y="${124 + i * 26}" ${M} font-size="11.5" fill="${c}" xml:space="preserve">${s}</text>`).join("")}
      <rect x="226" y="327" width="8" height="14" fill="${lime}">${blink("1s")}</rect>`);
  },
};

/* ---------- chess coach helpers ---------- */

// Légal's trap after 5.Nxe5, Black to move: the played 5...Bxd1?? (dashed)
// and the engine's 5...dxe5 (animated). Board at (ox, oy), square size s.
function chessBoard(t, ox, oy, s) {
  const sq = (f, r) => [ox + "abcdefgh".indexOf(f) * s + s / 2, oy + (8 - r) * s + s / 2];
  // outline glyphs for White, solid for Black, so the sides read in either theme
  const G = { w: { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙" }, b: { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" } };
  const white = "Ra1 Bc1 Qd1 Ke1 Rh1 Pa2 Pb2 Pc2 Pd2 Pf2 Pg2 Ph2 Nc3 Bc4 Pe4 Ne5";
  const black = "Ra8 Nb8 Qd8 Ke8 Bf8 Ng8 Rh8 Pa7 Pb7 Pc7 Pf7 Ph7 Pd6 Pg6 Bg4";
  const fs = s * 0.8;
  const pieces = (list, fill, side) => list.split(" ").map(p => {
    const [x, y] = sq(p[1], +p[2]);
    return `<text x="${x}" y="${y + fs * 0.34}" text-anchor="middle" font-family="'Segoe UI Symbol','DejaVu Sans',sans-serif" font-size="${fs}" fill="${fill}">${G[side][p[0]]}︎</text>`;
  }).join("");
  const squares = Array.from({ length: 64 }, (_, i) =>
    (i + (i >> 3)) % 2 ? "" : `<rect x="${ox + (i % 8) * s}" y="${oy + (i >> 3) * s}" width="${s}" height="${s}" fill="${t.line}"/>`).join("");
  const [gx, gy] = sq("g", 4), [dx, dy] = sq("d", 1), [d6x, d6y] = sq("d", 6), [ex, ey] = sq("e", 5);
  return `
    <rect x="${ox}" y="${oy}" width="${8 * s}" height="${8 * s}" fill="none" stroke="${t.line}" stroke-width="1.5"/>
    ${squares}
    <rect x="${gx - s / 2}" y="${gy - s / 2}" width="${s}" height="${s}" fill="${t.mute}" opacity=".35"/>
    <rect x="${ex - s / 2}" y="${ey - s / 2}" width="${s}" height="${s}" fill="${t.fg}" opacity=".35"/>
    ${pieces(white, t.ink, "w")}${pieces(black, t.fg, "b")}
    <line x1="${gx}" y1="${gy}" x2="${dx + s * 0.2}" y2="${dy - s * 0.2}" stroke="${t.mute}" stroke-width="2" stroke-dasharray="3 4"/>
    <circle cx="${dx}" cy="${dy}" r="${s * 0.4}" fill="none" stroke="${t.mute}" stroke-width="2"/>
    ${flow(`M${d6x} ${d6y} L ${ex} ${ey}`, t, ".8s")}
    <circle cx="${ex}" cy="${ey}" r="${s * 0.45}" fill="none" stroke="${t.fg}" stroke-width="2">${blink("1.2s")}</circle>`;
}

// The coach's explanation, with the "verified" chip. fs = font size.
function chessBubble(t, x, y, w, fs) {
  const lh = fs * 1.45, pad = fs * 1.1;
  const lines = [["Taking the queen walks", "into 6.Bxf7+ Ke7 7.Nd5#."], ["Play 5…dxe5 instead and", "you're only a pawn down."]];
  let ty = y + pad + fs;
  const text = lines.map((para, i) => {
    if (i) ty += lh * 0.5;
    return para.map(l => { const s = `<tspan x="${x + pad}" y="${ty}">${l}</tspan>`; ty += lh; return s; }).join("");
  }).join("");
  const chipY = ty - lh + fs * 1.1, chipH = fs * 2;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${chipY + chipH + pad - y}" rx="14" fill="${t.fg}"/>
    <text ${B} font-size="${fs}" fill="${t.onFg}">${text}</text>
    <rect x="${x + pad * 0.9}" y="${chipY}" width="${fs * 12}" height="${chipH}" rx="${chipH / 2}" fill="${t.onFg}"/>
    <text x="${x + pad * 0.9 + fs}" y="${chipY + chipH * 0.68}" ${M} font-size="${fs * 0.82}" fill="${t.fg}">✓ stockfish-verified</text>`;
}

// Black's winning chances across the game, falling off a cliff at the blunder.
function chessCurve(t, x0, x1, labelY, mid) {
  const w = x1 - x0, at = f => x0 + w * f;
  const pts = [[0, 0], [.11, -1], [.23, 1], [.34, 0], [.45, 3], [.57, 8], [.68, 12], [.76, 14], [.78, 38], [1, 40]];
  return `
    <text x="${x0}" y="${labelY}" ${M} font-size="10" fill="${t.mute}">black's winning chances</text>
    <line x1="${x0}" y1="${mid}" x2="${x1}" y2="${mid}" stroke="${t.line}" stroke-width="1" stroke-dasharray="3 5"/>
    <polyline points="${pts.map(([f, d]) => `${at(f)},${mid + d}`).join(" ")}" fill="none" stroke="${t.fg}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="${at(.77)}" cy="${mid + 26}" r="5" fill="${t.fg}">${blink(".9s")}</circle>
    <text x="${at(.77) + 10}" y="${mid + 22}" ${M} font-size="10" fill="${t.ink}">Bxd1??</text>`;
}
