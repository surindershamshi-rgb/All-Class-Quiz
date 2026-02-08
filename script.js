let quizData = [
  { question: "Capital of India?", options: ["Mumbai","Delhi","Chennai","Kolkata"], answer: 1 },
  { question: "Who wrote A Letter to God?", options: ["Tagore","Fuentes","Shakespeare","Bond"], answer: 1 }
];

let current = 0, score = 0, selected = null;

function startQuiz(){
  document.querySelector(".container").style.display = "none";
  document.getElementById("quizScreen").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion(){
  selected = null;
  let q = quizData[current];
  document.getElementById("question").innerText = q.question;
  let optDiv = document.getElementById("options");
  optDiv.innerHTML = "";
  q.options.forEach((opt,i)=>{
    let d = document.createElement("div");
    d.innerText = opt;
    d.className="option";
    d.onclick=()=>selected=i;
    optDiv.appendChild(d);
  });
}

function nextQuestion(){
  if(selected===quizData[current].answer) score++;
  current++;
  if(current<quizData.length) loadQuestion();
  else finishQuiz();
}

function finishQuiz(){
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");
  document.getElementById("resultText").innerText="Score: "+score;

  saveResult();
}

function saveResult(){
  let name=document.getElementById("studentName").value;
  let classVal=document.getElementById("classSelect").value;
  let subject=document.getElementById("subjectSelect").value;

  let records=JSON.parse(localStorage.getItem("records")||"[]");
  records.push({name,classVal,subject,score});
  localStorage.setItem("records",JSON.stringify(records));
  updateLeaderboard();
  exportCSV(records);
}

function updateLeaderboard(){
  let list=document.getElementById("leaderboardList");
  list.innerHTML="";
  let records=JSON.parse(localStorage.getItem("records")||"[]");
  records.sort((a,b)=>b.score-a.score);
  records.slice(0,5).forEach(r=>{
    let li=document.createElement("li");
    li.innerText=`${r.name} (${r.score})`;
    list.appendChild(li);
  });
}

function exportCSV(data){
  let csv="Name,Class,Subject,Score\n";
  data.forEach(r=>{ csv+=`${r.name},${r.classVal},${r.subject},${r.score}\n`; });
  let blob=new Blob([csv],{type:"text/csv"});
  let a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="Student_Records.csv";
  a.click();
}

function restartQuiz(){ location.reload(); }

updateLeaderboard();
function startQuiz(){
  let classVal = document.getElementById("classSelect").value.replace("Class ","class");
  let subjectVal = document.getElementById("subjectSelect").value;
  let lessonVal = "lesson1"; // You can add lesson dropdown later

  let filePath = `questions/${classVal}_${subjectVal}_${lessonVal}.json`;

  fetch(filePath)
    .then(res => res.json())
    .then(data => {
      quizData = data;
      document.querySelector(".container").style.display="none";
      document.getElementById("quizScreen").classList.remove("hidden");
      loadQuestion();
    })
    .catch(()=>alert("Question file not found!"));
}
