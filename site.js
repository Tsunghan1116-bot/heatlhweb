const iconPaths = {
  activity: '<path d="M4 13h4l3-8 4 14 3-6h2"></path>',
  heart: '<path d="M19 14c2-2 3-4 3-6a4 4 0 0 0-7-2 4 4 0 0 0-7 2c0 2 1 4 3 6l4 4 4-4Z"></path>',
  stretch: '<path d="M7 20c3-5 5-8 10-9"></path><path d="M14 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"></path><path d="M10 10l5 2 4 4"></path>',
  strength: '<path d="M3 10v4"></path><path d="M7 8v8"></path><path d="M17 8v8"></path><path d="M21 10v4"></path><path d="M7 12h10"></path>',
  food: '<path d="M6 3v8"></path><path d="M10 3v8"></path><path d="M8 3v18"></path><path d="M16 3c2 2 3 5 3 8s-1 5-3 7V3Z"></path>',
  target: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle>',
  check: '<path d="M20 6 9 17l-5-5"></path>',
  question: '<path d="M9 9a3 3 0 1 1 4 3c-1 .5-1 1-1 2"></path><path d="M12 18h.01"></path>',
  home: '<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path>'
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.activity}</svg>`;
}

document.querySelectorAll("[data-icon]").forEach((node) => {
  node.innerHTML = icon(node.dataset.icon);
});

const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-link").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

const progressItems = [...document.querySelectorAll("[data-progress-item]")];
const progressFill = document.querySelector("#progressFill");
const progressText = document.querySelector("#progressText");
const progressKey = "fitness-course-progress";

function loadProgress() {
  if (!progressItems.length) return;
  const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
  progressItems.forEach((item) => {
    item.checked = Boolean(saved[item.dataset.progressItem]);
    item.addEventListener("change", saveProgress);
  });
  updateProgress();
}

function saveProgress() {
  const data = {};
  progressItems.forEach((item) => {
    data[item.dataset.progressItem] = item.checked;
  });
  localStorage.setItem(progressKey, JSON.stringify(data));
  updateProgress();
}

function updateProgress() {
  const done = progressItems.filter((item) => item.checked).length;
  const percent = Math.round((done / progressItems.length) * 100);
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `完成度：${percent}%`;
}

function bmiLabel(bmi) {
  if (bmi < 18.5) return "偏低，建議留意營養與肌肉量。";
  if (bmi < 24) return "落在一般健康範圍。";
  if (bmi < 27) return "略高，可搭配身體組成與生活習慣一起評估。";
  return "偏高，建議搭配飲食、活動量與專業建議調整。";
}

document.querySelectorAll("[data-tool]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const result = form.querySelector("[data-result]");
    if (!result) return;

    if (form.dataset.tool === "heart") {
      const age = Number(data.get("age"));
      const mhr = 220 - age;
      result.textContent = `估算 MHR ${mhr} bpm；60-90% 約 ${Math.round(mhr * 0.6)}-${Math.round(mhr * 0.9)} bpm。`;
    }

    if (form.dataset.tool === "bmi") {
      const height = Number(data.get("height")) / 100;
      const weight = Number(data.get("weight"));
      const bmi = weight / (height * height);
      result.textContent = `BMI 約 ${bmi.toFixed(1)}。${bmiLabel(bmi)}`;
    }

    if (form.dataset.tool === "mets") {
      const weight = Number(data.get("weight"));
      const mets = Number(data.get("mets"));
      const hours = Number(data.get("minutes")) / 60;
      const kcal = mets * weight * hours;
      result.textContent = `預估消耗約 ${Math.round(kcal)} kcal。`;
    }

    if (form.dataset.tool === "flex") {
      const level = data.get("level");
      const messages = {
        touch: "目前活動範圍不錯，下一步是練習控制與穩定。",
        close: "已接近目標，可用規律動態暖身與溫和靜態伸展改善。",
        far: "先不要急著硬拉，建議從髖關節活動、腿後側放鬆與核心控制開始。"
      };
      result.textContent = messages[level] || "請選擇目前狀態。";
    }
  });
});

loadProgress();
