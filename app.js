async function loadData() {
  const res = await fetch("./data/signals.json", { cache: "no-store" });
  if (!res.ok) throw new Error("signals.json missing");
  return res.json();
}

function fmtDate(asof) {
  if (!asof || String(asof).length !== 8) return asof || "—";
  const s = String(asof);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function dirClass(direction) {
  if (direction === "多") return "long";
  if (direction === "空") return "short";
  return "flat";
}

function riskWidth(sig, budget) {
  const r = Number(sig.risk_per_lot) || 0;
  if (!r || !budget) return 8;
  const lots = Math.max(0, Number(sig.lots_l1) || 0);
  const used = lots * r;
  return Math.max(8, Math.min(100, (used / budget) * 100));
}

function renderParams(report) {
  const items = [
    ["Equity", `¥${Number(report.equity).toLocaleString("zh-CN")}`],
    ["单品种风险", `${report.risk_pct}%`],
    ["风险预算", `¥${Number(report.l1_risk_yuan).toLocaleString("zh-CN")}`],
    ["品种数", String((report.signals || []).length)],
  ];
  document.getElementById("paramStrip").innerHTML = items
    .map(
      ([label, value]) =>
        `<div class="param"><span class="label">${label}</span><span class="value">${value}</span></div>`
    )
    .join("");
}

function renderBoard(report) {
  document.getElementById("asofLabel").textContent = `as of ${fmtDate(report.asof)}`;
  const budget = Number(report.l1_risk_yuan) || 3000;
  const html = (report.signals || [])
    .map((s) => {
      const w = riskWidth(s, budget);
      const d = s.direction || "空仓";
      return `<article class="signal">
        <div class="signal-top">
          <div class="code">${s.code}<span style="font-size:0.85rem;color:var(--muted);font-weight:500"> · ${s.name || ""}</span></div>
          <div class="dir ${dirClass(d)}">${d}${s.lots_l1 ? ` ${s.lots_l1}手` : ""}</div>
        </div>
        <div class="meta">
          <div>收盘<strong>${s.close ?? "—"}</strong></div>
          <div>对齐<strong>${s.align ?? "—"}</strong></div>
          <div>R20<strong>${s.r20 ?? "—"}%</strong></div>
          <div>R60<strong>${s.r60 ?? "—"}%</strong></div>
          <div>ATR14<strong>${s.atr ?? "—"}</strong></div>
          <div>每手风险<strong>${s.risk_per_lot ?? "—"}</strong></div>
        </div>
        <div class="bar" title="相对风险预算占用"><i style="--w:${w}%"></i></div>
      </article>`;
    })
    .join("");
  document.getElementById("signalBoard").innerHTML = html;
}

loadData()
  .then((report) => {
    renderParams(report);
    renderBoard(report);
  })
  .catch((err) => {
    document.getElementById("asofLabel").textContent = "数据加载失败";
    console.error(err);
  });
