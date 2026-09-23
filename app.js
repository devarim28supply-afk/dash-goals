const TARGET = 1500;
const STORAGE_KEY = "dash-goals-lv-2026-v1";
const SCHEDULE = [
  { date: "2026-09-23", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-09-24", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-09-25", kind: "friday", goal: 75, pair: "2026-09-26", sunset: "6:34 p.m.", windows: "4:00 a.m.–noon. Stop before sunset (~6:34 p.m.).", note: "Friday morning of pair 1. Combined Fri+Sat goal is $120." },
  { date: "2026-09-26", kind: "saturday", goal: 45, pair: "2026-09-25", sunset: "6:32 p.m.", windows: "7:00–10:00 p.m. only, after sunset (~6:32 p.m.).", note: "Saturday evening of pair 1. Combined Fri+Sat goal is $120." },
  { date: "2026-09-27", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-09-28", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-09-29", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-09-30", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-10-01", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-10-02", kind: "friday", goal: 75, pair: "2026-10-03", sunset: "6:24 p.m.", windows: "4:00 a.m.–noon. Stop before sunset (~6:24 p.m.).", note: "Friday morning of pair 2. Combined Fri+Sat goal is $120." },
  { date: "2026-10-03", kind: "saturday", goal: 45, pair: "2026-10-02", sunset: "6:22 p.m.", windows: "7:00–10:00 p.m. only, after sunset (~6:22 p.m.).", note: "Saturday evening of pair 2. Combined Fri+Sat goal is $120." },
  { date: "2026-10-04", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-10-05", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-10-06", kind: "full", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m.", note: "Both preferred windows." },
  { date: "2026-10-07", kind: "buffer", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m. if needed.", note: "Buffer day. Use only if short of $1,500." },
  { date: "2026-10-08", kind: "buffer", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m. if needed.", note: "Buffer day. Use only if short of $1,500." },
  { date: "2026-10-09", kind: "friday", goal: 75, pair: "2026-10-10", sunset: "6:14 p.m.", windows: "4:00 a.m.–noon. Stop before sunset (~6:14 p.m.).", note: "Friday morning of pair 3. Combined Fri+Sat goal is $120." },
  { date: "2026-10-10", kind: "saturday", goal: 45, pair: "2026-10-09", sunset: "6:12 p.m.", windows: "7:00–10:00 p.m. only, after sunset (~6:12 p.m.).", note: "Saturday evening of pair 3. Combined Fri+Sat goal is $120." },
  { date: "2026-10-11", kind: "buffer", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m. if needed.", note: "Buffer day. Use only if still short." },
  { date: "2026-10-12", kind: "buffer", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m. if needed.", note: "Buffer day. Use only if still short." },
  { date: "2026-10-13", kind: "buffer", goal: 120, windows: "4:00 a.m.–noon and 7:00–10:00 p.m. if needed.", note: "Buffer day. Use only if still short." }
];
const BY_DATE = Object.fromEntries(SCHEDULE.map((d) => [d.date, d]));
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: {} };
    const parsed = JSON.parse(raw);
    return { entries: parsed.entries || {} };
  } catch {
    return { entries: {} };
  }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
let state = loadState();
let viewDate = isoDate(new Date());
function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function money(n) {
  return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
function moneyExact(n) {
  const v = Number(n || 0);
  return v % 1 === 0 ? money(v) : `$${v.toFixed(2)}`;
}
function dayTotal(iso) {
  return (state.entries[iso] || []).reduce((sum, e) => sum + Number(e.amount), 0);
}
function campaignTotal() {
  return Object.keys(state.entries).reduce((sum, iso) => sum + dayTotal(iso), 0);
}
function kindLabel(kind) {
  if (kind === "full") return "Full day";
  if (kind === "friday") return "Friday morning";
  if (kind === "saturday") return "Saturday evening";
  if (kind === "buffer") return "Buffer";
  return "Off plan";
}
function badgeClass(day, logged) {
  if (!day) return "rest";
  if (logged >= day.goal && day.goal > 0) return "done";
  if (day.kind === "full") return "full";
  if (day.kind === "friday" || day.kind === "saturday") return "pair";
  if (day.kind === "buffer") return "buffer";
  return "rest";
}
function pairStatus(day) {
  if (!day || !day.pair) return null;
  return { logged: dayTotal(day.date) + dayTotal(day.pair), goal: 120 };
}
function formatLong(iso) {
  return parseISO(iso).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}
function render() {
  const total = campaignTotal();
  const remaining = Math.max(0, TARGET - total);
  document.getElementById("loggedTotal").textContent = moneyExact(total);
  document.getElementById("overallFill").style.width = `${Math.min(100, (total / TARGET) * 100)}%`;
  document.getElementById("overallMeta").textContent =
    total >= TARGET ? "Target reached. Remaining days are optional." : `${money(remaining)} remaining · ${Math.round((total / TARGET) * 100)}%`;
  const day = BY_DATE[viewDate];
  const logged = dayTotal(viewDate);
  const todayReal = isoDate(new Date()) === viewDate;
  document.getElementById("todayDateLabel").textContent = todayReal ? formatLong(viewDate) + " · Today" : formatLong(viewDate);
  document.getElementById("todayTitle").textContent = day ? kindLabel(day.kind) : "Outside campaign";
  document.getElementById("todayWindows").textContent = day ? day.windows : "No scheduled unit on this date.";
  document.getElementById("todayGoal").textContent = money(day ? day.goal : 0);
  document.getElementById("todayLogged").textContent = moneyExact(logged);
  const goal = day ? day.goal : 0;
  document.getElementById("todayFill").style.width = goal ? `${Math.min(100, (logged / goal) * 100)}%` : "0%";
  const badge = document.getElementById("todayBadge");
  badge.className = "badge " + badgeClass(day, logged);
  if (!day) badge.textContent = "Unscheduled";
  else if (logged >= goal) badge.textContent = "Goal met";
  else if (logged > 0) badge.textContent = "In progress";
  else badge.textContent = kindLabel(day.kind);
  let meta = day ? day.note : "You can still log earnings if you dash.";
  const pair = day ? pairStatus(day) : null;
  if (pair) {
    const pairLeft = Math.max(0, pair.goal - pair.logged);
    meta += ` Pair logged ${moneyExact(pair.logged)} of $120` + (pairLeft ? ` · ${money(pairLeft)} left in pair.` : " · pair complete.");
  } else if (day && goal) {
    const left = Math.max(0, goal - logged);
    meta += left ? ` ${money(left)} left today.` : " Daily goal complete.";
  }
  if (total >= TARGET) meta = "Campaign target reached. Further dashing is optional.";
  document.getElementById("todayMeta").textContent = meta;
  renderCalendar();
  renderEntries(viewDate);
}
function renderCalendar() {
  const root = document.getElementById("calendar");
  root.innerHTML = "";
  const today = isoDate(new Date());
  SCHEDULE.forEach((day) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "day";
    const logged = dayTotal(day.date);
    if (day.date === today) el.classList.add("today");
    if (day.kind === "friday" || day.kind === "saturday") el.classList.add("sabbath");
    if (day.kind === "buffer") el.classList.add("buffer");
    if (logged >= day.goal) el.classList.add("complete");
    const dt = parseISO(day.date);
    el.innerHTML = `<span class="dow">${dt.toLocaleDateString(undefined, { weekday: "short" })}</span><span class="num">${dt.getDate()}</span><span class="amt">${logged ? moneyExact(logged) : money(day.goal)}</span>`;
    el.addEventListener("click", () => openDay(day.date));
    root.appendChild(el);
  });
}
function renderEntries(iso) {
  const list = document.getElementById("entries");
  const items = state.entries[iso] || [];
  if (!items.length) {
    list.innerHTML = `<li class="empty">No entries yet.</li>`;
    return;
  }
  list.innerHTML = items.slice().reverse().map((e) => `<li><span>${moneyExact(e.amount)}</span><span class="time">${e.time}</span></li>`).join("");
}
function addAmount(amount) {
  const value = Number(amount);
  if (!value || value <= 0) return;
  const now = new Date();
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (!state.entries[viewDate]) state.entries[viewDate] = [];
  state.entries[viewDate].push({ amount: value, time, ts: now.toISOString() });
  saveState(state);
  render();
}
function undoLast() {
  const items = state.entries[viewDate];
  if (!items || !items.length) return;
  items.pop();
  if (!items.length) delete state.entries[viewDate];
  saveState(state);
  render();
}
function clearToday() {
  if (!state.entries[viewDate]) return;
  if (!confirm("Clear all entries for this date?")) return;
  delete state.entries[viewDate];
  saveState(state);
  render();
}
function openDay(iso) {
  const day = BY_DATE[iso];
  const logged = dayTotal(iso);
  const dlg = document.getElementById("dayDialog");
  document.getElementById("dlgTitle").textContent = formatLong(iso);
  let body = day ? `${kindLabel(day.kind)}\nGoal ${money(day.goal)} · Logged ${moneyExact(logged)}\n\n${day.windows}\n${day.note}` : "No scheduled unit.";
  if (day && day.sunset) body += `\nSunset about ${day.sunset}. Confirm locally.`;
  document.getElementById("dlgBody").textContent = body;
  document.getElementById("dlgJump").onclick = () => {
    viewDate = iso;
    render();
  };
  dlg.showModal();
}
document.getElementById("logForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("amountInput");
  addAmount(input.value);
  input.value = "";
});
document.querySelectorAll("[data-add]").forEach((btn) => {
  btn.addEventListener("click", () => addAmount(btn.dataset.add));
});
document.getElementById("undoBtn").addEventListener("click", undoLast);
document.getElementById("clearTodayBtn").addEventListener("click", clearToday);
document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Erase all logged earnings on this device?")) return;
  state = { entries: {} };
  saveState(state);
  viewDate = isoDate(new Date());
  render();
});
if (!BY_DATE[viewDate]) {
  const first = SCHEDULE[0].date;
  const last = SCHEDULE[SCHEDULE.length - 1].date;
  if (viewDate < first) viewDate = first;
  else if (viewDate > last) viewDate = last;
}
render();
