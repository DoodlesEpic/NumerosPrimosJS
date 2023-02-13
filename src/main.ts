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
const numero: HTMLInputElement =
  document.querySelector("#numero") || document.createElement("input");

const graficoCheckbox: HTMLInputElement =
  document.querySelector("#graficoCheckbox") || document.createElement("input");

const segurancaCheckbox: HTMLInputElement =
  document.querySelector("#segurancaCheckbox") ||
  document.createElement("input");

const calculoBtn: HTMLAnchorElement =
  document.querySelector("#botao") || document.createElement("a");

const NumerosPrimosTxt: HTMLParagraphElement =
  document.querySelector("#numeros_primos") || document.createElement("p");

const segurancaLabel: HTMLSpanElement =
  document.querySelector("#limiteSegurancaLabel") ||
  document.createElement("span");

const graficoLabel: HTMLSpanElement =
  document.querySelector("#graficoLabel") || document.createElement("span");

// Event binds
numero.addEventListener("input", limitarInput);
calculoBtn.addEventListener("click", calcularPrimos);
graficoCheckbox.addEventListener("change", toggleGrafico);
segurancaCheckbox.addEventListener("change", toggleSegurança);

// Mantém o estado do gráfico chart.js
// Usado para limpar o gráfico entre cálculos
let grafico: Chart<"line", number[], number>;

// Config
let maxlength = 5;
let fazerGrafico = true;

// Desabilita o limite de 5 dígitos para o número a calcular
// Quando desabilitado há uma chance alta de o web app travar
function toggleSegurança() {
  segurancaLabel.classList.toggle("red-text");
  graficoLabel.classList.toggle("red-text");
  calculoBtn.classList.toggle("red");

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

  if (parseFloat(numero.value) < 0) {
    return toast({ text: "Negativo! Insira um número positivo" });
  }

  Toast.dismissAll();
  const inicioCalculo = new Date();
  const [numerosPrimos, primosAteNumero] = crivoEratostenes(
    parseInt(numero.value)
  );
  const fimCalculo = new Date();
  NumerosPrimosTxt.innerHTML = numerosPrimos.toString();

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
    desenharGrafico(parseInt(numero.value), primosAteNumero);
  }
}

function desenharGrafico(numero: number, numerosAtePrimo: number[]) {
  // Gerar o eixo X do gráfico
  let numerosLabels: number[] = [];
  for (let i = 1; i <= numero; i++) {
    numerosLabels.push(i);
  }

  // Limpar gráfico anterior
  if (grafico) grafico.destroy();

  // Desenhar novo gráfico
  const item: HTMLCanvasElement =
    document.querySelector("#myChart") || document.createElement("canvas");
  grafico = new Chart(item, {
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

function crivoEratostenes(n: number) {
  // Array que armazena todos os números até o n
  // O próximo passo será marcar os não primos nessa lista
  let numeros: boolean[] = [];
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
  let primos: number[] = [];
  let primosAteNumero: number[] = [];
  for (let i = 2; i < n; i++) {
    // O número de primos até certo número é usado para o desenho do gráfico
    primosAteNumero.push(primos.length);

    // Apenas adicionamos ao resultado os números marcados primos
    if (numeros[i]) primos.push(i);
  }

  return [primos, primosAteNumero];
}
