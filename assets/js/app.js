// get UI elements
const easy = document.querySelector(".easy");
const normal = document.querySelector(".normal");
const hard = document.querySelector(".hard");

const username = document.querySelector("#username");
const form = document.querySelector(".usernameForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = `difficulty.html?username=${username.value}`;
});

easy.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=easy`;
});
normal.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=medium`;
});
hard.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=hard`;
});
