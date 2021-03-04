//Get the difficulty from the previous page
const urlParams = new URLSearchParams(window.location.search);
var difficulty = String(urlParams.get("difficulty"));
var user = String(urlParams.get("username"));
const BASE_URL =
  "https://opentdb.com/api.php?amount=11&difficulty=" + difficulty;
const TOTAL_CATEGORIES_URL = "https://opentdb.com/api_category.php";
let index = 0;
let score = 0;

//get some UI elements

const loader = document.querySelector(".loader");

//fetches the raw data from the API

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

// fetches the categories data from the API
async function fetchCategoriesFromAPI() {
  const data = await fetchData(TOTAL_CATEGORIES_URL);
  return data.trivia_categories;
}

// fetches questions from the API and returns an object of questions with answers
async function fetchQuestionsFromAPI(url) {
  const data = await fetchData(url);
  if (data.response_code === 0) {
    const questions = data.results;
    const list = [];
    questions.forEach((element) => {
      const question = {
        question: decodeChars(element.question),
        answers: shuffle(
          element.incorrect_answers.concat(element.correct_answer)
        ), // will have to decode characters later on
        correct: decodeChars(element.correct_answer),
      };
      list.push(question);
    });
    return list;
  }
  return false;
}
// Fisher-Yates array shuffling algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
// decodes special HTML characters
function decodeChars(specialCharacterString) {
  const text = document.createElement("textarea");
  text.innerHTML = specialCharacterString;
  return text.value;
}
// sets the title for the h1 tag
function setTitle(string) {
  const title = document.getElementById("title");
  title.innerText = string;
}

// removes buttons from the div tag
function removeButtons() {
  const div = document.getElementById("buttons");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}
// sets the question number at the bottom of the quiz
function setQuestionNumber() {
  let questionNumber = index + 1;
  const h1Element = document.getElementById("question-number");
  h1Element.classList.add("number");
  h1Element.innerText = questionNumber + "/10";
}

// sets the buttons for each question
function setQuestionButtons(list, answers, correct) {
  const div = document.getElementById("buttons");
  setQuestionNumber();
  answers.forEach((element) => {
    const button = document.createElement("button");
    const text = document.createTextNode(decodeChars(element)); // decoding special characters from answers
    button.appendChild(text);
    button.className = "btn btn-primary";
    div.appendChild(button);
    button.addEventListener("click", () =>
      questionButtonEventHandler(button, correct, list)
    );
  });
}

// event handler for the question buttons
function questionButtonEventHandler(button, correctAnswer, list) {
  const pressedButton = button.innerText;
  if (pressedButton === correctAnswer) {
    score++;
    button.classList.remove("btn-primary");
    button.classList.add("btn-success");
  } else {
    alert("Wrong.\nCorrect Answer: " + correctAnswer);
  }
  index++;
  removeButtons();
  startQuiz(list);
}

// removes the question number from the bottom
function removeQuestionNumber() {
  const h1Element = document.getElementById("question-number");
  h1Element.classList.remove("number");
  h1Element.innerText = "";
}

// Add data to localStorage
function addToStorage() {
  var personWithScore = {
    username: user,
    score: score,
    difficulty: difficulty,
  };
  id = localStorage.length;
  window.localStorage.setItem(id, JSON.stringify(personWithScore));
}

