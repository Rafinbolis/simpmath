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
app.get('/exercicio/6/:id(\\d+)', (req, res)=>{
  const id = parseInt(req.params.id);
  const numeros = gerarNumero();
  res.render('exercicio', {
    numeros:{
      total: numeros.num1,
      comidos: numeros.num2,
      sobre: numeros.resultado
      },
      ano6: materia6,
      ano7: materia7,
      ano8: materia8,
      ano9: materia9,
    feedback: null
  });
  
});

app.post('/verificar', (req, res) => {
    if (!currentChallenge) {
    return res.redirect('/exercicio'); // Redireciona se não houver desafio
  }

  const respostaUsuario = parseInt(req.body.resposta);
  if (isNaN(respostaUsuario)) {
    return res.status(400).send('Resposta inválida');
  }


  const feedback = {
    respostaUsuario: respostaUsuario,
    correto: respostaUsuario === currentChallenge.resultadoCorreto,
    resultadoCorreto: currentChallenge.resultadoCorreto
  };
    res.render('numeros', {
    challenge: currentChallenge,
    feedback: feedback
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});