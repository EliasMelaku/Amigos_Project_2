const easy = document.querySelector(".Easy");
const normal = document.querySelector(".Normal");
const hard = document.querySelector(".Hard");

easy.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=easy`;
});
normal.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=medium`;
});
hard.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=hard`;
});
