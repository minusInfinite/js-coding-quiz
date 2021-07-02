var quizEl = document.querySelector("#quiz")
var timeEl = document.querySelector("#time")
var highscoresBtn = document.querySelector("#highscores")
var startBtn = document.querySelector("#start")

var quiz = {
    questions: [
        "What object type represents the users browser?",
        "Which symbols defind an object?",
    ],
    options: [
        ["window", "array", "number", "string"],
        [
            "Squre brackets",
            "Curly brackets",
            "Rounded Brackets",
            "Quotation Marks",
        ],
    ],
    answers: ["window", "Curly brackets"],
    current: 0,
    correct: 0,
    total: function () {
        return this.questions.length
    },
}

var timer = 0

function startTimer(seconds) {
    timer = setInterval(function () {
        if (seconds === 0) {
            clearInterval(timer)
            timeEl.textContent = ""
            init()
        } else {
            timeEl.textContent = `Time: ${
                seconds < 10 ? `0${seconds}` : `${seconds}`
            }`
            seconds--
        }
    }, 1000)
}

function stopTimer() {
    clearInterval(timer)
    init()
}

function startQuiz() {
    var quizQuestion = document.createElement("h1")
    var currentQuestion = quiz.current
    var isCorrect = document.createElement("em")

    quizEl.textContent = ""
    isCorrect.textContent = ""
    quizQuestion.textContent = quiz.questions[currentQuestion]
    quizEl.appendChild(quizQuestion)

    for (var i = 0; i < quiz.options[currentQuestion].length; i++) {
        var quizBtn = document.createElement("button")
        var options = quiz.options[currentQuestion][i]
        var answer = quiz.answers[currentQuestion]
        quizBtn.setAttribute("data-index", i)
        if (options === answer) {
            quizBtn.setAttribute("data-answer", "yes")
        } else {
            quizBtn.setAttribute("data-answer", "no")
        }
        quizBtn.textContent = options
        quizEl.appendChild(quizBtn)
    }

    quizEl.appendChild(isCorrect)

    quizEl.addEventListener("click", function (event) {
        var element = event.target

        if (element.localName === "button") {
            var answer = element.getAttribute("data-answer")
            if (answer === "yes") {
                isCorrect.textContent = "Correct"
                quiz.current++
                startQuiz()
            } else if (answer === "no") {
                isCorrect.textContent = "wrong"
                quiz.current++
                startQuiz()
            }
        }
    })
}

function init() {
    var initQuizH1 = document.createElement("h1")
    initQuizH1.textContent = "Code Quiz"

    var initQuizP = document.createElement("p")
    initQuizP.textContent = "Press the button below to start the quiz"

    var initQuizBtn = document.createElement("button")
    initQuizBtn.setAttribute("id", "start")
    initQuizBtn.textContent = "Start Quiz"

    quizEl.appendChild(initQuizH1)
    quizEl.appendChild(initQuizP)
    quizEl.appendChild(initQuizBtn)

    startBtn = document.querySelector("#start")

    startBtn.addEventListener("click", (_event) => {
        _event.preventDefault()
        startQuiz()
    })
}

init()
