let questionBank;
let totalQuestions;
let question = document.querySelector('.question');
let response = document.querySelector('h6');

let answers = document.querySelector('.answers');
const submitAnswer = document.querySelector('button');
let totalCorrectAnswers = 0;

window.onload = function () {
  fetch('questionBank.json')
    .then((res) => res.json())
    .then((data) => {
      questionBank = data.question_bank;
      totalQuestions = data.question_bank.length;
      newQuestion();
    });
};

const newQuestion = () => {
  const potentialAnswers = questionBank[0].potential_answers;
  question.innerHTML = questionBank[0].question;
  answers.innerHTML = '';
  for (let i = 0; i < potentialAnswers.length; i++) {
    const radio = document.createElement('input');
    const label = document.createElement('label');
    const br = document.createElement('br');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'answer');
    radio.setAttribute('value', potentialAnswers[i]);
    label.append(document.createTextNode(potentialAnswers[i]));
    answers.append(radio);
    answers.append(label);
    answers.append(br);
  }
};

submitAnswer.addEventListener('click', () => {
  checkAnswer();
  questionBank.shift();
  if (questionBank.length === 0) {
    response.innerHTML = `Your are finished and you got ${totalCorrectAnswers} / ${totalQuestions} correct`;
    ;
    return;
  }
  newQuestion();
});

const checkAnswer = () => {
  const userAnswer = document.querySelector('input[name="answer"]:checked')
    .value;
  const correctAnswer = questionBank[0].correct_answer;
  if (userAnswer === correctAnswer) {
    totalCorrectAnswers++;
  }
};
