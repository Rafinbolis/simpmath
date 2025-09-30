const express = require('express');
const path = require('path');
const app = express();
const {gerarNumero} = require('./utils/numeros');
const bodyParser = require('body-parser');
const port = 8080;

// Carrega os dados do de todos os anos ano

const materia6 = require('./public/data/6materia.json');
const materia7 = require('./public/data/7.json');
const materia8 = require('./public/data/8.json');
const materia9 = require('./public/data/9.json');

const exercicio6 = require('./public/data/6exercicios.json');


// Configuração do EJS e arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));
let currentChallenge = null;

 
// Rotas
app.get('/', (req, res) => {
  res.render('inicio', {
     ano6: materia6,
     ano7: materia7,
     ano8: materia8,
     ano9: materia9, // Mudamos de 'dados' para 'dados6' para combinar com o EJS
    mostrarOutrosAnos: false
  });
});

// Rota para listar todas as matérias
app.get('/materias', (req, res) => {
  res.render('materias', {
    ano6: materia6,
    ano7: materia7,
    ano8: materia8,
    ano9: materia9,
    materiaAtual: null
  });
});

// Rota para matérias específicas do 6º ano
app.get('/materias/6/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= materia6.materias.length) {
    return res.status(404).send('Matéria não encontrada');
  }
  res.render('materias', {
    ano6: materia6,
    ano7: materia7,
    ano8: materia8,
    ano9: materia9,
    materiaAtual: materia6.materias[id]
  });
});

app.get('/materias/7/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= materia7.materias.length) {
    return res.status(404).send('Matéria não encontrada');
  }
  res.render('materias', {
    ano6: materia6,
    ano7: materia7,
    ano8: materia8,
    ano9: materia9,
    materiaAtual: materia7.materias[id]
  });
});

app.get('/materias/8/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= materia8.materias.length) {
    return res.status(404).send('Matéria não encontrada');
  }
  res.render('materias', {
    ano6: materia6,
    ano7: materia7,
    ano8: materia8,
    ano9: materia9,
    materiaAtual: materia8.materias[id]
  });
});

app.get('/materias/9/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= materia9.materias.length) {
    return res.status(404).send('Matéria não encontrada');
  }
  res.render('materias', {
    ano6: materia6,
    ano7: materia7,
    ano8: materia8,
    ano9: materia9,
    materiaAtual: materia9.materias[id]
  });
});

// Rota genérica (retorna 404 para outros anos)
app.get('/materias/:ano', (req, res) => {
  res.status(404).send('Série em desenvolvimento - Volte em breve!');
});

// Rota do sobre
app.get('/sobre', (req, res) => {
  res.render('sobre');
});

