let quizData = [];
let current = 0;
let score = 0;
let selected = null;

// 🚀 START QUIZ
function startQuiz() {
  let classVal = document.getElementById("classSelect").value.toLowerCase();
  let subjectVal = document.getElementById("subjectSelect").value.toLowerCase();
  let lessonVal = document.getElementById("lessonSelect").value.toLowerCase();

  if (!classVal || !subjectVal || !lessonVal) {
    alert("Please select class, subject and lesson");
    return;
  }

  // ✅ NEW FOLDER-BASED PATH
  let filePath = `./questions/${classVal}/${subjectVal}/${lessonVal}.json`;

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
    .catch(err => {
      console.error(err);
      alert("Question file not found! Check folder structure.");
    });
}

// 📖 LOAD QUESTION
function loadQuestion() {
  selected = null;
  let q = quizData[current];

  document.getElementById("question").innerHTML =
    `<b>${q.question_en}</b><br>
     <span style="color:gray">${q.question_hi}</span>`;

  let optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options_en.forEach((opt, i) => {
    let d = document.createElement("div");
    d.className = "option";
    d.innerHTML = `${opt}<br>
                   <span style="color:gray">${q.options_hi[i]}</span>`;
    d.onclick = () => selected = i;
    optDiv.appendChild(d);
  });
}

// ➡️ NEXT QUESTION
function nextQuestion() {
  if (selected === quizData[current].answer) score++;

  current++;

  if (current < quizData.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

// 🏁 FINISH
function finishQuiz() {
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");
  document.getElementById("resultText").innerText =
    `Score: ${score} / ${quizData.length}`;

  saveResult();
}

// 💾 SAVE RESULT
function saveResult() {
  let name = document.getElementById("studentName").value || "Student";
  let classVal = document.getElementById("classSelect").value;
  let subject = document.getElementById("subjectSelect").value;

  let records = JSON.parse(localStorage.getItem("records") || "[]");
  records.push({ name, classVal, subject, score });
  localStorage.setItem("records", JSON.stringify(records));

  updateLeaderboard(records);
}

// 🏆 LEADERBOARD
function updateLeaderboard(records = JSON.parse(localStorage.getItem("records") || "[]")) {
  let list = document.getElementById("leaderboardList");
  if (!list) return;

  list.innerHTML = "";
  records.sort((a, b) => b.score - a.score);

  records.slice(0, 5).forEach(r => {
    let li = document.createElement("li");
    li.innerText = `${r.name} (${r.score})`;
    list.appendChild(li);
  });
}

// 🔄 RESTART
function restartQuiz() {
  location.reload();
}

updateLeaderboard();
