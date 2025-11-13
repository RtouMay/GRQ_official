let questions = [];
let current = 0;
let score = 0;

async function loadQuestions() {
    let txt = await fetch("questions.txt").then(r => r.text());
    parseTXT(txt);
    showQuestion();
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

function showQuestion() {
    if (current >= questions.length) {
        localStorage.setItem("score", score);
        window.location = "finish.html";
        return;
    }

    let q = questions[current];

    document.getElementById("question").innerText = q.question;
    document.getElementById("progress-text").innerText =
        (current + 1) + " / " + questions.length;

    let optHTML = "";
    ["A","B","C","D"].forEach((letter, i) => {
        optHTML += `
            <div class="option" onclick="select('${letter}')">
                ${letter}) ${q.options[i]}
            </div>`;
    });

    document.getElementById("options").innerHTML = optHTML;
}

function select(answer) {
    if (answer === questions[current].answer) {
        score++;
    } else {
        score--;
    }

    current++;
    showQuestion();
}

loadQuestions();
