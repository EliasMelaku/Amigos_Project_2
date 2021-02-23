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

