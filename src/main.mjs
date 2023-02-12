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
const graficoCheckbox = document.querySelector("#graficoCheckbox");
const segurancaCheckbox = document.querySelector("#segurancaCheckbox");
const segurancaLabel = document.querySelector("#limiteSegurancaLabel");
const graficoLabel = document.querySelector("#graficoLabel");
const botao = document.querySelector("#botao");

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
  segurancaLabel.classList.toggle("red-text");
  graficoLabel.classList.toggle("red-text");
  botao.classList.toggle("red");

  graficoCheckbox.checked = false;
  maxlength = maxlength === 5 ? 32 : 5;
  numero.value = numero.value.slice(0, maxlength);
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
  if (!numero.value) {
    return toast({ text: "Nulo! Insira um valor" });
  }

  if (numero.value < 0) {
    return toast({ text: "Negativo! Insira um número positivo" });
  }

  Toast.dismissAll();
  const inicioCalculo = new Date();

  // Dois é o único primo par, então fica prefixado
  let numerosPrimos = [2];
  let primosAteNumero = [0, 1];

  // Calcular todos os números primos até o número
  for (let index = 3; index < numero.value; index += 2) {
    if (ePrimo(index)) {
      numerosPrimos.push(index);
    }

    // Como pulamos os números pares, precisamos adicionar duas vezes
    primosAteNumero.push(numerosPrimos.length);
    primosAteNumero.push(numerosPrimos.length);
  }

  const fimCalculo = new Date();
  NumerosPrimosTxt.innerHTML = numerosPrimos;

  toast({
    text: "Calculados " + numerosPrimos.length + " números primos!",
  });
  toast({
    text:
      "Tempo de execução: " +
      (fimCalculo.getMilliseconds() - inicioCalculo.getMilliseconds()) / 1000 +
      " segundos",
  });

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
    options: {
      elements: {
        line: {
          tension: 0, // Desabilitar curvas suavizadas
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
