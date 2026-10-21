/* Developer-native cards for the GitHub profile: ansaff.py editor + git-log timeline.
   Uses helpers from gen.js (doc, esc, twM, grow, hl, colours, fonts). */

// fade a line in at time t; static opacity stays 1 so non-animating renderers show everything
const appear = (t, dur = 0.15) => {
  const k = (t / (t + dur)).toFixed(3);
  return `<animate attributeName="opacity" values="0;0;1" keyTimes="0;${k};1" dur="${(t + dur).toFixed(2)}s" fill="freeze"/>`;
};

/* ---------- ansaff.py ---------- */
const CODE = [
  `from engineers import AIEngineer`,
  ``,
  ``,
  `class MohamedAnsaff(AIEngineer):`,
  `    """Builds AI that leaves the notebook."""`,
  ``,
  `    based_in = "Kuala Lumpur, Malaysia"`,
  `    status   = "open to AI engineering roles"`,
  `    focus    = ["agentic AI", "LLMs", "vision-language models"]`,
  ``,
  `    shipped = {  # AI intern @ AirAsia, Mar - Sep 2026`,
  `        "mcp-server":   "tool-calling for every agent team",`,
  `        "legal-agent":  "contract review: days -> seconds",`,
  `        "brd-agent":    "feature scoping, ~40% faster",`,
  `    }`,
  ``,
  `    def research(self):`,
  `        return Paper("M-PFT", venue="WACV 2027", first_author=True)`,
  ``,
  `    def off_hours(self):`,
  `        return "chess"  # FIDE Arena Candidate Master`,
  ``,
  `    def portfolio(self):`,
  `        return "https://ansaff.com"  # the full story`,
];
const KW = new Set(["from", "import", "class", "def", "return", "True", "False", "None"]);
function pyLine(src) {
  const re = /("""[^"]*"""|"[^"]*"|#.*$|[A-Za-z_][A-Za-z0-9_]*|\s+|.)/g;
  let out = "", m, prev = "";
  while ((m = re.exec(src))) {
    const t = m[0], e = esc(t);
    if (t.startsWith('"')) out += `<tspan fill="${ACC}">${e}</tspan>`;
    else if (t.startsWith("#")) out += `<tspan fill="${MUTE}">${e}</tspan>`;
    else if (KW.has(t)) out += `<tspan font-weight="700">${e}</tspan>`;
    else if (t === "self") out += `<tspan fill="${MUTE}">${e}</tspan>`;
    else if (/^[A-Z]/.test(t) || prev === "def") out += `<tspan font-weight="700">${e}</tspan>`;
    else if (/^[=:\[\]{}(),.<>-]$/.test(t)) out += `<tspan fill="${MUTE}">${e}</tspan>`;
    else out += e;
    if (t.trim()) prev = t;
  }
  return out;
}
function editor() {
  const W = 1280, top = 58, fs = 17, lh = 28, gx = 70, cx = 98;
  const cw = twM("0".repeat(20), fs) / 20;
  const y0 = top + 42, H = y0 + (CODE.length - 1) * lh + 34 + 44;
  const col = (line, s) => cx + line.indexOf(s) * cw;
  // lime highlights behind the two strings that matter most
  const mark = (li, s, t) => `<rect x="${col(CODE[li], s) - 3}" y="${y0 + li * lh - fs + 1}" width="${s.length * cw + 6}" height="${fs + 7}" rx="3" fill="${LIMEC}">${appear(t)}</rect>`;
  const lineT = i => 0.25 + i * 0.09;
  const lines = CODE.map((s, i) => `
    <text x="${gx}" y="${y0 + i * lh}" text-anchor="end" ${FM} font-size="${fs - 2}" fill="${MUTE}" fill-opacity=".6">${i + 1}</text>
    ${i === 7 || i === CODE.length - 1 ? "" : `<text x="${cx}" y="${y0 + i * lh}" ${FM} font-size="${fs}" fill="${INK}" xml:space="preserve">${pyLine(s)}${appear(lineT(i))}</text>`}`).join("");
  const last = CODE.length - 1, endX = cx + CODE[last].length * cw + 4;
  const tabs = [["ansaff.py", true], ["research.md", false], ["timeline.log", false]];
  let tx = 112;
  const tabSvg = tabs.map(([name, on]) => {
    const w = twM(name, 13) + 40, s = `
      <rect x="${tx}" y="14" width="${w}" height="${top - 14}" rx="10" fill="${on ? BG : "none"}"/>
      ${on ? `<rect x="${tx}" y="${top - 14}" width="${w}" height="14" fill="${BG}"/><rect x="${tx + 12}" y="14" width="${w - 24}" height="3" rx="1.5" fill="${LIMEC}"/>` : ""}
      <text x="${tx + 20}" y="${top - 16}" ${FM} font-size="13" fill="${on ? INK : MUTE}">${name}</text>`;
    tx += w + 4; return s;
  }).join("");
  // editor "outline" panel on the right, listing the class members
  const OUTLINE = [["v", "based_in"], ["v", "status"], ["v", "focus"], ["v", "shipped"], ["f", "research()"], ["f", "off_hours()"], ["f", "portfolio()"]];
  const px = 930, py = top + 30, pw = 310, outlineH = 118 + (OUTLINE.length - 1) * 32 + 30;
  const body = `
    <rect width="${W}" height="${top}" fill="${BG2}"/>
    ${[30, 52, 74].map(x => `<circle cx="${x}" cy="${top / 2 + 4}" r="6" fill="none" stroke="${INK}" stroke-opacity=".3" stroke-width="1.5"/>`).join("")}
    ${tabSvg}
    <text x="${W - 32}" y="${top / 2 + 9}" text-anchor="end" ${FM} font-size="13" fill="${MUTE}">ansaff-cs / ansaff-cs</text>
    ${lines}
    ${mark(7, '"open to AI engineering roles"', lineT(7) + 0.3)}
    <text x="${cx}" y="${y0 + 7 * lh}" ${FM} font-size="${fs}" fill="${INK}" xml:space="preserve">${pyLine(CODE[7])}${appear(lineT(7))}</text>
    ${mark(last, '"https://ansaff.com"', lineT(last) + 0.3)}
    <text x="${cx}" y="${y0 + last * lh}" ${FM} font-size="${fs}" fill="${INK}" xml:space="preserve">${pyLine(CODE[last])}${appear(lineT(last))}</text>
    <rect x="${endX}" y="${y0 + last * lh - fs + 2}" width="${cw}" height="${fs + 4}" fill="${INK}"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" repeatCount="indefinite"/></rect>
    <g>
      <rect x="${px}" y="${py}" width="${pw}" height="${outlineH}" rx="18" fill="${BG2}"/>
      <text x="${px + 22}" y="${py + 36}" ${FM} font-size="12" fill="${MUTE}" letter-spacing="1">OUTLINE</text>
      <line x1="${px + 22}" y1="${py + 52}" x2="${px + pw - 22}" y2="${py + 52}" stroke="${LINE}"/>
      <text x="${px + 22}" y="${py + 84}" ${FM} font-size="14" font-weight="700" fill="${INK}"><tspan fill="${ACC}">C</tspan>  MohamedAnsaff</text>
      ${OUTLINE.map(([k, n], i) => `<text x="${px + 44}" y="${py + 118 + i * 32}" ${FM} font-size="14" fill="${INK}"><tspan fill="${ACC}">${k}</tspan>  ${n}</text>`).join("")}
      <rect x="${px}" y="${py + outlineH + 18}" width="${pw}" height="64" rx="14" fill="${BG2}"/>
      <text x="${px + 18}" y="${py + outlineH + 44}" ${FM} font-size="12" fill="${MUTE}">$ python -c "print(MohamedAnsaff())"</text>
      <text x="${px + 18}" y="${py + outlineH + 68}" ${FM} font-size="14" font-weight="700" fill="${INK}">AI Engineer · ready to ship</text>
      ${appear(0.4)}
    </g>
    <rect y="${H - 44}" width="${W}" height="44" fill="${BG2}"/>
    <rect x="24" y="${H - 33}" width="${twM("● open to work", 12) + 24}" height="22" rx="11" fill="${LIMEC}"/>
    <text x="36" y="${H - 18}" ${FM} font-size="12" fill="${INK}">● open to work</text>
    <text x="${36 + twM("● open to work", 12) + 30}" y="${H - 18}" ${FM} font-size="12" fill="${MUTE}">main · 0 problems · tests passing</text>
    <text x="${W - 28}" y="${H - 18}" text-anchor="end" ${FM} font-size="12" fill="${MUTE}">Python 3.12 · UTF-8 · Ln ${CODE.length}, Col ${CODE[last].length + 1}</text>`;
  return doc(W, H, body);
}

