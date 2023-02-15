// Retorna todos os números primos até n, EXCLUINDO n
// E retorna quantos números primos tem até cada número até n, começando no 1
export default function crivoEratostenes(n: number) {
  if (n === 0) throw new Error("Número não pode ser 0");
  if (n <= 0) throw new Error("Número não pode ser negativo");
  if (!n) throw new Error("Favor informar um número");

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
  for (let i = 2; i <= n; i++) {
    // O número de primos até certo número é usado para o desenho do gráfico
    primosAteNumero.push(primos.length);

    // Apenas adicionamos ao resultado os números marcados primos
    if (numeros[i]) primos.push(i);
  }

  return [primos, primosAteNumero];
}
