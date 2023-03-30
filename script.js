//https://opentdb.com/api.php?amount=10


const _question = document.getElementById('ask')
const _options = document.querySelector('.optionQuiz')
const _correctScore = document.getElementById('correctScore')
const _totalQuestion = document.getElementById('totalQuest')
const _checkBtn = document.getElementById('check')
const _playAgain = document.getElementById('playAgain')
const _result = document.getElementById('result')

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

const eventListeners = () => {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgain.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion()
    eventListeners()
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;

})
// step 1:
const loadQuestion = async () =>{
    const apiUrl = 'https://opentdb.com/api.php?amount=10'
    const result = await fetch(apiUrl)
    const data = await result.json();
    // console.log(data.results[0]);
    _result.innerHTML = "";
    showQuestion(data.results[0])
}

const showQuestion = (data) => {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer)

    _question.innerHTML = `${data.question} <br> <span class = "category">${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span> ${option} </span> </li>`).join('')}
    `;

    selectOption();
}

const selectOption = () => {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
    // console.log(correctAnswer);
}

const checkAnswer = () => {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
            correctScore ++;
            _result.innerHTML = `<p> <ion-icon name="checkmark-outline" class="icon"></ion-icon>Correct Answer! </p>`
        }else{
            _result.innerHTML = `
                <p> <ion-icon name="close-outline" class="icon"></ion-icon> Incorrect Answer: </p> <p> <small><b>Correct Answer: </b> ${correctAnswer}</small></p>`
        }

        checkCount();

    }else{
        _result.innerHTML = `<p><ion-icon name="help-outline" class="icon"></ion-icon>Please select an option</p>`;
        _checkBtn.disabled = false;
    }
}


const HTMLDecode = (textString) => {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


const checkCount = () => {
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
         _result.innerHTML += `<p> Your Score is ${correctScore}. </p> <br> <p class="amaze"> Incredible  </p>`;
         _playAgain.style.display = 'block';
         _checkBtn.style.display = 'none';
    }else{
        setTimeout(() => {
            loadQuestion();
        }, 3000);
    }
}

const setCount = () => {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;

}


const restartQuiz = () => {
    correctScore = askedCount = 0;
    _playAgain.style.display = 'none';
    _checkBtn.style.display = 'block';
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}