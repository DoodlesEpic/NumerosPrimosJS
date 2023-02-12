let maxlength = 5;
let fazerGrafico = true;
let numero = document.getElementById("numero");
let TxtNumerosPrimos = document.getElementById("numeros_primos");
let TxtNumerosPrimosQuantos = document.getElementById("numeros_primos_quantos");

function toggleSegurança() {
  let segurancaLabel = document.getElementById("limiteSegurancaLabel");
  let graficoLabel = document.getElementById("graficoLabel");
  let graficoCheckbox = document.getElementById("graficoCheckbox");
  let botao = document.getElementById("botao");
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

function toggleGrafico() {
  fazerGrafico = document.getElementById("graficoCheckbox").checked;
}

function checkInputLength() {
  if (numero.value.length > maxlength)
    numero.value = numero.value.slice(0, maxlength);
}

function calcularPrimos() {
  M.Toast.dismissAll();
  let inicioCalculo = new Date();

  let numerosPrimos = [];
  let numerosAtePrimo = [];
  if (fazerGrafico) {
    for (index = 0; index < numero.value; index++) {
      if (ePrimo(index) == true) {
        numerosPrimos.push(index);
      }
      numerosAtePrimo.push(numerosPrimos.length);
    }
  } else {
    for (index = 0; index < numero.value; index++) {
      if (ePrimo(index) == true) {
        numerosPrimos.push(index);
      }
    }
  }

  TxtNumerosPrimos.innerHTML = numerosPrimos;
  let fimCalculo = new Date();
  if (numerosPrimos.length > 0) {
    M.toast({
      html: "Calculados " + numerosPrimos.length + " números primos!",
    });
    M.toast({
      html:
        "Tempo de execução: " +
        (fimCalculo - inicioCalculo) / 1000 +
        " segundos",
    });
  } else if (numero.value < 0) {
    M.toast({ html: "Negativo! Insira um número positivo" });
  } else {
    M.toast({ html: "Nulo! Insira um valor" });
  }

  if (fazerGrafico) {
    var numerosLabels = [];

    for (var i = 1; i <= numero.value; i++) {
      numerosLabels.push(i);
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
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
}

function ePrimo(numero) {
  for (i = 2; i < numero; i++) {
    if (numero % i == 0) {
      return false;
    }
  }
  return true;
}
