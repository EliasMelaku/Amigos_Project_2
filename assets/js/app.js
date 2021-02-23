const easy = document.querySelector(".easy");
const normal = document.querySelector(".normal");
const hard = document.querySelector(".hard");

easy.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=easy`;
});
normal.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=medium`;
});
hard.addEventListener("click", () => {
  window.location.href = `quiz.html?difficulty=hard`;
});
