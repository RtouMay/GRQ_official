/* ============================
      متغیرهای اصلی آزمون
============================ */

let questions = [];
let current = 0;
let score = 0;
let timer;
let timeLeft = 20;

/* ============================
       شروع آزمون — COUNTDOWN
============================ */

function startCountdown() {
    const countdownEl = document.getElementById("countdown");
    const numberEl = document.getElementById("count-number");

    let c = 3;

    let interval = setInterval(() => {
        numberEl.innerText = c;
        numberEl.style.transform = "scale(1.4)";
        setTimeout(() => numberEl.style.transform = "scale(1)", 200);

        if (c === 0) {
            clearInterval(interval);
            countdownEl.style.display = "none";
            document.getElementById("quiz-box").style.display = "block";
            showQuestion();
        }

        c--;
    }, 1000);
}

startCountdown();

/* ============================
      خواندن سوالات از فایل TXT
============================ */

async function loadQuestions() {
    let txt = await fetch("questions.txt").then(r => r.text());
    parseTXT(txt);
}

function parseTXT(data) {
    let blocks = data.split("[Q]").slice(1);

    blocks.forEach(block => {
        let q = block.split("[/Q]")[0].trim();
        let lines = q.split("\n").map(x => x.trim());

        let question = lines[0];
        let A = lines[1].replace("A) ", "");
        let B = lines[2].replace("B) ", "");
        let C = lines[3].replace("C) ", "");
        let D = lines[4].replace("D) ", "");
        let answer = lines[5].replace("ANSWER:", "").trim();

        questions.push({
            question,
            options: [A, B, C, D],
            answer
        });
    });
}

/* ============================
      نمایش سوال و گزینه‌ها
============================ */

function showQuestion() {
    if (current >= questions.length) {
        finishQuiz();
        return;
    }

    let q = questions[current];

    document.getElementById("question").innerText = q.question;
    document.getElementById("progress-text").innerText =
        (current + 1) + " / " + questions.length;

    let optHTML = "";
    ["A", "B", "C", "D"].forEach((letter, i) => {
        optHTML += `
            <div class="option fade-in" onclick="select('${letter}')">
                ${letter}) ${q.options[i]}
            </div>`;
    });

    document.getElementById("options").innerHTML = optHTML;

    resetTimer();
}

/* ============================
       تایمر 20 ثانیه‌ای
============================ */

function resetTimer() {
    clearInterval(timer);
    timeLeft = 20;

    document.getElementById("timer-value").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer-value").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            current++;
            showQuestion();
        }
    }, 1000);
}

/* ============================
       انتخاب گزینه
============================ */

function select(letter) {
    clearInterval(timer);

    if (letter === questions[current].answer) {
        score++;
    } else {
        score--;
    }

    document.querySelectorAll(".option").forEach(opt => opt.style.pointerEvents = "none");

    setTimeout(() => {
        current++;
        showQuestion();
    }, 300);
}

/* ============================
       پایان آزمون
============================ */

function finishQuiz() {
    localStorage.setItem("score", score);
    window.location.href = "finish.html";
}

/* ============================
      شروع لود سوالات
============================ */

loadQuestions();
