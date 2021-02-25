// get UI elements
const easy = document.querySelector(".easy");
const normal = document.querySelector(".normal");
const hard = document.querySelector(".hard");

const urlParams = new URLSearchParams(window.location.search);
var username = String(urlParams.get("username"));

if (username == null) {
  window.location.href = "index.html";
}
easy.addEventListener("click", () => {
  window.location.href = `quiz.html?username=${username}&difficulty=easy`;
});
normal.addEventListener("click", () => {
  window.location.href = `quiz.html?username=${username}&difficulty=medium`;
});
hard.addEventListener("click", () => {
  window.location.href = `quiz.html?username=${username}&difficulty=hard`;
});
