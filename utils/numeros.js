function gerarNumeros(qtd = 2, min, max, config = {}) {
  const { evitarNegativos = false, num1Maior = false, divisivelPor = null } = config;
  const numeros = [];
  
  for (let i = 0; i < qtd; i++) {
    if (i === 1 && evitarNegativos && numeros.length > 0) {
      // Para o segundo número, garantir que não seja maior que o primeiro (subtração)
      const primeiroNumero = numeros[0];
      const novoMin = Math.max(min, 1); // Pelo menos 1
      const novoMax = Math.min(max, primeiroNumero); // Não maior que o primeiro
      
      numeros.push(Math.floor(Math.random() * (novoMax - novoMin + 1)) + novoMin);
    } 
    else if (i === 1 && num1Maior && numeros.length > 0) {
      // Para garantir que num1 > num2 (divisão)
      const primeiroNumero = numeros[0];
      const novoMin = Math.max(min, 2); // Pelo menos 2 para evitar divisão por 1
      const novoMax = Math.min(max, primeiroNumero - 1); // Menor que o primeiro
      
      // Se divisivelPor for especificado, garantir que num1 seja divisível por num2
      let numeroGerado;
      if (divisivelPor === 'num2' && numeros.length > 0) {
        // Encontrar um divisor do primeiro número
        const divisores = encontrarDivisores(primeiroNumero);
        // Filtrar divisores dentro do range permitido
        const divisoresValidos = divisores.filter(d => d >= novoMin && d <= novoMax && d < primeiroNumero);
        
        if (divisoresValidos.length > 0) {
          numeroGerado = divisoresValidos[Math.floor(Math.random() * divisoresValidos.length)];
        } else {
          // Fallback: gerar número normal se não encontrar divisores válidos
          numeroGerado = Math.floor(Math.random() * (novoMax - novoMin + 1)) + novoMin;
        }
      } else {
        numeroGerado = Math.floor(Math.random() * (novoMax - novoMin + 1)) + novoMin;
      }
      
      numeros.push(numeroGerado);
    }
    else {
      // Número normal
      numeros.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
  }
  
  return numeros;
}

// Função auxiliar para encontrar divisores de um número
function encontrarDivisores(numero) {
  const divisores = [];
  for (let i = 1; i <= numero; i++) {
    if (numero % i === 0) {
      divisores.push(i);
    }
  }
  return divisores;
}

// Também exporta a versão no singular para compatibilidade
function gerarNumero(qtd = 2, min, max, config = {}) {
  return gerarNumeros(qtd, min, max, config);
}

module.exports = { gerarNumeros, gerarNumero, encontrarDivisores };