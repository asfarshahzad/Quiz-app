window.addEventListener("load", () => {
    sectionFirst.style.display = "block";
    sectionSecond.style.display = "none";
    sectionThird.style.display = "none";
});

// Event listener for the "Get Started" button
getStartedBtn.addEventListener("click", () => {
    showLoader();

    setTimeout(() => {
        hideLoader();

        // Hide landing page
        sectionFirst.style.display = "none";

        // Show quiz section
        sectionSecond.style.display = "block";

        // Hide result section
        sectionThird.style.display = "none";

        // Start the quiz
        loadQuestion();

    }, 2000);
    startCountdown(2 * 60);
});


// Function to show the loader
function showLoader() {
    const loader = document.getElementById("loader");
    loader.classList.add("active");
}

// Function to hide the loader
function hideLoader() {
    const loader = document.getElementById("loader");
    loader.classList.remove("active");
}

let score = 0;
let currentQuestionIndex = 0;

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const progressElement = document.getElementById("progress");

function selectOption(button, index) {
    const options = document.querySelectorAll(".option");
    options.forEach((option) => option.classList.remove("selected"));
    button.classList.add("selected");

    const currentQuestion = questions[currentQuestionIndex];
    if (index === currentQuestion.correct) {
        score++;
    }

    nextButton.disabled = false;
}

// Function to start the countdown timer
function startCountdown(durationInSeconds) {
    const timerElement = document.querySelector(".time span");
    let remainingTime = durationInSeconds;

    countdownInterval = setInterval(() => {
        const minutes = String(Math.floor(remainingTime / 60)).padStart(2, "0");
        const seconds = String(remainingTime % 60).padStart(2, "0");
        timerElement.textContent = `${minutes} : ${seconds}`;

        if (remainingTime <= 30) {
            timerElement.style.color = "red";
        }

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            Swal.fire("Time's up!")
                .then(() => {
                    setTimeout(() => {
                        endQuiz();
                    }, 100);
                })
        }

        remainingTime--;
    }, 1000);
}

const questions = [
    {
        question: "1. What is the correct syntax to print a message in JavaScript?",
        options: ["console.print()", "console.log()", "print()", "document.write()"],
        correct: 1,
    },
    {
        question: "2. Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "All of the above"],
        correct: 3,
    },
    {
        question: "3. Which operator is used for equality without type conversion?",
        options: ["=", "==", "===", "!="],
        correct: 2,
    },
    {
        question: "4. How do you write a function in JavaScript?",
        options: [
            "function myFunction()",
            "def myFunction()",
            "fun myFunction()",
            "method myFunction()",
        ],
        correct: 0,
    },
    {
        question: "5. Which symbol is used for single-line comments?",
        options: ["//", "/* */", "#", "<!-- -->"],
        correct: 0,
    }
];


function loadQuestion() {
    // Clear previous options
    optionsContainer.innerHTML = "";
    nextButton.disabled = true;

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.addEventListener("click", () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });

    progressElement.textContent = `${currentQuestionIndex + 1} / ${questions.length} Questions`;
}

function endQuiz() {
    clearInterval(countdownInterval);

    // Hide other sections
    document.getElementById("sectionFirst").style.display = "none";
    document.getElementById("sectionSecond").style.display = "none";

    // Calculate the percentage and display the score
    const totalQuestions = questions.length;
    const correctAnswers = score;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Update circular progress animation
    const circularProgress = document.getElementById("circularProgress");
    const progressValue = document.getElementById("progressValue");

    let progress = 0;
    const interval = setInterval(() => {
        if (progress >= percentage) {
            clearInterval(interval);
        } else {
            progress++;
            circularProgress.style.setProperty("--percentage", `${progress}%`);
            progressValue.textContent = `${progress}%`;
        }
    }, 15);

    // Update result message based on score
    const resultMessage = document.querySelector(".result-message");
    if (percentage >= 80) {
        resultMessage.textContent = "Excellent! You're a trivia master!";
    } else if (percentage >= 50) {
        resultMessage.textContent = "Good job! Keep practicing to improve.";
    } else {
        resultMessage.textContent = "Don't give up! Try again and do better.";
    }

    // Show the result section
    const resultSection = document.getElementById("sectionThird");
    resultSection.style.display = "block";

    // Update the score display
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `${correctAnswers} / ${totalQuestions}`;

    // Change score color if score is less than 3
    if (correctAnswers < 3) {
        scoreElement.style.color = "red";
    } else {
        scoreElement.style.color = "#243b55";
    }
}

// Event listener for the "Back to Home" button
const backButton = document.getElementById("backToHomeBtn");

backButton.addEventListener("click", () => {
    showLoader();

    setTimeout(() => {
        // Hide the result section
        document.getElementById("sectionThird").style.display = "none";

        // Hide the loader
        hideLoader();

        // Show the landing page section
        document.getElementById("sectionFirst").style.display = "block";

        // Reset quiz state
        resetQuiz();
    }, 2000);
});

function resetQuiz() {
    score = 0;
    currentQuestionIndex = 0;

    // Reset progress display
    progressElement.textContent = `1 / ${questions.length} Questions`;

    // Clear options
    optionsContainer.innerHTML = "";

    // Reset timer display
    const timerElement = document.querySelector(".time span");
    timerElement.textContent = "02 : 00";

    // Stop any ongoing timer
    clearInterval(countdownInterval);

    // Disable the "Next" button
    nextButton.disabled = true;
}


nextButton.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz(); // End the quiz and show the result
    }
});

// Load the first question
loadQuestion();