//rota para os numeros 
app.get('/exercicios', (req, res) => {
  try {
    const materiaId = parseInt(req.query.materia);
    const ano = req.query.ano || '6';
    
    // Verifica se materiaId é um número válido
    if (isNaN(materiaId)) {
      return res.status(400).send('ID da matéria inválido');
    }

    // Seleciona os dados do ano correto
    let materiaData;
    switch(ano) {
      case '6': materiaData = materia6; break;
      case '7': materiaData = materia7; break;
      case '8': materiaData = materia8; break;
      case '9': materiaData = materia9; break;
      default: materiaData = materia6;
    }

    // Verifica se encontrou a matéria
    const materiaAtual = materiaData.materias.find(m => m.id === materiaId);
    
    if (!materiaAtual) {
      console.error(`Matéria não encontrada - ID: ${materiaId}, Ano: ${ano}`);
      return res.status(404).render('exercicios', {
        error: 'Matéria não encontrada',
        ano6: materia6,
        ano7: materia7,
        ano8: materia8,
        ano9: materia9
      });
    }

    // Encontra exercícios do mesmo tema
    const exerciciosDoTema = exercicio6.questoes.find(q => q.tema === materiaAtual.nome);
    
    // Processa os exercícios (agora a geração de números é feita dentro do processamento)
    const exerciciosProcessados = exerciciosDoTema ? 
        processarExerciciosComNumeros(exerciciosDoTema) : null;

    res.render('exercicios', {
      materiaAtual: materiaAtual,
      exercicios: exerciciosProcessados,
      ano6: materia6,
      ano7: materia7,
      ano8: materia8,
      ano9: materia9,
      feedback: null
    });

  } catch (error) {
    console.error('Erro na rota /exercicios:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

function substituirVariaveis(texto, numeros) {
  if (typeof texto !== 'string') return texto;
  
  return texto.replace(/{([^{}]+)}/g, (match, expressao) => {
    console.log(`Processando expressão: ${expressao}`);
    
    // Primeiro, verifica se é uma variável direta
    if (numeros[expressao] !== undefined) {
      return numeros[expressao].toString();
    }
    
    // Tenta avaliar a expressão matemática
    try {
      // Substitui variáveis pelos valores - IMPORTANTE: mantém os operadores
      let expressaoProcessada = expressao;
      
      // Substitui cada variável pelo seu valor
      Object.keys(numeros).forEach(variavel => {
        // Usa regex com word boundaries para substituir apenas a variável completa
        const regex = new RegExp(`\\b${variavel}\\b`, 'g');
        expressaoProcessada = expressaoProcessada.replace(regex, numeros[variavel]);
      });
      
      console.log(`Expressão processada: ${expressaoProcessada}`);
      
      // Remove possíveis espaços em branco extras
      expressaoProcessada = expressaoProcessada.replace(/\s+/g, '');
      
      // Avalia a expressão matemática com segurança
      const resultado = Function('"use strict"; return (' + expressaoProcessada + ')')();
      
      console.log(`Resultado: ${resultado}`);
      
      // Formata números decimais se necessário
      return Number.isInteger(resultado) ? resultado.toString() : resultado.toFixed(2);
    } catch (error) {
      console.error(`Erro ao processar expressão: ${expressao}`, error);
      // Se não conseguir avaliar, mantém o original
      return match;
    }
  });
}
// Nova função para processar exercícios com geração de números específica
function processarExerciciosComNumeros(exercicios) {
  if (!exercicios || !exercicios.perguntas) return exercicios;
  
  const exerciciosProcessados = JSON.parse(JSON.stringify(exercicios));
  
  exerciciosProcessados.perguntas.forEach((pergunta, perguntaIndex) => {
    console.log(`\nProcessando pergunta ${perguntaIndex + 1}`);
    
    // DEFINE QUANTIDADE DE NÚMEROS - ADICIONE ESTA LINHA
    const qtd = pergunta.quantidade_numeros || 2;
    
    const parametros = {
      qtd: qtd, // USA A QUANTIDADE DO JSON OU PADRÃO 2
      min: pergunta.minimo || 1,
      max: pergunta.maximo || 12
    };
    
    const config = pergunta.config || {};
    
    // Detecta automaticamente o tipo de operação
    const textoCompleto = JSON.stringify(pergunta).toLowerCase();
    
    if (!config.evitarNegativos && (textoCompleto.includes('{num1 - num2') || 
        textoCompleto.includes('subtrair') ||
        textoCompleto.includes('sobrar') ||
        textoCompleto.includes('restar') ||
        textoCompleto.includes('diferença'))) {
      config.evitarNegativos = true;
    }
    
    if (!config.num1Maior && (textoCompleto.includes('{num1 / num2') || 
        textoCompleto.includes('dividir') ||
        textoCompleto.includes('divisão') ||
        textoCompleto.includes('repartir') ||
        textoCompleto.includes('pedaços'))) {
      config.num1Maior = true;
      
      if (textoCompleto.includes('pedaços') && textoCompleto.includes('pessoas')) {
        config.divisivelPor = 'num2';
      }
    }
    
    console.log(`Parâmetros: qtd=${parametros.qtd}, min=${parametros.min}, max=${parametros.max}, config=`, config);
    
    const valores = gerarNumero(parametros.qtd, parametros.min, parametros.max, config);
    const numeros = {};
    
    // Cria objeto com nomes de variáveis (num1, num2, num3, etc.)
    for (let i = 0; i < valores.length; i++) {
      numeros[`num${i + 1}`] = valores[i];
    }

    // CÁLCULOS ESPECIAIS PARA MÚLTIPLOS NÚMEROS
    if (pergunta.config && pergunta.config.calcularDivisores) {
      const num = numeros.num1;
      const divisores = [];
      
      for (let i = 1; i <= num; i++) {
        if (num % i === 0) divisores.push(i);
      }
      
      numeros.quantidadeDivisores = divisores.length;
      numeros.listaDivisores = divisores.join(', ');
    }
    
    // CÁLCULO DE MMC PARA MÚLTIPLOS NÚMEROS
    if (valores.length >= 2) {
      const { mmc: calcularMMC } = require('./utils/numeros');
      let resultadoMMC = valores[0];
      
      for (let i = 1; i < valores.length; i++) {
        resultadoMMC = calcularMMC(resultadoMMC, valores[i]);
      }
      
      numeros.mmc = resultadoMMC;
    }
    
    // CÁLCULO DE MDC PARA MÚLTIPLOS NÚMEROS
    if (valores.length >= 2 && textoCompleto.includes('mdc')) {
      const { mdc: calcularMDC } = require('./utils/numeros');
      let resultadoMDC = valores[0];
      
      for (let i = 1; i < valores.length; i++) {
        resultadoMDC = calcularMDC(resultadoMDC, valores[i]);
      }
      
      numeros.mdc = resultadoMDC;
    }
    
    // OPERAÇÕES MATEMÁTICAS BÁSICAS
    numeros.soma = valores.reduce((a, b) => a + b, 0);
    numeros.produto = valores.reduce((a, b) => a * b, 1);
    
    // Para 2 números mantém diferença
    if (valores.length === 2) {
      numeros.diferenca = Math.abs(valores[0] - valores[1]);
      if (config.num1Maior) {
        numeros.divisao = valores[0] / valores[1];
        numeros.divisaoExata = (valores[0] % valores[1] === 0);
      }
    }
    
    console.log(`Números gerados:`, numeros);
    
    // Processa todos os textos
    if (Array.isArray(pergunta.enunciado)) {
      pergunta.enunciado = pergunta.enunciado.map(linha => 
        substituirVariaveis(linha, numeros)
      );
    } else {
      pergunta.enunciado = substituirVariaveis(pergunta.enunciado, numeros);
    }
    
    if (pergunta.resposta) {
      pergunta.resposta = substituirVariaveis(pergunta.resposta, numeros);
    }
    
    if (pergunta.explicacao) {
      pergunta.explicacao = substituirVariaveis(pergunta.explicacao, numeros);
    }
    
    pergunta.numerosGerados = numeros;
  });
  
  return exerciciosProcessados;
}



// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});