import "./style.scss";
import crivoEratostenes from "./crivo/eratostenes";
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
  try {
    // Calcular números primos
    const inicioCalculo = new Date();
    const [numerosPrimos, primosAteNumero] = crivoEratostenes(
      parseInt(numero.value)
    );
    const fimCalculo = new Date();

    // Mostrar os resultados e o tempo de execução
    Toast.dismissAll();
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

    // Desenhar o gráfico se estiver habilitado
    if (fazerGrafico) {
      desenharGrafico(parseInt(numero.value), primosAteNumero);
    }
  } catch (erro) {
    return toast({
      text: erro instanceof Error ? erro.message : "Erro",
    });
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
