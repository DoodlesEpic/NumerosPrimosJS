import "./style.scss";
import { Toast, toast } from "@materializecss/materialize";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
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
numero.addEventListener("input", limitarInput);
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
  limitarInput();
}

// Alterna a exibição do gráfico
function toggleGrafico() {
  fazerGrafico = graficoCheckbox.checked;
}

// Limita o número a calcular para o número de dígitos
// O valor depende de o limite de segurança estar ativado ou não
function limitarInput() {
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
  const [numerosPrimos, primosAteNumero] = crivoEratostenes(numero.value);
  const fimCalculo = new Date();
  NumerosPrimosTxt.innerHTML = numerosPrimos;

  toast({
    text: "Calculados " + numerosPrimos.length + " números primos!",
  });
  toast({
    text:
      "Tempo de execução: " +
      (fimCalculo.getTime() - inicioCalculo.getTime()) / 1000 +
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

function crivoEratostenes(n) {
  // Array que armazena todos os números até o n
  // O próximo passo será marcar os não primos nessa lista
  let numeros = [];
  for (let i = 0; i < n; i++) {
    numeros.push(true);
  }

  // Marcamos os múltiplos de primos
  // Todos números marcados como false NÃO são primos
  const limite = Math.sqrt(n);
  for (let i = 2; i <= limite; i++) {
    if (numeros[i])
      for (let j = i * i; j < n; j += i) {
        numeros[j] = false;
      }
  }

  // Todos itens setados como true são primos
  // Criamos um novo array que apenas contém os números primos
  let primos = [];
  let primosAteNumero = [];
  for (let i = 2; i < n; i++) {
    // O número de primos até certo número é usado para o desenho do gráfico
    primosAteNumero.push(primos.length);

    // Apenas adicionamos ao resultado os números marcados primos
    if (numeros[i]) primos.push(i);
  }

  return [primos, primosAteNumero];
}
