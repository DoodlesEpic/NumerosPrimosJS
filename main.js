// DOM
const numero = document.querySelector("#numero");
const TxtNumerosPrimos = document.querySelector("#numeros_primos");
const TxtNumerosPrimosQuantos = document.querySelector(
  "#numeros_primos_quantos"
);
const graficoCheckbox = document.querySelector("#graficoCheckbox");

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
    return M.toast({ text: "Negativo! Insira um número positivo" });

  M.Toast.dismissAll();
  const inicioCalculo = new Date();

  // Dois é o único primo par, então fica prefixado
  let numerosPrimos = [2];
  let primosAteNumero = [0, 1];

  if (fazerGrafico) {
    for (index = 3; index < numero.value; index += 2) {
      if (ePrimo(index) == true) {
        numerosPrimos.push(index);
      }
      primosAteNumero.push(numerosPrimos.length);
      primosAteNumero.push(numerosPrimos.length);
    }
  } else {
    for (index = 3; index < numero.value; index += 2) {
      if (ePrimo(index) == true) {
        numerosPrimos.push(index);
      }
    }
  }

  const fimCalculo = new Date();
  TxtNumerosPrimos.innerHTML = numerosPrimos;

  if (numerosPrimos.length > 0) {
    M.toast({
      text: "Calculados " + numerosPrimos.length + " números primos!",
    });
    M.toast({
      text:
        "Tempo de execução: " +
        (fimCalculo - inicioCalculo) / 1000 +
        " segundos",
    });
  } else {
    M.toast({ text: "Nulo! Insira um valor" });
  }

  if (fazerGrafico) {
    desenharGrafico(numero, primosAteNumero);
  }
}

function desenharGrafico(numero, numerosAtePrimo) {
  let numerosLabels = [];

  for (let i = 1; i <= numero.value; i++) {
    numerosLabels.push(i);
  }

  const ctx = document.querySelector("#myChart").getContext("2d");
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
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
  for (i = 2; i < numero; i++) {
    if (numero % i == 0) {
      return false;
    }
  }
  return true;
}
