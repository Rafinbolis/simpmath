const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Carrega os dados do 6º ano
const dados = require('./6.json');

// Configuração do EJS e arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => {
  res.render('inicio', {
    dados6: dados,  // Mudamos de 'dados' para 'dados6' para combinar com o EJS
    mostrarOutrosAnos: false
  });
});

// Rota para listar todas as matérias
app.get('/materias', (req, res) => {
  res.render('materias', {
    materias: dados.materias,
    materiaAtual: null
  });
});

// Rota para matérias específicas do 6º ano
app.get('/materias/6/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= dados.materias.length) {
    return res.status(404).send('Matéria não encontrada');
  }
  res.render('materias', {
    materias: dados.materias,
    materiaAtual: dados.materias[id]
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

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});