/* ---------- PASSWORD GATE ----------
 * Change the password: open the browser console and run
 *   crypto.subtle.digest("SHA-256", new TextEncoder().encode("YOUR_PASSWORD"))
 *     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,"0")).join("")))
 * then paste the result below.
 * Default password: changeme123
 */
const PASSWORD_HASH = "494a715f7e9b4071aca61bac42ca858a309524e5864f0920030862a4ae7589be";
const SYLLABUSES = [
  { title: "Computer Science Syllabus", file: "Syllubas/cs syllubus.pdf" },
  { title: "Mechanical Engineering Syllabus", file: "Syllubas/mechanical sullubus.pdf" }
];

const $ = (id) => document.getElementById(id);
const lockScreen = $("lock-screen");
const app = $("app");

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function unlock() {
  lockScreen.hidden = true;
  app.hidden = false;
  route();
}

function lock() {
  sessionStorage.removeItem("unlocked");
  app.hidden = true;
  lockScreen.hidden = false;
  $("password").value = "";
  $("password").focus();
}

$("lock-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const entered = await sha256($("password").value);
  if (entered === PASSWORD_HASH) {
    sessionStorage.setItem("unlocked", "1");
    $("lock-error").hidden = true;
    unlock();
  } else {
    $("lock-error").hidden = false;
    const box = document.querySelector(".lock-box");
    box.classList.remove("shake");
    void box.offsetWidth; // restart animation
    box.classList.add("shake");
    $("password").select();
  }
});

$("logout").addEventListener("click", lock);

/* ---------- SCREENS ---------- */
function showSubjects() {
  $("papers-screen").hidden = true;
  $("subjects-screen").hidden = false;
}

function renderSubjects() {
  const list = $("subject-list");
  list.innerHTML = "";
  SUBJECTS.forEach((s) => {
    const resourceCount = (title) => (s.resources || []).filter((resource) => resource.title === title).length;
    const counts = [
      `${s.tests.length} ${s.tests.length === 1 ? "test" : "tests"}`,
      `${(s.rubrics || []).length} ${(s.rubrics || []).length === 1 ? "activity rubric" : "activity rubrics"}`,
      `${resourceCount("Lab Record")} ${resourceCount("Lab Record") === 1 ? "lab record" : "lab records"}`,
      `${resourceCount("Viva Questions")} ${resourceCount("Viva Questions") === 1 ? "viva question set" : "viva question sets"}`
    ];
    const btn = document.createElement("button");
    btn.className = "subject-card";
    btn.innerHTML = `<span class="name"></span><span class="meta"></span>`;
    btn.querySelector(".name").textContent = s.name;
    btn.querySelector(".meta").textContent = `${s.code} · ${counts.join(" · ")}`;
    btn.addEventListener("click", () => { location.hash = s.id; });
    list.appendChild(btn);
  });
}

function renderSyllabuses() {
  const list = $("syllabus-list");
  list.innerHTML = "";
  SYLLABUSES.forEach((syllabus) => {
    list.appendChild(
      paperCard(syllabus.title, resourceButtons("syllabus", syllabus.file))
    );
  });
}

function fileButton(label, path, download = false) {
  const a = document.createElement("a");
  a.className = "btn";
  a.textContent = label;
  if (path) {
    a.href = encodeURI(path);
    if (download) {
      a.download = path.split("/").pop();
    } else {
      a.target = "_blank";
      a.rel = "noopener";
      a.classList.add("primary");
    }
  } else {
    a.classList.add("disabled");
    a.setAttribute("aria-disabled", "true");
    a.title = "Not available yet";
    a.textContent = label + " (not available)";
  }
  return a;
}

function resourceButtons(label, path) {
  return [
    fileButton(`View ${label}`, path),
    fileButton(`Download ${label}`, path, true)
  ];
}

function paperCard(title, buttons) {
  const card = document.createElement("div");
  card.className = "paper-card";
  const h = document.createElement("h4");
  h.textContent = title;
  const actions = document.createElement("div");
  actions.className = "actions";
  buttons.forEach((b) => actions.appendChild(b));
  card.append(h, actions);
  return card;
}

function showSubject(id) {
  const s = SUBJECTS.find((x) => x.id === id);
  if (!s) return showSubjects();

  $("subject-title").textContent = s.name;
  $("subject-code").textContent = s.code;

  const papers = $("paper-list");
  papers.innerHTML = "";
  s.tests.forEach((t) => {
    papers.appendChild(
      paperCard(t.title, [
        ...resourceButtons("question", t.question),
        ...resourceButtons("answer", t.answer),
        ...(t.programOnly ? resourceButtons("program only", t.programOnly) : [])
      ])
    );
  });

  const rubrics = $("rubric-list");
  rubrics.innerHTML = "";
  (s.rubrics || []).forEach((r) => {
    rubrics.appendChild(paperCard(r.title, resourceButtons("rubric", r.file)));
  });
  $("rubric-wrap").hidden = !(s.rubrics && s.rubrics.length);

  const resources = $("resource-list");
  resources.innerHTML = "";
  (s.resources || []).forEach((resource) => {
    resources.appendChild(
      paperCard(resource.title, resourceButtons(resource.title.toLowerCase(), resource.file))
    );
  });
  $("resource-wrap").hidden = !(s.resources && s.resources.length);

  $("subjects-screen").hidden = true;
  $("papers-screen").hidden = false;
  window.scrollTo(0, 0);
}

$("back").addEventListener("click", () => { location.hash = ""; });

/* ---------- ROUTING (hash based, so browser Back works) ---------- */
function route() {
  if (app.hidden) return;
  const id = location.hash.slice(1);
  id ? showSubject(id) : showSubjects();
}
window.addEventListener("hashchange", route);

/* ---------- START ---------- */
renderSubjects();
renderSyllabuses();
if (sessionStorage.getItem("unlocked") === "1") unlock();

(() => {
  const button = document.querySelector(".bio-res-why-toggle");
  const panel = $("bio-res-why-answer");
  if (!button || !panel) return;

  const icon = button.querySelector(".bio-res-why-icon");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let closeTimer;
  let closeHandler;

  button.addEventListener("click", () => {
    const isOpening = button.getAttribute("aria-expanded") !== "true";

    window.clearTimeout(closeTimer);
    if (closeHandler) {
      panel.removeEventListener("transitionend", closeHandler);
      closeHandler = null;
    }

    button.setAttribute("aria-expanded", String(isOpening));
    panel.setAttribute("aria-hidden", String(!isOpening));
    if (icon) icon.textContent = isOpening ? "−" : "+";

    if (isOpening) {
      panel.hidden = false;
      if (reducedMotion.matches) {
        panel.classList.add("bio-res-why-is-open");
      } else {
        requestAnimationFrame(() => {
          if (button.getAttribute("aria-expanded") === "true") {
            panel.classList.add("bio-res-why-is-open");
          }
        });
      }
      return;
    }

    panel.classList.remove("bio-res-why-is-open");
    if (reducedMotion.matches) {
      panel.hidden = true;
      return;
    }

    const finishClosing = (event) => {
      if (event && (event.target !== panel || event.propertyName !== "grid-template-rows")) return;
      if (button.getAttribute("aria-expanded") === "false") panel.hidden = true;
      panel.removeEventListener("transitionend", finishClosing);
      closeHandler = null;
      window.clearTimeout(closeTimer);
    };

    closeHandler = finishClosing;
    panel.addEventListener("transitionend", finishClosing);
    closeTimer = window.setTimeout(() => finishClosing(), 300);
  });
})();