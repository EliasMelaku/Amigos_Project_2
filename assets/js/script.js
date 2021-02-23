//Get the difficulty from the previous page
const urlParams = new URLSearchParams(window.location.search);
var difficulty = String(urlParms.get("difficulty"));
const BASE_URL ="https://opentdb.com/api.php?amount=11&difficulty=" + difficulty;
const TOTAL_CATEGORIES_URL = "https://opentdb.com/api_category.php";
console.log(BASE_URL);
let index = 0;
let score = 0;

//get some UI elements

const loader = document.querySelector(".loader");

//fetches the raw data from the API

async function fetchData(url){

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







































