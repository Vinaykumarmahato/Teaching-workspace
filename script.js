/* ===== Settings ===== */
const PASSWORD = "teach123";            // <-- change this
const KEY = "teachingWorkspace.v1";     // localStorage key

/* ===== Small helpers ===== */
const $ = s => document.querySelector(s);
const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nl = t => esc(t).replace(/\n/g, "<br>");

/* ===== State: saved in the browser ===== */
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(DEFAULT_DATA); }
  catch (e) { return structuredClone(DEFAULT_DATA); }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

let S = load();
let cur = null;        // current subject id (null = home page)
let tab = "syllabus";
let markFilter = "all";
let addKey = null;     // which list the form is adding to

const TABS = [
  ["syllabus", "Syllabus and Schedule"], ["papers", "Question Papers"],
  ["answers", "Answer Keys"], ["questions", "Important Q&A"],
  ["programs", "Practical Programs"], ["tips", "Exam Tips"]
];

/* Form fields for each list: [name, label, type, options] */
const FIELDS = {
  schedule:  [["week","Week","text"], ["topic","Topic","text"]],
  papers:    [["title","Title","text"], ["file","PDF path (e.g. papers/test1.pdf)","text"]],
  answers:   [["title","Title","text"], ["file","PDF path (e.g. answers/test1.pdf)","text"]],
  questions: [["week","Week or unit","text"], ["marks","Marks","number"],
              ["co","CO level","sel",["CO1","CO2","CO3","CO4"]],
              ["q","Question","area"], ["a","Answer","area"]],
  programs:  [["title","Title","text"], ["aim","Aim","text"], ["code","Program code","area"],
              ["output","Expected output","area"], ["viva","Viva questions (one per line)","area"]],
  tips:      [["group","Section","sel",["Theory","Practical"]], ["text","Tip","text"]]
};

const subj = () => S.subjects.find(s => s.id === cur);

/* ===== Rendering ===== */
function render() {
  $("#app").innerHTML = cur ? subjectView() : homeView();
  if (!cur) bindSearch();
}

function homeView() {
  const cards = S.subjects.map(s => `
    <button class="card" data-open="${s.id}">
      <h3>${esc(s.name)}</h3><div>${esc(s.code)}</div>
      <small>${s.papers.length} papers, ${s.questions.length} questions, ${s.programs.length} programs</small>
    </button>`).join("");
  const recent = S.recent.length
    ? S.recent.map(r => `<div>${esc(r)}</div>`).join("")
    : `<p class="empty">Nothing added yet. Items you add will appear here.</p>`;
  return `
    <h1>Your subjects</h1>
    <input id="q" type="search" placeholder="Search papers, questions and programs">
    <div id="results"></div>
    <div class="cards">${cards}</div>
    <div class="two">
      <div class="panel"><h3>Recently added</h3>${recent}</div>
      <div class="panel"><h3>My reminders</h3>
        <textarea class="notes" id="notes">${esc(S.notes)}</textarea></div>
    </div>`;
}

function subjectView() {
  const s = subj();
  const tabs = TABS.map(([k, l]) =>
    `<button class="tab ${k === tab ? "on" : ""}" data-tab="${k}">${l}</button>`).join("");
  return `<button class="btn" data-home>Back to subjects</button>
    <h1 style="margin-top:1rem">${esc(s.name)}</h1><p>${esc(s.code)}</p>
    <div class="tabs">${tabs}</div>${tabBody(s)}`;
}

/* Add / delete buttons used by every tab */
const addBtn = (key, label) => `<p><button class="btn primary" data-add="${key}">${label}</button></p>`;
const delBtn = (key, i) => `<button class="del" data-del="${key}:${i}">Delete</button>`;

function tabBody(s) {
  if (tab === "syllabus") {
    const sched = s.schedule.map((r, i) =>
      `<tr><td>${esc(r.week)}</td><td>${esc(r.topic)}</td><td>${delBtn("schedule", i)}</td></tr>`).join("");
    const cie = s.cie.map(r =>
      `<tr><td>${esc(r.test)}</td><td>Week ${r.week}</td><td>${r.duration}</td><td>${r.marks}</td></tr>`).join("");
    return `<h2>13-week plan</h2>
      <table><tr><th>Week</th><th>Topic</th><th></th></tr>${sched}</table>${addBtn("schedule", "Add week")}
      <h2>CIE schedule</h2>
      <table><tr><th>Test</th><th>When</th><th>Duration</th><th>Marks</th></tr>${cie}</table>`;
  }

  if (tab === "papers" || tab === "answers") {
    const list = s[tab].map((p, i) => `
      <div class="item"><header><h3>${esc(p.title)}</h3>${delBtn(tab, i)}</header>
        <a class="btn" href="${esc(p.file)}" target="_blank">Open PDF</a>
        <a class="btn" href="${esc(p.file)}" download>Download</a>
        <details><summary>Preview</summary><iframe src="${esc(p.file)}"></iframe></details>
      </div>`).join("") || `<p class="empty">No files yet. Copy a PDF into the ${tab}/ folder, then add it here.</p>`;
    return addBtn(tab, tab === "papers" ? "Add question paper" : "Add answer key") + list;
  }

  if (tab === "questions") {
    const marks = [...new Set(s.questions.map(q => q.marks))].sort((a, b) => a - b);
    const filter = `<label>Filter by marks <select id="mf">
      <option value="all">All</option>${marks.map(m =>
        `<option value="${m}" ${String(m) === markFilter ? "selected" : ""}>${m} marks</option>`).join("")}
      </select></label>`;
    const list = s.questions.map((q, i) => ({ q, i }))
      .filter(({ q }) => markFilter === "all" || String(q.marks) === markFilter)
      .map(({ q, i }) => `
        <div class="item"><header><div><span class="tag">${esc(q.week)}</span>
          <span class="tag">${q.marks} marks</span><span class="tag">${esc(q.co)}</span></div>${delBtn("questions", i)}</header>
          <p><strong>${nl(q.q)}</strong></p>
          <details><summary>Show answer</summary><p>${nl(q.a)}</p></details></div>`).join("");
    return addBtn("questions", "Add question") + filter + (list || `<p class="empty">No questions match.</p>`);
  }

  if (tab === "programs") {
    const list = s.programs.map((p, i) => `
      <div class="item"><header><h3>${esc(p.title)}</h3>${delBtn("programs", i)}</header>
        <p><strong>Aim:</strong> ${esc(p.aim)}</p>
        <pre>${esc(p.code)}</pre><button class="btn" data-copy="${i}">Copy code</button>
        <p><strong>Expected output</strong></p><pre>${esc(p.output)}</pre>
        <details><summary>Viva questions</summary><p>${nl(p.viva)}</p></details></div>`).join("");
    return addBtn("programs", "Add program") + (list || `<p class="empty">No programs yet.</p>`);
  }

  /* tips: two columns, one per section */
  const col = g => `<div class="panel"><h3>${g} tips</h3>` + (s.tips.map((t, i) => ({ t, i }))
    .filter(({ t }) => t.group === g)
    .map(({ t, i }) => `<div class="row"><span>${esc(t.text)}</span>${delBtn("tips", i)}</div>`).join("")
    || `<p class="empty">No tips yet.</p>`) + `</div>`;
  return addBtn("tips", "Add tip") + `<div class="two">${col("Theory")}${col("Practical")}</div>`;
}

