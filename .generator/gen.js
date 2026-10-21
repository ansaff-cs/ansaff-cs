/* Builds the profile README SVG cards in the ansaff.com style.
   Run inside a browser (needs text measurement); prints "name base64" lines into #out. */
const BG = "#f4f4ed", BG2 = "#ebeee0", INK = "#282c20", LIMEC = "#d2ff00", ACC = "#5b7a00";
const MUTE = "rgba(40,44,32,.55)", LINE = "rgba(40,44,32,.14)";
const FD = `font-family="Bricolage Grotesque, system-ui, sans-serif" font-weight="800"`;
const FM = `font-family="JetBrains Mono, ui-monospace, monospace"`;
const FI = `font-family="Inter, system-ui, sans-serif"`;
const NS = "http://www.w3.org/2000/svg";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- fonts + measuring ---------- */
const FONTS = [
  ["Bricolage Grotesque", "800", F_display],
  ["JetBrains Mono", "400", F_mono],
  ["Inter", "400", F_inter],
  ["Inter", "600", F_interb],
  ["JetBrains Mono", "700", F_monob],
];
const msvg = document.createElementNS(NS, "svg");
document.body.appendChild(msvg);
function tw(str, fam, size, weight = 400, ls = 0) {
  const t = document.createElementNS(NS, "text");
  t.setAttribute("font-family", fam); t.setAttribute("font-size", size); t.setAttribute("font-weight", weight);
  if (ls) t.setAttribute("letter-spacing", ls);
  t.textContent = str; msvg.appendChild(t);
  const w = t.getComputedTextLength(); msvg.removeChild(t); return w;
}
const twD = (s, size, ls = 0) => tw(s, "Bricolage Grotesque", size, 800, ls);
const twM = (s, size) => tw(s, "JetBrains Mono", size, 400);
const twI = (s, size, w = 400) => tw(s, "Inter", size, w);
function wrapText(str, maxW, measure) {
  const words = str.split(" "), lines = []; let cur = "";
  words.forEach(w => { const t = cur ? cur + " " + w : w; if (measure(t) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
function fontCSS(svg) {
  const used = FONTS.filter(([f]) => svg.includes(f));
  return `<style>${used.map(([f, w, b]) => `@font-face{font-family:"${f}";font-weight:${w};src:url(data:font/woff2;base64,${b}) format("woff2")}`).join("")}</style>`;
}
function doc(w, h, body, { bg = BG } = {}) {
  const inner = `<clipPath id="card"><rect width="${w}" height="${h}" rx="28"/></clipPath>
<g clip-path="url(#card)"><rect width="${w}" height="${h}" fill="${bg}"/>${body}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${fontCSS(inner)}${inner}</svg>`;
}
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
// lime highlighter that "draws" in from the left
// grow from 0 to w after `delay`; the static width is the full one, so renderers without animation still show it
const grow = (w, delay, dur = 0.8) => {
  const k = (delay / (delay + dur)).toFixed(3);
  return `<animate attributeName="width" values="0;0;${w}" keyTimes="0;${k};1" calcMode="spline" keySplines="0 0 1 1;.6 0 .2 1" dur="${delay + dur}s" fill="freeze"/>`;
};
const hl = (x, y, w, h, delay = 0.3) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${LIMEC}" transform="rotate(-1 ${x} ${y + h})">${grow(w, delay)}</rect>`;
const tag = (x, y, s) => `<text x="${x}" y="${y}" ${FM} font-size="14" fill="${MUTE}" letter-spacing=".5">${esc(s)}</text>`;
function pills(x, y, list, { size = 12, h = 28, gap = 8 } = {}) {
  let cx = x;
  return list.map(s => {
    const w = twM(s, size) + 24;
    const out = `<rect x="${cx}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="none" stroke="${LINE}" stroke-width="1.2"/><text x="${cx + 12}" y="${y + h / 2 + size * 0.36}" ${FM} font-size="${size}" fill="${MUTE}">${esc(s)}</text>`;
    cx += w + gap; return out;
  }).join("");
}
// embed an art.js illustration as a nested svg
const embedArt = (svg, x, y, w, h, fit = "slice") =>
  svg.replace('<svg class="art-svg"', `<svg x="${x}" y="${y}" width="${w}" height="${h}"`).replace("xMidYMid slice", `xMidYMid ${fit}`);

/* ---------- hero ---------- */
function sphere(cx, cy, R) {
  const N = 180, nodes = [], edges = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * 2.39996;
    nodes.push([Math.cos(th) * rad, y, Math.sin(th) * rad]);
  }
  nodes.forEach((a, i) => nodes.forEach((b, j) => {
    if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.32) edges.push([i, j]);
  }));
  const rY = 0.7, rX = 0.35, cY = Math.cos(rY), sY = Math.sin(rY), cX = Math.cos(rX), sX = Math.sin(rX);
  const P = nodes.map(([x, y, z]) => {
    const x1 = x * cY - z * sY, z1 = x * sY + z * cY, y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX, s = 2.4 / (2.4 + z2);
    return [cx + x1 * R * s, cy + y1 * R * s, z2];
  });
  const f = n => n.toFixed(1);
  const lines = edges.map(([a, b]) => {
    const d = (P[a][2] + P[b][2]) / 2;
    return `<line x1="${f(P[a][0])}" y1="${f(P[a][1])}" x2="${f(P[b][0])}" y2="${f(P[b][1])}" stroke="${INK}" stroke-opacity="${(0.05 + (1 - d) * 0.14).toFixed(3)}"/>`;
  }).join("");
  const dots = P.map(([x, y, z]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${(1 + (1 - z) * 1.4).toFixed(2)}" fill="${INK}" fill-opacity="${(0.25 + (1 - z) * 0.4).toFixed(2)}"/>`).join("");
  const r = rng(7), front = edges.filter(([a, b]) => P[a][2] + P[b][2] < 0);
  const pulses = Array.from({ length: 18 }, (_, i) => {
    const [a, b] = front[(r() * front.length) | 0], dur = (1.2 + r() * 0.8).toFixed(2);
    return `<circle r="3.2" fill="${LIMEC}" stroke="${INK}" stroke-width="1.2"><animateMotion dur="${dur}s" begin="${(i * 0.31).toFixed(2)}s" repeatCount="indefinite" path="M${f(P[a][0])} ${f(P[a][1])} L${f(P[b][0])} ${f(P[b][1])}"/></circle>`;
  }).join("");
  return `<g stroke-width="1">${lines}${dots}${pulses}<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="140s" repeatCount="indefinite"/></g>`;
}
function marquee(y, h, items, size) {
  const gap = 34; let x = 0; const seq = [];
  items.forEach(s => { seq.push([x, s]); x += twD(s, size, -0.5) + gap; seq.push([x - gap / 2, null]); });
  const W = x, copies = Math.ceil(1400 / W) + 1;
  let out = "";
  for (let c = 0; c < copies; c++) seq.forEach(([sx, s]) => {
    out += s ? `<text x="${(sx + c * W).toFixed(1)}" y="${y + h / 2 + size * 0.34}" ${FD} font-size="${size}" letter-spacing="-.5" fill="${INK}">${esc(s)}</text>`
      : `<path d="M${(sx + c * W).toFixed(1)} ${y + h / 2 - 7} l3 7 l-3 7 l-3 -7z" fill="${INK}"/>`;
  });
  return `<g>${out}<animateTransform attributeName="transform" type="translate" from="0 0" to="${-W.toFixed(1)} 0" dur="${(W / 55).toFixed(1)}s" repeatCount="indefinite"/></g>`;
}
function hero() {
  const W = 1280, H = 660, x = 64;
  const role1 = "AI Engineer — ", role2 = "agentic AI, LLMs & ML systems on Google Cloud";
  const r1 = twI(role1, 24, 600), r2 = twI(role2, 24, 600);
  const ey = "open to ai engineering roles", eyW = twM(ey, 14) + 52;
  const ansW = twD("ansaff", 168, -6);
  const body = `
    ${sphere(1000, 300, 245)}
    <rect x="${x}" y="64" width="${eyW}" height="36" rx="18" fill="${BG}" stroke="${INK}" stroke-width="1.2"/>
    <circle cx="${x + 20}" cy="82" r="5" fill="${LIMEC}" stroke="${INK}" stroke-width="1.2"><animate attributeName="r" values="5;7;5" dur="1.6s" repeatCount="indefinite"/></circle>
    <text x="${x + 36}" y="87" ${FM} font-size="14" fill="${INK}">${ey}</text>
    <text x="${x - 6}" y="268" ${FD} font-size="168" letter-spacing="-6" fill="${INK}">mohamed</text>
    ${hl(x - 4, 330, ansW + 30, 92, 0.4)}
    <text x="${x - 6}" y="410" ${FD} font-size="168" letter-spacing="-6" fill="${INK}">ansaff<tspan fill="${ACC}">.</tspan></text>
    <text x="${x}" y="488" ${FI} font-weight="600" font-size="24" fill="${INK}">${esc(role1)}</text>
    ${hl(x + r1 - 2, 466, r2 + 8, 30, 1.1)}
    <text x="${x + r1}" y="488" ${FI} font-weight="600" font-size="24" fill="${INK}">${esc(role2)}</text>
    <text x="${x}" y="530" ${FM} font-size="14" fill="${MUTE}">based in kuala lumpur, malaysia · ansaff.com</text>
    <g transform="rotate(-1.6 640 610)">
      <rect x="-60" y="578" width="1400" height="64" fill="${LIMEC}"/>
      ${marquee(578, 64, ["agentic ai", "google adk", "model context protocol", "rag", "vertex ai", "computer vision", "deep learning", "vision-language models"], 30)}
    </g>`;
  return doc(W, H, body);
}

/* ---------- airasia stats ---------- */
function stats() {
  const W = 1280, H = 330, colW = (W - 96) / 4;
  const S = [["6", "production systems", "shipped at airasia"], ["50%", "processing overhead", "cut by my gcp pipeline"], ["40%+", "faster feature scoping", "with my brd agent"], ["3", "business teams running", "my agents"]];
  const body = `
    ${tag(48, 62, "// in production · ai intern @ airasia · mar – sep 2026")}
    <text x="${W - 48}" y="62" text-anchor="end" ${FM} font-size="14" fill="${MUTE}">google adk · mcp · gemini · gcp</text>
    <line x1="48" y1="88" x2="${W - 48}" y2="88" stroke="${LINE}"/>
    ${S.map(([n, a, b], i) => {
      const cx = 48 + i * colW, nx = cx + (i ? 32 : 0);
      return `${i ? `<line x1="${cx}" y1="88" x2="${cx}" y2="${H - 40}" stroke="${LINE}"/>` : ""}
        <text x="${nx}" y="210" ${FD} font-size="92" letter-spacing="-3" fill="${INK}">${n}</text>
        <rect x="${nx}" y="226" width="${twD(n, 92, -3)}" height="8" rx="4" fill="${LIMEC}">${grow(twD(n, 92, -3), 0.2 + i * 0.25, 0.9)}</rect>
        <text x="${nx}" y="268" ${FM} font-size="14" fill="${MUTE}">${esc(a)}</text>
        <text x="${nx}" y="290" ${FM} font-size="14" fill="${MUTE}">${esc(b)}</text>`;
    }).join("")}`;
  return doc(W, H, body);
}

/* ---------- research ---------- */
function research() {
  const W = 1280, H = 540, x = 48, maxW = 740;
  const title = wrapText("M-PFT: Angular Margin for Calibrated Prompt-Tuning of Fine-Tuned Vision-Language Models", maxW, s => twD(s, 46, -1.5));
  const authors = ["Shihab Aaqil Ahamed*", "Mohamed Ansaff*", "Nang Khin Myat Lay Phyu", "Udaya S.K.P. Miriya Thanthrige", "Chamira U. S. Edussooriya", "Ranga Rodrigo", "Muhammad Haris Khan"];
  // wrap authors, keeping each name whole
  const aLines = []; let cur = [];
  authors.forEach(a => { const t = [...cur, a].join(", "); if (twI(t, 16) > maxW && cur.length) { aLines.push(cur); cur = [a]; } else cur.push(a); });
  aLines.push(cur);
  const ty0 = 158, tl = 52, ay0 = ty0 + 22 + (title.length - 1) * tl + 44;
  const authorSvg = aLines.map((line, li) => `<text x="${x}" y="${ay0 + li * 26}" ${FI} font-size="16" fill="${MUTE}">${line.map((a, i) => {
    const name = esc(a.replace("*", "")), sep = i < line.length - 1 || li < aLines.length - 1 ? ", " : "";
    const tail = a.endsWith("*") ? `<tspan fill="${ACC}" font-weight="600" dy="-6" font-size="11">*</tspan><tspan dy="6">${sep || " "}</tspan>` : sep;
    return (a.startsWith("Mohamed Ansaff") ? `<tspan fill="${INK}" font-weight="600">${name}</tspan>` : name) + tail;
  }).join("")}</text>`).join("");
  const summary = wrapText("Fixes the base-to-novel dual miscalibration of prompt-tuned vision-language models with two angular objectives, across 9 prompt-tuning methods and 15 datasets.", maxW - 40, s => twI(s, 18));
  const ny = ay0 + (summary.length - 1) * 28 + 12;
  const btn = "code coming soon ↗", bw = twM(btn, 14) + 36, by = ny + 30;
  // angular-margin diagram
  const O = [870, 460], RR = 330, rad = a => a * Math.PI / 180;
  const pt = (a, r = RR) => [O[0] + r * Math.cos(rad(a)), O[1] - r * Math.sin(rad(a))];
  const f = n => n.toFixed(1);
  const zj = 28, zk = 74, col = { j: 47, k: 56 }, sep = { j: 31, k: 71 };
  const sector = (a1, a2, r) => { const [x1, y1] = pt(a1, r), [x2, y2] = pt(a2, r); return `M${O[0]} ${O[1]} L${f(x1)} ${f(y1)} A${r} ${r} 0 0 0 ${f(x2)} ${f(y2)} Z`; };
  const arcP = (a1, a2, r) => { const [x1, y1] = pt(a1, r), [x2, y2] = pt(a2, r); return `M${f(x1)} ${f(y1)} A${r} ${r} 0 0 ${a2 > a1 ? 0 : 1} ${f(x2)} ${f(y2)}`; };
  const KT = `keyTimes="0;.3;.7;1" calcMode="spline" keySplines=".5 0 .2 1;0 0 1 1;.5 0 .2 1" dur="6s" repeatCount="indefinite"`;
  const anim = (attr, a, b) => `<animate attributeName="${attr}" values="${a};${b};${b};${a}" ${KT}/>`;
  const vec = (k) => {
    const [cx1, cy1] = pt(col[k]), [sx1, sy1] = pt(sep[k]);
    return `<line x1="${O[0]}" y1="${O[1]}" x2="${f(cx1)}" y2="${f(cy1)}" stroke="${INK}" stroke-width="2.2">${anim("x2", f(cx1), f(sx1))}${anim("y2", f(cy1), f(sy1))}</line>
      <circle cx="${f(cx1)}" cy="${f(cy1)}" r="8" fill="${INK}">${anim("cx", f(cx1), f(sx1))}${anim("cy", f(cy1), f(sy1))}</circle>`;
  };
  const zero = a => { const [zx, zy] = pt(a); return `<line x1="${O[0]}" y1="${O[1]}" x2="${f(zx)}" y2="${f(zy)}" stroke="${INK}" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="4 6"/><circle cx="${f(zx)}" cy="${f(zy)}" r="8" fill="${BG}" stroke="${INK}" stroke-width="2"/>`; };
  const [lzj] = [pt(zj, RR + 26)], [lzk] = [pt(zk, RR + 26)];
  const body = `
    ${tag(x, 62, "// research")}
    <rect x="${x}" y="84" width="${twM("WACV 2027", 14) + 28}" height="32" rx="16" fill="${INK}"/>
    <text x="${x + 14}" y="105" ${FM} font-size="14" fill="${LIMEC}">WACV 2027</text>
    <text x="${x + twM("WACV 2027", 14) + 42}" y="105" ${FM} font-size="14" fill="${MUTE}">accepted · equal first author</text>
    ${title.map((l, i) => `<text x="${x - 2}" y="${ty0 + 22 + i * tl}" ${FD} font-size="46" letter-spacing="-1.5" fill="${INK}">${esc(l)}</text>`).join("")}
    ${summary.map((l, i) => `<text x="${x}" y="${ay0 + i * 28}" ${FI} font-size="18" fill="${MUTE}">${esc(l)}</text>`).join("")}
    <rect x="${x}" y="${by}" width="${bw}" height="42" rx="21" fill="${LIMEC}" stroke="${INK}" stroke-width="1.2"/>
    <text x="${x + 18}" y="${by + 26}" ${FM} font-size="14" fill="${INK}">${esc(btn)}</text>

    <path d="${arcP(8, 92, RR)}" fill="none" stroke="${LINE}" stroke-width="1.5"/>
    <path d="${sector(col.j, col.k, 150)}" fill="${LIMEC}" stroke="${INK}" stroke-width="1">${anim("d", sector(col.j, col.k, 150), sector(sep.j, sep.k, 150))}</path>
    <path d="${arcP(zj, col.j, 250)}" fill="none" stroke="${ACC}" stroke-width="2.5">${anim("d", arcP(zj, col.j, 250), arcP(zj, sep.j, 250))}</path>
    ${zero(zj)}${zero(zk)}${vec("j")}${vec("k")}
    <circle cx="${O[0]}" cy="${O[1]}" r="5" fill="${INK}"/>
    <text x="1138" y="354" ${FM} font-size="13" fill="${MUTE}">zero-shot j</text>
    <text x="${f(lzk[0] - 30)}" y="${f(lzk[1] - 6)}" ${FM} font-size="13" fill="${MUTE}">zero-shot k</text>
    <text x="${f(pt(52, 92)[0] - 6)}" y="${f(pt(52, 92)[1] + 4)}" ${FM} font-size="15" fill="${INK}">θ</text>
    <text x="${f(pt(18, 262)[0] - 8)}" y="${f(pt(18, 262)[1] + 6)}" ${FM} font-size="15" fill="${ACC}">φ</text>
    <text x="${W - 48}" y="62" text-anchor="end" ${FM} font-size="13" fill="${MUTE}">● tunable   ○ zero-shot</text>
    <text x="${W - 48}" y="${H - 34}" text-anchor="end" ${FM} font-size="13" fill="${MUTE}">push classes apart (θ↑) · anchor to zero-shot (φ↓)</text>`;
  return doc(W, H, body);
}

/* ---------- projects ---------- */
function featured() {
  const W = 1280, H = 496, x = 712, maxW = 520;
  const desc = wrapText("Stockfish analyses every move of your game and flags the mistakes, then a Gemini agent explains them in plain language at your rating level, grounded in engine-verified lines.", maxW, s => twI(s, 18));
  const M3 = [["~3s", "engine review"], ["4–6", "gemini calls"], ["3", "coaching levels"]];
  const body = `
    <rect x="24" y="24" width="656" height="${H - 48}" rx="18" fill="${BG2}"/>
    ${embedArt(ART.chessFeature(LIGHT), 32, 40, 640, 400)}
    ${tag(x, 76, "// featured project · 2026")}
    <text x="${x - 2}" y="148" ${FD} font-size="60" letter-spacing="-2" fill="${INK}">Chess Coach</text>
    ${hl(x - 2, 166, twD("Agent", 60, -2) + 10, 50, 0.4)}
    <text x="${x - 2}" y="208" ${FD} font-size="60" letter-spacing="-2" fill="${INK}">Agent</text>
    ${desc.map((l, i) => `<text x="${x}" y="${258 + i * 27}" ${FI} font-size="18" fill="${MUTE}">${esc(l)}</text>`).join("")}
    ${M3.map(([v, l], i) => `<text x="${x + i * 172}" y="${404}" ${FD} font-size="40" letter-spacing="-1" fill="${INK}">${esc(v)}</text><text x="${x + i * 172}" y="${426}" ${FM} font-size="12" fill="${MUTE}">${esc(l)}</text>`).join("")}
    ${pills(x, 440, ["google adk", "gemini", "stockfish", "cloud run"])}`;
  return doc(W, H, body);
}
function card(artSvg, title, year, descStr, tags) {
  const W = 620, H = 600, x = 32;
  const desc = wrapText(descStr, W - 64, s => twI(s, 17));
  const body = `
    <rect x="20" y="20" width="${W - 40}" height="360" rx="18" fill="${BG2}"/>
    ${embedArt(artSvg, 20, 30, W - 40, 340, "meet")}
    <text x="${x}" y="440" ${FD} font-size="40" letter-spacing="-1.2" fill="${INK}">${esc(title)}</text>
    <text x="${W - 32}" y="440" text-anchor="end" ${FM} font-size="13" fill="${MUTE}">${esc(year)}</text>
    ${desc.map((l, i) => `<text x="${x}" y="${476 + i * 25}" ${FI} font-size="17" fill="${MUTE}">${esc(l)}</text>`).join("")}
    ${pills(x, H - 60, tags)}`;
  return doc(W, H, body);
}

/* ---------- stack ---------- */
function stack() {
  const W = 1280, cols = 4, cw = (W - 96 - 3 * 14) / 4, ch = 74, H = 108 + 4 * (ch + 14) + 30;
  const L = [["Python", "language"], ["SQL", "language"], ["Google ADK", "agents"], ["MCP", "tool protocol"],
    ["LangChain", "llm apps"], ["RAG", "retrieval"], ["PyTorch", "deep learning"], ["TensorFlow", "deep learning"],
    ["Scikit-Learn", "ml"], ["Vertex AI", "gcp"], ["BigQuery", "gcp"], ["Cloud Run", "gcp"],
    ["FastAPI", "apis"], ["Docker", "containers"], ["Git · CI/CD", "delivery"], ["R · Bash", "tooling"]];
  const order = [2, 9, 5, 14, 0, 11, 7, 3, 12, 6, 1, 15, 10, 4, 13, 8]; // pseudo-random lighting order
  const body = `
    ${tag(48, 62, "// the toolchain")}
    <text x="${W - 48}" y="62" text-anchor="end" ${FM} font-size="14" fill="${MUTE}">16 tools · shipping daily</text>
    ${L.map(([n, k], i) => {
      const cx = 48 + (i % cols) * (cw + 14), cy = 92 + Math.floor(i / cols) * (ch + 14), b = (order.indexOf(i) * 0.5).toFixed(1);
      return `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="16" fill="${BG}" stroke="${LINE}" stroke-width="1.2"><animate attributeName="fill" values="${BG};${LIMEC};${LIMEC};${BG};${BG}" keyTimes="0;.06;.12;.2;1" dur="8s" begin="${b}s" repeatCount="indefinite"/></rect>
        <text x="${cx + 20}" y="${cy + 30}" ${FM} font-size="12" fill="${MUTE}">${esc(k)}</text>
        <text x="${cx + 20}" y="${cy + 56}" ${FI} font-weight="600" font-size="21" fill="${INK}">${esc(n)}</text>`;
    }).join("")}`;
  return doc(W, H, body);
}

/* ---------- footer ---------- */
function footer() {
  const W = 1280, H = 440, x = 56;
  const shipW = twD("shipping.", 150, -5);
  const facts = [["chess", "FIDE Arena Candidate Master"], ["chess", "provincial champion · sri lanka"], ["education", "BSc CS (data science) · cgpa 3.62"], ["certified", "google cloud generative ai leader"]];
  const body = `
    ${tag(x, 70, "// let's build something")}
    <text x="${x - 6}" y="208" ${FD} font-size="150" letter-spacing="-5" fill="${INK}">always</text>
    ${hl(x - 4, 260, shipW + 10, 84, 0.4)}
    <text x="${x - 6}" y="334" ${FD} font-size="150" letter-spacing="-5" fill="${INK}">shipping.</text>
    ${facts.map(([k, v], i) => `<text x="${W - 56}" y="${132 + i * 58}" text-anchor="end" ${FM} font-size="12" fill="${MUTE}">${esc(k)}</text><text x="${W - 56}" y="${156 + i * 58}" text-anchor="end" ${FI} font-weight="600" font-size="19" fill="${INK}">${esc(v)}</text>`).join("")}
    <text x="${x}" y="${H - 34}" ${FM} font-size="14" fill="${MUTE}">mohamedansaff.ai@gmail.com · ansaff.com · linkedin.com/in/ansaff</text>`;
  return doc(W, H, body);
}

