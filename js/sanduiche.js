const toggle = document.getElementById("menu-toggle");
const menuBotoes = document.getElementById("menu-botoes");

toggle.addEventListener("click", () => {
  menuBotoes.classList.toggle("aberto");
});

setTimeout(() => {
  const tooltip = document.querySelector(".matty-tooltip");
  if (tooltip) tooltip.classList.add("escondido");
}, 2000);