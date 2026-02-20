// =====================================
// SMART QUIZ ENGINE – AUTO LINKED
// GSSS KHALYANI
// =====================================

// ---------- DATA MAP (MASTER CONTROL) ----------
const quizStructure = {
  class6: {
    english: ["lesson1", "lesson2"],
    social: ["lesson1"]
  },
  class7: {
    english: ["lesson1"],
    social: ["lesson1"]
  },
  class9: {
    english: ["lesson1", "lesson2"],
    social: ["lesson1"]
  },
  class10: {
    english: ["lesson1"],
    social: ["lesson1"]
  }
};

// ---------- GLOBAL ----------
let quizData = [];
let current = 0;
let score = 0;
let selected = null;

// =====================================
// AUTO POPULATE SUBJECTS
// =====================================
function populateSubjects() {
  const classVal = document.getElementById("classSelect").value;
  const subjectSelect = document.getElementById("subjectSelect");
  const lessonSelect = document.getElementById("lessonSelect");

  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  lessonSelect.innerHTML = '<option value="">Select Lesson</option>';

  if (!quizStructure[classVal]) return;

  Object.keys(quizStructure[classVal]).forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent =
      sub === "english" ? "English" : "Social Science";
    subjectSelect.appendChild(opt);
  });
}

// =====================================
// AUTO POPULATE LESSONS
// =====================================
function populateLessons() {
  const classVal = document.getElementById("classSelect").value;
  const subjectVal = document.getElementById("subjectSelect").value;
  const lessonSelect = document.getElementById("lessonSelect");

  lessonSelect.innerHTML = '<option value="">Select Lesson</option>';

  if (!quizStructure[classVal]?.[subjectVal]) return;

  quizStructure[classVal][subjectVal].forEach(lesson => {
    const opt = document.createElement("option");
    opt.value = lesson;
    opt.textContent = lesson.replace("lesson", "Lesson ");
    lessonSelect.appendChild(opt);
  });
}

// =====================================
// START QUIZ
// =====================================
function startQuiz() {
  const classVal = document.getElementById("classSelect").value;
  const subjectVal = document.getElementById("subjectSelect").value;
  const lessonVal = document.getElementById("lessonSelect").value;

  if (!classVal || !subjectVal || !lessonVal) {
    alert("Please select class, subject and lesson");
    return;
  }

  const filePath = `./questions/${classVal}/${subjectVal}/${lessonVal}.json`;
  console.log("Loading:", filePath);

  fetch(filePath)
    .then(res => {
      if (!res.ok) throw new Error("File not found");
      return res.json();
    })
    .then(data => {
      quizData = data;
      current = 0;
      score = 0;

      document.querySelector(".container").style.display = "none";
      document.getElementById("quizScreen").classList.remove("hidden");

      loadQuestion();
    })
    .catch(() => {
      alert("❌ Question file not found!\nCheck folder structure.");
    });
}

// =====================================
// LOAD QUESTION
// =====================================
function loadQuestion() {
  selected = null;
  const q = quizData[current];

  document.getElementById("question").innerHTML = `
    <b>${q.question_en}</b><br>
    <span style="color:gray">${q.question_hi}</span>
  `;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options_en.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `
      ${opt}<br>
      <span style="color:gray">${q.options_hi[i]}</span>
    `;
    div.onclick = () => selectOption(i, div);
    optDiv.appendChild(div);
  });
}

// =====================================
// SELECT OPTION
// =====================================
function selectOption(index, element) {
  selected = index;

  document.querySelectorAll(".option").forEach(o => {
    o.style.background = "#e0f2fe";
  });

  element.style.background = "#93c5fd";
}

// =====================================
// NEXT QUESTION
// =====================================
function nextQuestion() {
  if (selected === null) {
    alert("Select an option first");
    return;
  }

  if (selected === quizData[current].answer) score++;

  current++;

  if (current < quizData.length) loadQuestion();
  else finishQuiz();
}

// =====================================
// FINISH QUIZ + LEADERBOARD
// =====================================
function finishQuiz() {
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");

  document.getElementById("resultText").innerText =
    `Score: ${score} / ${quizData.length}`;

  saveResult();
}

function saveResult() {
  const name =
    document.getElementById("studentName").value || "Student";

  let records = JSON.parse(localStorage.getItem("records") || "[]");

  records.push({ name, score });

  localStorage.setItem("records", JSON.stringify(records));
  updateLeaderboard(records);
}

function updateLeaderboard(
  records = JSON.parse(localStorage.getItem("records") || "[]")
) {
  const list = document.getElementById("leaderboardList");
  if (!list) return;

  list.innerHTML = "";

  records.sort((a, b) => b.score - a.score);

  records.slice(0, 5).forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.name} (${r.score})`;
    list.appendChild(li);
  });
}

function restartQuiz() {
  location.reload();
}

// =====================================
// EVENT LISTENERS (AUTO SYSTEM)
// =====================================
document
  .getElementById("classSelect")
  .addEventListener("change", populateSubjects);

document
  .getElementById("subjectSelect")
  .addEventListener("change", populateLessons);

updateLeaderboard();
