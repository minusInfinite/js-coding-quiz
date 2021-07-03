var quizEl = document.querySelector("#quiz")
var highscoresEl = document.querySelector("#highscores")
var highscoresBtn = document.querySelector("#highscores-button")
var formEl = document.querySelector("#score-form")
var timeEl = document.querySelector("#time")
var startBtn = document.querySelector("#start")
var clearBtn = document.querySelector("#clear")
var backBtn = document.querySelector("#back")

var timerId = 0
var timeLeft = 0

var storedScores = localStorage.getItem("highscore") || "[]"

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
    answered: 0,
    incorrect: 0,
    total: function () {
        return this.questions.length
    },
    score: function () {
        if (this.answered === 0) {
            this.incorrect = this.total()
        }
        return ((this.total() - this.incorrect) / this.total()) * 100
    },
}

function startTimer(seconds) {
    timeLeft = seconds

    timerId = setInterval(function () {
        if (timeLeft === 0) {
            clearInterval(timerId)
            timeEl.textContent = ""
            scoreForm()
        } else {
            timeEl.textContent = `Time: ${
                timeLeft < 10 ? `0${timeLeft}` : `${timeLeft}`
            }`
            timeLeft--
        }
    }, 1000)
}

function stopTimer() {
    clearInterval(timerId)
    timeLeft = 0
    timeEl.textContent = ""
}

function getQuestion(index) {
    var quizQuestion = document.createElement("h1")
    quizEl.textContent = ""

    if (!quiz.questions[quiz.current]) {
        stopTimer()
        scoreForm()
    } else {
        quizQuestion.textContent = quiz.questions[quiz.current]
        quizEl.appendChild(quizQuestion)

        for (var i = 0; i < quiz.options[index].length; i++) {
            var quizBtn = document.createElement("button")
            var options = quiz.options[index][i]
            var answer = quiz.answers[index]
            quizBtn.setAttribute("data-index", i)
            if (options === answer) {
                quizBtn.setAttribute("data-answer", "yes")
            } else {
                quizBtn.setAttribute("data-answer", "no")
            }
            quizBtn.textContent = options
            quizEl.appendChild(quizBtn)
        }
    }
}

function scoreTable() {
    var scoreEl = document.querySelector("#scoreboard")
    var scoreSpanHeader1 = document.createElement("span")
    var scoreSpanHeader2 = document.createElement("span")
    var hiscores = [...JSON.parse(storedScores)].sort(
        (a, b) => b.score - a.score
    )

    quizEl.setAttribute("class", "hidden")
    if (highscoresEl.getAttribute("class") === "hidden") {
        highscoresEl.removeAttribute("class")
        highscoresBtn.setAttribute("class", "hidden")
    }

    scoreEl.setAttribute("class", "scores")
    scoreEl.textContent = ""
    scoreSpanHeader1.textContent = "Initials"
    scoreSpanHeader2.textContent = "Scores"
    scoreEl.appendChild(scoreSpanHeader1)
    scoreEl.appendChild(scoreSpanHeader2)
    if (hiscores.length > 0) {
        for (var i = 0; i < hiscores.length; i++) {
            for (var prop in hiscores[i]) {
                var scoreSpan = document.createElement("span")
                scoreSpan.textContent = hiscores[i][prop]
                scoreEl.appendChild(scoreSpan)
            }
        }
    }

    clearBtn.removeAttribute("class")

    clearBtn.addEventListener("click", () => {
        localStorage.clear()
        storedScores = "[]"
        scoreTable()
    })

    backBtn.addEventListener("click", () => {
        highscoresEl.setAttribute("class", "hidden")
        highscoresBtn.removeAttribute("class")
        init()
    })
}

function scoreForm() {
    var initialInput = document.querySelector("#initials")
    var scoreInput = document.querySelector("#score")
    var scoreSubmit = document.querySelector("#submit")
    var playerScore = quiz.score()

    var result = {
        initials: "",
        score: 0,
    }

    scoreTable()
    quizEl.setAttribute("class", "hidden")
    if (formEl.getAttribute("class") === "hidden") {
        formEl.removeAttribute("class")
        highscoresBtn.setAttribute("class", "hidden")
    }

    initialInput.value = ""
    scoreInput.value = playerScore
    scoreSubmit.addEventListener("click", (event) => {
        event.preventDefault()
        event.stopImmediatePropagation()
        if (
            initialInput.value.trim() === "" ||
            initialInput.value.trim().length > 3
        ) {
            initialInput.setAttribute("class", "warning")
            initialInput.setAttribute("placeholder", "Invalid input")
        } else {
            result.initials = initialInput.value.trim()
            result.score = quiz.score()
            var hiscores = [...JSON.parse(storedScores), result]
            localStorage.setItem("highscore", JSON.stringify(hiscores))
            storedScores = localStorage.getItem("highscore")
            scoreTable()
        }
        formEl.setAttribute("class", "hidden")
    })
}

function init() {
    if (quizEl.getAttribute("class") === "hidden") {
        quizEl.removeAttribute("class")
    }
    quizEl.textContent = ""
    quiz.answered = 0
    quiz.current = 0
    quiz.incorrect = 0

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
        startTimer(30)
        getQuestion(quiz.current)
    })
}

highscoresBtn.addEventListener("click", () => {
    quizEl.setAttribute("class", "hidden")
    formEl.setAttribute("class", "hidden")
    highscoresBtn.setAttribute("class", "hidden")
    clearBtn.removeAttribute("class", "hidden")
    scoreTable()
})

quizEl.addEventListener("click", function (event) {
    var isCorrect = document.createElement("em")
    isCorrect.textContent = ""
    quizEl.appendChild(isCorrect)

    event.stopPropagation()
    var element = event.target

    if (element.localName === "button" && element.hasAttribute("data-answer")) {
        quiz.current++
        quiz.answered++
        var answer = element.getAttribute("data-answer")
        if (answer === "yes") {
            isCorrect.textContent = "Correct"
            getQuestion(quiz.current)
        } else if (answer === "no") {
            quiz.incorrect++
            timeLeft -= 5
            isCorrect.textContent = "wrong"
            getQuestion(quiz.current)
        }
    }
})

init()