// function to fill the table with info from local storage
function fillTableWithInfo() {
  addToStorage();

  // get the amount of stuff in the storage
  var people = localStorage.length;

  const leaderBoard = document.querySelector(".leaderboard");
  const leaderHead = document.querySelector(".leaderHead");
  let thead = leaderBoard.createTHead();
  let row = thead.insertRow();
  row.className = "card-body";
  let userHead = document.createElement("th");
  let scoreHead = document.createElement("th");
  let diffHead = document.createElement("th");

  userHead.innerHTML = "Username";
  scoreHead.innerHTML = "Score";
  diffHead.innerHTML = "Difficulty";

  row.appendChild(userHead).className = "card-body card-title";
  row.appendChild(scoreHead).className = "card-body card-title";
  row.appendChild(diffHead).className = "card-body card-title";

  var leaders = [];

  for (var i = 0; i < people; i++) {
    let userObj = JSON.parse(window.localStorage.getItem(i));
    leaders.push(userObj);
  }
  leaders.sort((a, b) => (a.score > b.score ? -1 : 1));

  leaders.forEach((person) => {
    let userRow = thead.insertRow();
    let actualUser = document.createElement("td");
    let userScore = document.createElement("td");
    let chosenDifficulty = document.createElement("td");
    userRow.className = "card-body";
    if (person.username == user) {
      userRow.className = "currentPlayerRow";
    }

    actualUser.innerHTML = person.username;
    userScore.innerHTML = person.score;
    chosenDifficulty.innerHTML = person.difficulty;

    userRow.appendChild(actualUser);
    userRow.appendChild(userScore);
    userRow.appendChild(chosenDifficulty);
  });

  leaderBoard.appendChild(thead);
  leaderHead.innerHTML = "LeaderBoard";
}

// shows the restart button at the end of the quiz
function showRestartButton() {
  removeQuestionNumber();
  fillTableWithInfo();
  const div = document.getElementById("buttons");
  const button = document.createElement("i");
  const text = document.createTextNode(" Restart");
  button.className = "fas fa-redo fa-3x restartBtn text-center";
  button.appendChild(text);
  div.appendChild(button);
  button.addEventListener("click", () => document.location.reload(true));
}

// starts the quiz and will load one question at a time
function startQuiz(questionList) {
  const numberOfQuestions = questionList.length - 1;
  if (index === numberOfQuestions) {
    setTitle("Your score was " + score + "/10");
    showRestartButton();
    return;
  }
  setTitle(questionList[index].question);
  setQuestionButtons(
    questionList,
    questionList[index].answers,
    questionList[index].correct
  );
}

// sets the categories from the API as cards
async function setCategoryButtons() {
  const categories = await fetchCategoriesFromAPI();
  const buttonList = document.getElementById("buttons");

  for (const category of categories) {
    const column = document.createElement("div");
    const card = document.createElement("div");
    const cardImgHolder = document.createElement("div");
    const image = document.createElement("img");
    const cardBody = document.createElement("div");
    const text = document.createElement("h5");
    text.innerHTML = category.name;
    let imgName = text.innerHTML;
    if (imgName.includes(":")) {
      let temp = imgName.split(":");
      imgName = temp[1].substring(1);
    }
    if (imgName.includes("&")) {
      let temp = imgName.split("&amp;");
      imgName = temp[1].substring(1);
    }
    let source;

    source = `assets/images/${imgName}.JPG`;

    image.src = source;

    column.className = "col-sm-3";
    cardImgHolder.className = "cardImgHolder";
    text.className = "card-title text-center";
    image.className = "card-img-top cardImg";
    cardBody.className = "card-body";

    cardBody.appendChild(text);
    card.setAttribute("id", category.id);
    // card.style = ""
    card.className = "card buttonCards";
    cardImgHolder.appendChild(image);
    card.appendChild(cardImgHolder);
    card.appendChild(cardBody);
    column.appendChild(card);
    buttonList.appendChild(column);
    card.addEventListener("click", () => categoryButtonEventHandler(card));
  }
}

// event handler for the category buttons
async function categoryButtonEventHandler(button) {
  const url = BASE_URL + "&category=" + button.id;
  const list = await fetchQuestionsFromAPI(url);
  if (list === false) {
    alert("Could not load quiz. Try again later.");
    return;
  }
  removeButtons();
  startQuiz(list);
}

function main() {
  setTitle("Select a Category");
  setCategoryButtons()
    .then(() => {
      loader.classList.add("hide");
    })
    .catch(() => {
      const retry = document.querySelector(".retry");
      const couldntConnect = document.querySelector(".couldntConnect");
      retry.addEventListener("click", () => {
        document.location.reload(true);
      });
      title.classList.add("hide");
      loader.classList.add("hide");
      couldntConnect.classList.remove("hide");
    });
}

main();