/* ---------- git log timeline ---------- */
const LOG = [
  ["HEAD -> main", "WACV 2027 accepted: M-PFT, equal first author", "2026"],
  ["", "ship chess-coach-agent: Stockfish + Gemini on Cloud Run", "oct 2026"],
  ["", "release milo: offline-first agentic coding CLI for local LLMs", "sep 2026"],
  ["", "wrap AirAsia internship: 6 systems running in production", "sep 2026"],
  ["", "join AirAsia AI team: Google ADK, MCP, Gemini", "mar 2026"],
  ["", "build Agronus, a RAG copilot for farmers (Imagine Cup)", "2025"],
  ["", "earn FIDE Arena Candidate Master", "2025"],
  ["root", "init: BSc Computer Science (Data Science), full scholarship", "oct 2023"],
];
function gitlog() {
  const W = 1280, x = 48, gxl = 80, row = 62, y0 = 140, H = y0 + (LOG.length - 1) * row + 48;
  const r = rng(42), hash = () => Array.from({ length: 7 }, () => "0123456789abcdef"[(r() * 16) | 0]).join("");
  const body = `
    <text x="${x}" y="62" ${FM} font-size="15" fill="${INK}"><tspan fill="${ACC}" font-weight="700">$</tspan> git log --graph --oneline <tspan font-weight="700">ansaff</tspan></text>
    <text x="${W - 48}" y="62" text-anchor="end" ${FM} font-size="13" fill="${MUTE}">${LOG.length} commits · 1 branch · always shipping</text>
    <line x1="${x}" y1="88" x2="${W - 48}" y2="88" stroke="${LINE}"/>
    <line x1="${gxl}" y1="${y0 - 6}" x2="${gxl}" y2="${y0 + (LOG.length - 1) * row}" stroke="${INK}" stroke-width="2"/>
    ${LOG.map(([ref, msg, date], i) => {
      const y = y0 + i * row, t = 0.2 + i * 0.16, h = hash(), head = i === 0;
      const hx = gxl + 32, mx = hx + twM(h, 14) + 18;
      const refW = ref ? twM(ref, 12) + 22 : 0;
      return `<g>
        ${head ? `<circle cx="${gxl}" cy="${y - 5}" r="9" fill="${LIMEC}" stroke="${INK}" stroke-width="2"><animate attributeName="r" values="9;13;9" dur="1.6s" repeatCount="indefinite"/></circle>`
          : `<circle cx="${gxl}" cy="${y - 5}" r="7" fill="${BG}" stroke="${INK}" stroke-width="2"/>`}
        <text x="${hx}" y="${y}" ${FM} font-size="14" fill="${ACC}">${h}</text>
        ${ref ? `<rect x="${mx}" y="${y - 17}" width="${refW}" height="24" rx="12" fill="${head ? LIMEC : "none"}" stroke="${INK}" stroke-width="1.2"/><text x="${mx + 11}" y="${y}" ${FM} font-size="12" fill="${INK}">${esc(ref)}</text>` : ""}
        <text x="${mx + (ref ? refW + 12 : 0)}" y="${y}" ${FI} font-weight="${head ? 600 : 400}" font-size="18" fill="${INK}">${esc(msg)}</text>
        <text x="${W - 48}" y="${y}" text-anchor="end" ${FM} font-size="13" fill="${MUTE}">${date}</text>
        ${appear(t)}
      </g>`;
    }).join("")}`;
  return doc(W, H, body);
}

/* ---------- run ---------- */
(async () => {
  for (const [f, w, b] of FONTS) { const ff = new FontFace(f, `url(data:font/woff2;base64,${b})`, { weight: w }); await ff.load(); document.fonts.add(ff); }
  const out = { editor: editor(), research: research(), gitlog: gitlog() };
  const pre = document.createElement("pre"); pre.id = "out";
  pre.textContent = Object.entries(out).map(([k, v]) => `${k} ${btoa(unescape(encodeURIComponent(v)))}`).join("\n");
  document.body.appendChild(pre);
})();
