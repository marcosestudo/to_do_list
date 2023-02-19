const express = require('express');
const path = require('path');

const checklistRouter = require('./src/routes/checklist');
const taskRouter = require('./src/routes/tasks');
const rootRouter = require('./src/routes/index');

const methodOverride = require('method-override');

require('./config/database');

const app = express();
app.use(express.json()); // processador de json
app.use(express.urlencoded({'extended': true})); // procesador de requisições vindas da url
app.use(methodOverride('_method', {methods: ['POST', 'GET']})); // processador do parâmetro _method da url; sobrescreverá os métodos POST e GET

// os aqruivos estáticos estão na pasta public por padrão
app.use(express.static(path.join(__dirname, 'public/')));

// Path padrão das nossas views
app.set('views', path.join(__dirname, 'src/views')); // __dirname é o nosso diretório atual
// Estamos dizendo pro express que a nossa view engine é o ejs
app.set('view engine', 'ejs');

// Rotas / middlewares
app.use('/', rootRouter);
app.use('/checklists', checklistRouter);
app.use('/checklists', taskRouter.checklistDependent); // podemos pôr mais de um middleware com a mesma url
app.use('/tasks', taskRouter.simple);

app.listen(3000, () => {
  console.log('Servidor iniciado...\n(Ctrl + C) para encerrar')
});
