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
        "__ is the start of a Conditional Statement",
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
    incorrect: 0,
    timeRemaining: 0,
    total: function () {
        return this.questions.length
    },
    score: function () {
        if (this.current === 0) {
            this.incorrect = this.total()
        }
        return (
            ((this.total() - this.incorrect) / this.total()) * 100 +
            this.timeRemaining
        )
    },
}

//The function used to setup the setInterval countdown
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

//The function used to stop the setInterval countdown
function stopTimer() {
    clearInterval(timerId)
    quiz.timeRemaining = timeLeft
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

    if (!quiz.questions[index]) {
        stopTimer()
        scoreForm()
    } else {
        quizQuestion.textContent = quiz.questions[index]
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

//This function shows the form to add a name to scoreboard
function scoreForm() {
    var initialInput = document.querySelector("#initials")
    var scoreInput = document.querySelector("#score")
    var scoreSubmit = document.querySelector("#submit")
    var playerScore = 0

    //The Score is added as a percentage of correct answers plus a bonus for speed
    playerScore = quiz.score()

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
        /* There is an unidentifed "bubble" here. Sometimes triggering this twice. 
        This appear to be the a likely prevention */
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

function stateAnswer(answer) {
    var isCorrect = document.createElement("em")
    var displayTimer
    var count = 3
    isCorrect.textContent = ""
    quizEl.appendChild(isCorrect)

    displayTimer = setInterval(function () {
        if (count === 0) {
            clearInterval(displayTimer)
            quizEl.lastChild.remove()
            getQuestion(quiz.current)
        } else {
            isCorrect.textContent = answer
            count--
        }
    }, 300)
}

//This event will trigger when clicking "View Highscores" the to top left
highscoresBtn.addEventListener("click", () => {
    quizEl.setAttribute("class", "hidden")
    formEl.setAttribute("class", "hidden")
    highscoresBtn.setAttribute("class", "hidden")
    clearBtn.removeAttribute("class", "hidden")
    scoreTable()
})

/*
This event controls how the answer button work when they are generated
*/
quizEl.addEventListener("click", function (event) {
    var element = event.target

    //This checks to confirm that is was an answer button that triggered.
    if (element.localName === "button" && element.hasAttribute("data-answer")) {
        quiz.current++
        var answer = element.getAttribute("data-answer")
        if (answer === "yes") {
            stateAnswer("Correct")
        } else if (answer === "no") {
            quiz.incorrect++
            timeLeft -= 10
            stateAnswer("wrong")
        }
    }
})

//This functions generates the first page before the quiz is started
function init() {
    if (quizEl.getAttribute("class") === "hidden") {
        quizEl.removeAttribute("class")
    }
    quizEl.textContent = ""
    quiz.current = 0
    quiz.incorrect = 0

    var initQuizH1 = document.createElement("h1")
    initQuizH1.textContent = "Code Quiz"

    var initQuizP = document.createElement("p")
    initQuizP.textContent = `There are ${quiz.total()} questions.
    You have ${quiz.total() * 15} seconds to complete this quiz.
    A wrong answer will deduct 10 seconds from your time.
    Your score is based on the percentage correct, plus a time bonus

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
        startTimer(quiz.total() * 15)
        getQuestion(quiz.current)
    })
}

init()