/* ===== Search (home page) ===== */
function bindSearch() {
  $("#q").addEventListener("input", e => {
    const t = e.target.value.trim().toLowerCase();
    let out = "";
    if (t) S.subjects.forEach(s => {
      s.papers.forEach(p => { if (p.title.toLowerCase().includes(t)) out += hit(s, "papers", "Paper: " + p.title); });
      s.questions.forEach(q => { if ((q.q + q.a).toLowerCase().includes(t)) out += hit(s, "questions", "Question: " + q.q.slice(0, 80)); });
      s.programs.forEach(p => { if ((p.title + p.aim).toLowerCase().includes(t)) out += hit(s, "programs", "Program: " + p.title); });
    });
    $("#results").innerHTML = t ? `<div class="panel">${out || "<p class='empty'>No matches.</p>"}</div>` : "";
  });
  $("#notes").addEventListener("input", e => { S.notes = e.target.value; save(); });
}
const hit = (s, tb, label) => `<button class="result" data-goto="${s.id}:${tb}">${esc(label)} (${esc(s.code)})</button>`;

/* ===== Add form ===== */
function openForm(key) {
  addKey = key;
  $("#fTitle").textContent = "Add to " + key;
  $("#fBody").innerHTML = FIELDS[key].map(([n, l, t, o]) => `<label>${l}` + (
    t === "area" ? `<textarea name="${n}" rows="4" required></textarea>` :
    t === "sel" ? `<select name="${n}">${o.map(x => `<option>${x}</option>`).join("")}</select>` :
    `<input name="${n}" type="${t}" required>`) + `</label>`).join("");
  $("#dlg").showModal();
}

$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const item = Object.fromEntries(new FormData(e.target));
  if (item.marks) item.marks = Number(item.marks);
  subj()[addKey].push(item);
  S.recent.unshift(`${subj().code}: ${item.title || item.q || item.topic || item.text}`);
  S.recent = S.recent.slice(0, 6);
  save(); $("#dlg").close(); render();
});
$("#cancel").addEventListener("click", () => $("#dlg").close());

/* ===== One click handler for all buttons ===== */
document.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  const d = b.dataset;
  if (d.open)  { cur = d.open; tab = "syllabus"; render(); }
  if ("home" in d) { cur = null; render(); }
  if (d.tab)   { tab = d.tab; render(); }
  if (d.add)   openForm(d.add);
  if (d.goto)  { [cur, tab] = d.goto.split(":"); render(); }
  if (d.del && confirm("Delete this item?")) {
    const [k, i] = d.del.split(":"); subj()[k].splice(Number(i), 1); save(); render();
  }
  if (d.copy !== undefined) {
    navigator.clipboard.writeText(subj().programs[d.copy].code);
    b.textContent = "Copied";
  }
});
document.addEventListener("change", e => {
  if (e.target.id === "mf") { markFilter = e.target.value; render(); }
});

/* ===== Theme, export, import ===== */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $("#theme").textContent = t === "dark" ? "Light mode" : "Dark mode";
  try { localStorage.setItem("tw.theme", t); } catch (e) {}
}
$("#theme").addEventListener("click", () =>
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

$("#export").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
  a.download = "teaching-workspace-backup.json"; a.click();
});
$("#import").addEventListener("change", e => {
  const r = new FileReader();
  r.onload = () => {
    try { S = JSON.parse(r.result); save(); cur = null; render(); alert("Backup imported."); }
    catch (err) { alert("That file is not a valid backup."); }
  };
  r.readAsText(e.target.files[0]);
});

/* ===== Password gate and start ===== */
function start() {
  $("#lock").hidden = true; $("#shell").hidden = false;
  sessionStorage.setItem("tw.ok", "1"); render();
}
$("#lockForm").addEventListener("submit", e => {
  e.preventDefault();
  if ($("#pw").value === PASSWORD) start(); else $("#lockErr").hidden = false;
});
try { setTheme(localStorage.getItem("tw.theme") || "light"); } catch (e) { setTheme("light"); }
if (sessionStorage.getItem("tw.ok")) start();
