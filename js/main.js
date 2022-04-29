// Play button
const playButton = document.getElementById('Q1');

// Defining the different modals
const info_box = document.querySelector(".info_box");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");

// Continue & Quit buttons
const cancelButton = info_box.querySelector(".buttons .quit");
const startButton = info_box.querySelector(".buttons .restart");
const doneButton = result_box.querySelector(".buttons .quit");

// Defining parts of the quiz
const option_list = document.querySelector(".option_list");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// Start quiz button function
playButton.onclick = function click() {
    info_box.classList.add("activeInfo"); // Show rules modal
};

// Cancel button
cancelButton.onclick = ()=>{
    info_box.classList.remove("activeInfo"); //hide info box
}

// Start Quiz button
startButton.onclick = ()=>{
    info_box.classList.remove("activeInfo"); 
    quiz_box.classList.add("activeQuiz");
    showQuestions(0); // Display questions from questions.js 
    startTimer(15); // Starts the timer by calling startTimer() function with 15 seconds on the clock
    questionCounter(1);
    document.getElementById('background_1').play(); // Start background music
};

// Done button
doneButton.onclick = ()=>{
    window.location.reload(); //reload the current window
}

let timeValue =  15; // Seconds on the clock
let questionCount = 0;
let questionNum = 1;
let userScore = 0; // Each correct answer causes an increment in value

function showQuestions(index){ // Pulls questions from array
    const question_text = document.querySelector(".question_text");

    let que_tag = '<span>'+ bio_questions[index].number + ". " + bio_questions[index].question +'</span>';
    let option_tag = '<div class="option"><span>'+ bio_questions[index].options[0] +'</span></div>'
    + '<div class="option"><span>'+ bio_questions[index].options[1] +'</span></div>'
    + '<div class="option"><span>'+ bio_questions[index].options[2] +'</span></div>'
    + '<div class="option"><span>'+ bio_questions[index].options[3] +'</span></div>';
    question_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;
    
    const option = option_list.querySelectorAll(".option");

    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

function startTimer(time){ // Starts the timer 
    counter = setInterval(timer, 1000); // Value is updated after every 1000ms, equivalent to 1 second
    function timer(){
        timeCount.textContent = time;
        time--; // Decrement value, countdown
        if(time < 9){
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero;
        }
        if(time < 0){
            clearInterval(counter);
            timeText.textContent = "Times Up!";
            const allOptions = option_list.children.length;
            let correctAnswer = bio_questions[questionCount].answer;
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correctAnswer){
                    option_list.children[i].setAttribute("class", "option correct");
                }
            }
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled");
            }

            setTimeout(function() { nextQuestion(); }, 3000); // Proceeds to next question after 3000ms, equivalent to 3 seconds
        }
    }
}

function questionCounter(index){
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ bio_questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;
}

function nextQuestion(){
    if(questionCount < bio_questions.length - 1){
        questionCount++;
        questionNum++;
        showQuestions(questionCount);
        questionCounter(questionNum);
        clearInterval(counter);
        startTimer(timeValue);
        timeText.textContent = "Time Left";
    }else{
        clearInterval(counter);
        showResult();
    }
}

const bottom_ques_counter = document.querySelector("footer .question_no_modal"); // Displays question number in Modal footer

function optionSelected(answer){
    clearInterval(counter);
    let userAns = answer.textContent;
    let correctAnswer = bio_questions[questionCount].answer;
    const allOptions = option_list.children.length;
    
    if(userAns == correctAnswer){
        userScore += 1; // Increment score value if answer is correct
        answer.classList.add("correct");
        document.getElementById('correct_chime').play(); // Play feedback sound
    }else{
        answer.classList.add("incorrect");
        document.getElementById('incorrect_chime').play(); // Play feedback sound

        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correctAnswer){ 
                option_list.children[i].setAttribute("class", "option correct");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled");
    }

    setTimeout(function() { nextQuestion(); }, 3000); // Proceeds to next question after 3000ms, equivalent to 3 seconds

}

function showResult(){
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    if (userScore == bio_questions.length){
        let scoreTag = 'Perfect! You got <b>'+ userScore +'</b> out of <b>'+ bio_questions.length +'</b>';
        scoreText.innerHTML = scoreTag;
        document.getElementById('perfect_score').play(); // Play feedback sound
    }
    else if(userScore > 2){
        let scoreTag = 'Good Job! You got <b>'+ userScore +'</b> out of <b>'+ bio_questions.length +'</b>';
        scoreText.innerHTML = scoreTag;
        document.getElementById('pass_sound').play(); // Play feedback sound
    }
    else{
        let scoreTag = 'Better luck next time! <br> You got <b>'+ userScore +'</b> out of <b>'+ bio_questions.length + '</b>';
        scoreText.innerHTML = scoreTag;
        document.getElementById('fail_sound').play(); // Play feedback sound
    }
}