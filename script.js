const CONFIG = {
  email: "syedrhn0@gmail.com", 
  githubUser: "syedrhn0",
  featuredRepos: ["Dark-Store-Inventory-Intelligence-System", "Customer-360-Next-Best-Action-Engine"],
};

// Featured projects are written by hand so content and order never change.
// Set a link to null if it does not exist yet. Nothing is invented.
const PROJECTS = [
  {
    title: "Dark Store Inventory Intelligence System",
    problem: "Dark stores run out of products without warning, and lost sales follow.",
    goal: "Predict whether a product will go out of stock within the next 48 hours.",
    tools: ["Python", "Pandas", "NumPy", "scikit-learn", "XGBoost", "Streamlit"],
    result: "Dataset of 80,700+ records. Reported recall 75.7%, precision 27.6%, F1 40.4%.",
    github: "https://github.com/syedrhn0/Dark-Store-Inventory-Intelligence-System",
    demo: "https://dark-store-inventory-intelligence-system.streamlit.app",
  },
  {
    title: "The AI Layoff Myth: What the Data Actually Says",
    problem: "Public debate says AI is behind recent layoffs. Does the data agree?",
    goal: "Compare layoff trends from 2020 to 2026 across three periods: Pandemic, Correction and AI Pivot.",
    tools: ["MySQL", "Data cleaning", "Deduplication", "SQL views", "Power BI"],
    result: "Processed 4,337 layoff events and presented the findings in Power BI.",
    github: "https://github.com/syedrhn0/The-AI-Layoff-Myth-What-the-Data-Actually-Says",
    demo: null,
  },
  {
    title: "Customer 360 & Next Best Action Engine",
    problem: "Customer data sits in separate tables, so teams cannot see one full picture.",
    goal: "Combine customer, purchase, interaction and complaint data, then recommend the next best action using segments and business rules.",
    tools: ["Snowflake", "SQL", "Customer segmentation", "Business rules"],
    result: null,
    github: "https://github.com/syedrhn0/Customer-360-Next-Best-Action-Engine",
    demo: null,
  },
];

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- project cards ---------- */
function projectCard(p) {
  const links = [];
  if (p.demo) links.push(`<a class="btn btn-primary btn-sm" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo</a>`);
  if (p.github) links.push(`<a class="btn btn-sm" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (!p.github) links.push(`<span class="pending">GitHub link to be added</span>`);
  if (!p.demo && p.github) links.push(`<span class="pending">No live demo</span>`);
  return `
  <article class="card reveal">
    <div>
      <h3>${esc(p.title)}</h3>
      <p class="problem">${esc(p.problem)}</p>
      <p class="goal">${esc(p.goal)}</p>
      <div class="links-row">${links.join("")}</div>
    </div>
    <dl>
      ${p.result ? `<dt>Result</dt><dd class="result">${esc(p.result)}</dd>` : ""}
      <dt>Tools</dt>
      <dd><ul class="tags">${p.tools.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></dd>
    </dl>
  </article>`;
}
$("#project-list").innerHTML = PROJECTS.map(projectCard).join("");

/* ---------- mobile menu ---------- */
const btn = $(".menu-btn"), nav = $("#links");
const setMenu = (open) => {
  nav.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
  btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
btn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- active nav link + reveal ---------- */
if ("IntersectionObserver" in window) {
  const links = [...nav.querySelectorAll("a[href^='#']")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["about", "skills", "projects", "experience", "contact"].forEach((id) => spy.observe($("#" + id)));

  const rev = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); rev.unobserve(en.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => rev.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- contact ---------- */
if (CONFIG.email) {
  $("#email-item").hidden = false;
  const a = $("#email-link");
  a.href = "mailto:" + CONFIG.email;
  a.textContent = CONFIG.email;
  const c = $("#contact-btn");
  c.href = "mailto:" + CONFIG.email;
  c.removeAttribute("target");
}
$("#yr").textContent = new Date().getFullYear();

/* ---------- GitHub repos (secondary section only) ---------- */
(async function loadRepos() {
  const list = $("#repo-list");
  const fallback = () => {
    list.innerHTML = `<li class="muted">Repositories could not be loaded right now. See everything on <a href="https://github.com/${CONFIG.githubUser}" target="_blank" rel="noopener">github.com/${CONFIG.githubUser}</a>.</li>`;
  };
  try {
    const res = await fetch(`https://api.github.com/users/${CONFIG.githubUser}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error(res.status);
    const repos = (await res.json())
      .filter((r) => !r.fork && !CONFIG.featuredRepos.includes(r.name))
      .slice(0, 6);
    if (!repos.length) {
      list.innerHTML = `<li class="muted">No other public repositories yet. <a href="https://github.com/${CONFIG.githubUser}" target="_blank" rel="noopener">Visit my GitHub profile</a>.</li>`;
      return;
    }
    list.innerHTML = repos.map((r) => `
      <li>
        <a href="${esc(r.html_url)}" target="_blank" rel="noopener">${esc(r.name)}</a>
        <p>${esc(r.description || "No description added.")}</p>
        <small>${esc(r.language || "")}</small>
      </li>`).join("");
  } catch (e) { fallback(); }
})();
