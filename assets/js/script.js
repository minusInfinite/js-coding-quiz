//Setting Global Element Selectors
var quizEl = document.querySelector("#quiz")
var highscoresEl = document.querySelector("#highscores")
var highscoresBtn = document.querySelector("#highscores-button")
var formEl = document.querySelector("#score-form")
var timeEl = document.querySelector("#time")
var startBtn = document.querySelector("#start")
var clearBtn = document.querySelector("#clear")
var backBtn = document.querySelector("#back")

//Global TimerID and Timer Counter
var timerId = 0
var timeLeft = 0

//Get and Store any HighScores in the browsers localStorage.
var storedScores = localStorage.getItem("highscore") || "[]"

//The Quiz Object for tracking the game
var quiz = {
    questions: [
        "What object type represents the users browser?",
        "Which symbols defind an object?",
        "__ is a Conditional Statement",
        "what does parseInt() return",
    ],
    options: [
        ["Window", "Array", "Number", "String"],
        [
            "Squre brackets",
            "Curly brackets",
            "Rounded Brackets",
            "Quotation Marks",
        ],
        ["Boolean", "Function", "If", "DOM"],
        ["Object", "Number", "Array", "JSON"],
    ],
    answers: ["Window", "Curly brackets", "If", "Number"],
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

//the function used to setup the setInterval countdown
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

//the function used to stop the setInterval countdown
function stopTimer() {
    clearInterval(timerId)
    timeLeft = 0
    timeEl.textContent = ""
}

/*
Function used to generate the next question.
A Property from the Quiz object is injected as the index
*/
function getQuestion(index) {
    var quizQuestion = document.createElement("h1")
    quizEl.textContent = ""

    if (!quiz.questions[quiz.current]) {
        stopTimer()
        scoreForm()
    } else {
        quizQuestion.textContent = quiz.questions[quiz.current]
        quizEl.appendChild(quizQuestion)

        /*
        This for loop creates the buttons needed for the answers.
        This does mean it is possible to cheat if the source code is looked at
        */
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

/*
The function is used to generate the Scoreboard when View Highscores is clicked
Or when the game is over, either via timeout or answering all questions
*/
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

//this function shows the form to add a name to scoreboard
function scoreForm() {
    var initialInput = document.querySelector("#initials")
    var scoreInput = document.querySelector("#score")
    var scoreSubmit = document.querySelector("#submit")
    var playerScore = 0

    //The Score is added as a percentage of correct answers plus a bonus for speed
    playerScore = quiz.score() + timeLeft

    var result = {
        initials: "",
        score: 0,
    }

    scoreTable()
    quizEl.setAttribute("class", "hidden")
    if (formEl.getAttribute("class") === "hidden") {
        formEl.removeAttribute("class")
        initialInput.removeAttribute("class")
        initialInput.removeAttribute("placeholder")
        highscoresBtn.setAttribute("class", "hidden")
    }

    initialInput.value = ""
    scoreInput.value = playerScore
    scoreSubmit.addEventListener("click", (event) => {
        event.preventDefault()
        //there is an unidentifed bubble here. This is the likely prevention
        event.stopImmediatePropagation()
        if (
            initialInput.value.trim() === "" ||
            initialInput.value.trim().length > 3
        ) {
            initialInput.setAttribute("class", "warning")
            initialInput.setAttribute("placeholder", "Invalid input")
        } else {
            result.initials = initialInput.value.trim()
            result.score = quiz.score() + timeLeft
            var hiscores = [...JSON.parse(storedScores), result]
            localStorage.setItem("highscore", JSON.stringify(hiscores))
            storedScores = localStorage.getItem("highscore")
            formEl.setAttribute("class", "hidden")

            initialInput.setAttribute("placeholder", "Invalid input")
            scoreTable()
        }
    })
}

//This functions generates the first page before the quiz is started
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
    initQuizP.textContent = `There are ${quiz.total()} questions.
    You have ${quiz.total() * 20} seconds to commplete this quiz.
    Press the button below to start the quiz.`

    var initQuizBtn = document.createElement("button")
    initQuizBtn.setAttribute("id", "start")
    initQuizBtn.textContent = "Start Quiz"

    quizEl.appendChild(initQuizH1)
    quizEl.appendChild(initQuizP)
    quizEl.appendChild(initQuizBtn)

    startBtn = document.querySelector("#start")

    startBtn.addEventListener("click", (_event) => {
        _event.preventDefault()
        startTimer(quiz.total() * 20)
        getQuestion(quiz.current)
    })
}

//this event will trigger when clicking "View Highscores" the to top left
highscoresBtn.addEventListener("click", () => {
    quizEl.setAttribute("class", "hidden")
    formEl.setAttribute("class", "hidden")
    highscoresBtn.setAttribute("class", "hidden")
    clearBtn.removeAttribute("class", "hidden")
    scoreTable()
})

/*
this event controls how the answer button work when they are generated
*/
quizEl.addEventListener("click", function (event) {
    var isCorrect = document.createElement("em")
    isCorrect.textContent = ""
    quizEl.appendChild(isCorrect)

    event.stopPropagation()
    var element = event.target

    //this checks to confirm that is was an answer button that triggered.
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
