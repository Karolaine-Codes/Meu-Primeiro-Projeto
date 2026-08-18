let valorAtual = "";
let valorAnterior = "";
let operadorAtual = null;
let esperandoNovoNumero = false;
let emErro = false;

const resultado = document.getElementById("resultado");
const expressao = document.getElementById("expressao");

const botoes = document.querySelectorAll("button");

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {

    const numero = botao.dataset.number;
    const operador = botao.dataset.operator;
    const acao = botao.dataset.action;

    if (numero !== undefined) {
      adicionarNumero(numero);
    }

    if (operador !== undefined) {
      selecionarOperador(operador);
    }

    if (acao === "clear") {
      limpar();
    }

    if (acao === "delete") {
      apagar();
    }

    if (acao === "percent") {
      porcentagem();
    }

    if (acao === "calculate") {
      calcular();
    }
  });
});


/**
 * Atualiza o display com os valores atuais
 */
function atualizarDisplay() {

  resultado.textContent = valorAtual || "0";
  resultado.classList.remove("erro");

  emErro = false;

  if (valorAnterior && operadorAtual) {
    expressao.textContent =
      `${valorAnterior} ${mostrarOperador(operadorAtual)}`;
  } else {
    expressao.textContent = "";
  }
}


/**
 * Mostra o operador com o símbolo apropriado
 * @param {string} operador - O operador (+, -, *, /)
 * @returns {string} - O símbolo do operador
 */
function mostrarOperador(operador) {

  const operadores = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return operadores[operador] || operador;
}


/**
 * Adiciona um número ao valor atual
 * @param {string} numero - O número ou ponto a adicionar
 */
function adicionarNumero(numero) {

  // Se estava em erro, limpa o estado
  if (emErro) {
    limpar();
  }

  if (esperandoNovoNumero) {
    valorAtual = "";
    esperandoNovoNumero = false;
  }

  // Não permite dois pontos
  if (numero === "." && valorAtual.includes(".")) {
    return;
  }

  // Se começar com ponto, transforma em 0.
  if (numero === "." && valorAtual === "") {
    valorAtual = "0";
  }

  // Evita números como 0005
  if (valorAtual === "0" && numero !== ".") {
    valorAtual = "";
  }

  valorAtual += numero;

  atualizarDisplay();
}


/**
 * Seleciona um operador matemático
 * @param {string} operador - O operador (+, -, *, /)
 */
function selecionarOperador(operador) {

  if (valorAtual === "" && valorAnterior === "") {
    return;
  }

  // Permite trocar o operador
  if (
    valorAnterior &&
    esperandoNovoNumero
  ) {
    operadorAtual = operador;
    atualizarDisplay();
    return;
  }

  // Calcula antes de continuar
  if (
    valorAnterior &&
    operadorAtual &&
    valorAtual
  ) {
    calcular();
  }

  valorAnterior = valorAtual;
  operadorAtual = operador;

  esperandoNovoNumero = true;

  atualizarDisplay();
}


/**
 * Calcula o resultado da operação
 */
function calcular() {

  if (
    valorAnterior === "" ||
    operadorAtual === null ||
    valorAtual === ""
  ) {
    return;
  }

  const anterior = parseFloat(valorAnterior);
  const atual = parseFloat(valorAtual);

  let resultadoCalculo;

  switch (operadorAtual) {

    case "+":
      resultadoCalculo = anterior + atual;
      break;

    case "-":
      resultadoCalculo = anterior - atual;
      break;

    case "*":
      resultadoCalculo = anterior * atual;
      break;

    case "/":

      if (atual === 0) {
        mostrarErro();
        return;
      }

      resultadoCalculo = anterior / atual;
      break;
  }

  // Evita problemas de precisão do JavaScript
  resultadoCalculo =
    Math.round(
      (resultadoCalculo + Number.EPSILON) * 100000000
    ) / 100000000;

  valorAtual = resultadoCalculo.toString();

  valorAnterior = "";
  operadorAtual = null;

  esperandoNovoNumero = true;

  atualizarDisplay();
}


/**
 * Limpa a calculadora e reseta todos os valores
 */
function limpar() {

  valorAtual = "";
  valorAnterior = "";
  operadorAtual = null;
  emErro = false;

  esperandoNovoNumero = false;

  atualizarDisplay();
}


/**
 * Apaga o último dígito do valor atual
 */
function apagar() {

  if (esperandoNovoNumero) {
    return;
  }

  valorAtual = valorAtual.slice(0, -1);

  atualizarDisplay();
}


/**
 * Converte o valor atual para porcentagem
 */
function porcentagem() {

  if (valorAtual === "") {
    return;
  }

  valorAtual =
    (parseFloat(valorAtual) / 100).toString();

  atualizarDisplay();
}


/**
 * Mostra uma mensagem de erro na calculadora
 */
function mostrarErro() {

  emErro = true;

  resultado.textContent = "Erro";
  resultado.classList.add("erro");

  valorAtual = "";
  valorAnterior = "";
  operadorAtual = null;

  esperandoNovoNumero = true;
}


// ===============================
// TECLADO
// ===============================

/**
 * Listeners de eventos do teclado
 */
document.addEventListener("keydown", (event) => {

  const tecla = event.key;
  let foiTeclaValida = false;

  // Números
  if (tecla >= "0" && tecla <= "9") {
    adicionarNumero(tecla);
    foiTeclaValida = true;
  }

  // Ponto
  if (tecla === ".") {
    adicionarNumero(".");
    foiTeclaValida = true;
  }

  // Operadores
  if (
    tecla === "+" ||
    tecla === "-" ||
    tecla === "*" ||
    tecla === "/"
  ) {
    selecionarOperador(tecla);
    foiTeclaValida = true;
  }

  // Enter
  if (tecla === "Enter" || tecla === "=") {
    calcular();
    foiTeclaValida = true;
  }

  // Backspace
  if (tecla === "Backspace") {
    apagar();
    foiTeclaValida = true;
  }

  // Escape
  if (tecla === "Escape") {
    limpar();
    foiTeclaValida = true;
  }

  // Porcentagem
  if (tecla === "%") {
    porcentagem();
    foiTeclaValida = true;
  }

  // Previne comportamento padrão apenas para teclas válidas
  if (foiTeclaValida) {
    event.preventDefault();
  }
});


atualizarDisplay();