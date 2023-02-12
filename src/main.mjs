import "./style.scss";
import { Toast, toast } from "@materializecss/materialize";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// DOM
const numero = document.querySelector("#numero");
const calculoBtn = document.querySelector("#botao");
const NumerosPrimosTxt = document.querySelector("#numeros_primos");
const NumerosPrimosQuantosTxt = document.querySelector(
  "#numeros_primos_quantos"
);
const graficoCheckbox = document.querySelector("#graficoCheckbox");
const segurancaCheckbox = document.querySelector("#segurancaCheckbox");

// Event binds
numero.addEventListener("input", checkInputLength);
calculoBtn.addEventListener("click", calcularPrimos);
graficoCheckbox.addEventListener("change", toggleGrafico);
segurancaCheckbox.addEventListener("change", toggleSegurança);

// Mantém o estado do gráfico chart.js
// Usado para limpar o gráfico entre cálculos
let grafico;

// Config
let maxlength = 5;
let fazerGrafico = true;

// Desabilita o limite de 5 dígitos para o número a calcular
// Quando desabilitado há uma chance alta de o web app travar
function toggleSegurança() {
  const segurancaLabel = document.querySelector("#limiteSegurancaLabel");
  const graficoLabel = document.querySelector("#graficoLabel");
  const botao = document.querySelector("#botao");

  if (maxlength == 5) {
    maxlength = 32;
    segurancaLabel.classList.add("red-text");
    graficoLabel.classList.add("red-text");
    botao.classList.add("red");
    graficoCheckbox.checked = false;
  } else {
    maxlength = 5;
    if (numero.value.length > maxlength)
      numero.value = numero.value.slice(0, maxlength);
    segurancaLabel.classList.remove("red-text");
    graficoLabel.classList.remove("red-text");
    botao.classList.remove("red");
  }
}

// Alterna a exibição do gráfico
function toggleGrafico() {
  fazerGrafico = graficoCheckbox.checked;
}

// Limita o número a calcular para o número de dígitos
// O valor depende de o limite de segurança estar ativado ou não
function checkInputLength() {
  if (numero.value.length > maxlength)
    numero.value = numero.value.slice(0, maxlength);
}

function calcularPrimos() {
  if (numero.value < 0)
    return toast({ text: "Negativo! Insira um número positivo" });

  Toast.dismissAll();
  const inicioCalculo = new Date();

  // Dois é o único primo par, então fica prefixado
  let numerosPrimos = [2];
  let primosAteNumero = [0, 1];

  if (fazerGrafico) {
    for (let index = 3; index < numero.value; index += 2) {
      if (ePrimo(index) == true) {
        numerosPrimos.push(index);
      }
      primosAteNumero.push(numerosPrimos.length);
      primosAteNumero.push(numerosPrimos.length);
    }
  } else {
    for (let index = 3; index < numero.value; index += 2) {
      if (ePrimo(index) == true) {
        numerosPrimos.push(index);
      }
    }
  }

  const fimCalculo = new Date();
  NumerosPrimosTxt.innerHTML = numerosPrimos;

  if (numerosPrimos.length > 0) {
    toast({
      text: "Calculados " + numerosPrimos.length + " números primos!",
    });
    toast({
      text:
        "Tempo de execução: " +
        (fimCalculo - inicioCalculo) / 1000 +
        " segundos",
    });
  } else {
    toast({ text: "Nulo! Insira um valor" });
  }

  if (fazerGrafico) {
    desenharGrafico(numero, primosAteNumero);
  }
}

function desenharGrafico(numero, numerosAtePrimo) {
  // Gerar o eixo X do gráfico
  let numerosLabels = [];
  for (let i = 1; i <= numero.value; i++) {
    numerosLabels.push(i);
  }

  // Limpar gráfico anterior
  if (grafico) grafico.destroy();

  // Desenhar novo gráfico
  const ctx = document.querySelector("#myChart").getContext("2d");
  grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: numerosLabels,
      datasets: [
        {
          label: "Números primos até o número",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: numerosAtePrimo,
        },
      ],
    },

    // Configuration options go here
    options: {
      elements: {
        line: {
          tension: 0, // disables bezier curves
        },
      },
    },
  });
}

// Verifica se o número é primo
function ePrimo(numero) {
  for (let i = 2; i <= Math.sqrt(numero); i++) {
    if (numero % i == 0) {
      return false;
    }
  }
  return true;
}
