function gerarNumeros(qtd = 2, min, max, config = {}) {
  const { evitarNegativos = false, num1Maior = false, divisivelPor = null, calcularDivisores = false } = config;
  const numeros = [];
  
  for (let i = 0; i < qtd; i++) {
    if (i === 1 && evitarNegativos && numeros.length > 0) {
      // Para o segundo número, garantir que não seja maior que o primeiro (subtração)
      const primeiroNumero = numeros[0];
      const novoMin = Math.max(min, 1);
      const novoMax = Math.min(max, primeiroNumero);
      
      numeros.push(Math.floor(Math.random() * (novoMax - novoMin + 1)) + novoMin);
    } 
    else if (i === 1 && num1Maior && numeros.length > 0) {
      // Para garantir que num1 > num2 (divisão)
      const primeiroNumero = numeros[0];
      const novoMin = Math.max(min, 2);
      const novoMax = Math.min(max, primeiroNumero - 1);
      
      let numeroGerado;
      if (divisivelPor === 'num2' && numeros.length > 0) {
        const divisores = encontrarDivisores(primeiroNumero);
        const divisoresValidos = divisores.filter(d => d >= novoMin && d <= novoMax && d < primeiroNumero);
        
        if (divisoresValidos.length > 0) {
          numeroGerado = divisoresValidos[Math.floor(Math.random() * divisoresValidos.length)];
        } else {
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

// Função para calcular MDC (máximo divisor comum)
function mdc(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Função para calcular MMC
function mmc(a, b) {
  return (a * b) / mdc(a, b);
}




module.exports = { gerarNumeros, gerarNumero, encontrarDivisores, mdc, mmc };