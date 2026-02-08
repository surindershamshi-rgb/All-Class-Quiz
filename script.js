let quizData = [];
let current = 0;
let score = 0;
let selected = null;

// START QUIZ
function startQuiz() {
  let classVal = document.getElementById("classSelect").value.replace("Class ", "class");
  let subjectVal = document.getElementById("subjectSelect").value;
  let lessonVal = "lesson1";

  if (!classVal || !subjectVal) {
    alert("Please select class and subject");
    return;
  }

  let filePath = `questions/${classVal}_${subjectVal}_${lessonVal}.json`;

  fetch(filePath)
    .then(res => res.json())
    .then(data => {
      quizData = data;
      document.querySelector(".container").style.display = "none";
      document.getElementById("quizScreen").classList.remove("hidden");
      loadQuestion();
    })
    .catch(() => alert("Question file not found! Check file name."));
}

// LOAD QUESTION
function loadQuestion() {
  selected = null;
  let q = quizData[current];

  document.getElementById("question").innerHTML =
    `<b>${q.question_en}</b><br><span style="color:gray">${q.question_hi}</span>`;

  let optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options_en.forEach((opt, i) => {
    let d = document.createElement("div");
    d.className = "option";
    d.innerHTML = `${opt}<br><span style="color:gray">${q.options_hi[i]}</span>`;
    d.onclick = () => selected = i;
    optDiv.appendChild(d);
  });
}

// NEXT QUESTION
function nextQuestion() {
  if (selected === quizData[current].answer) score++;

  current++;

  if (current < quizData.length) loadQuestion();
  else finishQuiz();
}

// FINISH QUIZ
function finishQuiz() {
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");
  document.getElementById("resultText").innerText = "Score: " + score;

  saveResult();
}

// SAVE RESULT + LEADERBOARD
function saveResult() {
  let name = document.getElementById("studentName").value;
  let classVal = document.getElementById("classSelect").value;
  let subject = document.getElementById("subjectSelect").value;

  let records = JSON.parse(localStorage.getItem("records") || "[]");
  records.push({ name, classVal, subject, score });
  localStorage.setItem("records", JSON.stringify(records));

  updateLeaderboard(records);
}

// UPDATE LEADERBOARD
function updateLeaderboard(records = JSON.parse(localStorage.getItem("records") || "[]")) {
  let list = document.getElementById("leaderboardList");
  list.innerHTML = "";

  records.sort((a, b) => b.score - a.score);
  records.slice(0, 5).forEach(r => {
    let li = document.createElement("li");
    li.innerText = `${r.name} (${r.score})`;
    list.appendChild(li);
  });
}

// RESTART
function restartQuiz() {
  location.reload();
}

updateLeaderboard();
