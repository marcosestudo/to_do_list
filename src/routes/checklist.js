const express = require('express');
const router = express.Router();
const Checklist = require('../models/checklist');
const Task = require('../models/task');

router.get('/', async (req, res) => {
  try {
    let checklists = await Checklist.find({});
    res.status(200).render('checklists/index', { "checklists": checklists });
  } catch (error) {
    res.status(500).render('pages/error', { "error": "Erro ao exibir as listas" });
  }
});

router.get('/new', async (req, res) => {
  try {
    let checklist = new Checklist(); // a rota get new cria um objeto vazio pra ser preenchido com o post
    res.status(200).render('checklists/new', { "checklist": checklist });
  } catch (error) {
    res.status(500).render('pages/error', { "error": "Erro ao carregar o formulário" });
  }
});

// pega lista de tarefas pelo id na url e passa para a edição no router.put('/:id', ...
router.get('/:id/edit', async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    res.status(200).render('checklists/edit', { "checklist": checklist });
  } catch (error) {
    res.status(500).render('pages/error', { "error": "Erro ao exibir edição da lista de tarefas" })
  }
});

router.post('/', async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = new Checklist({ name });
  try {
    checklist.name ? checklist.name : checklist.name = " ";
    await checklist.save();
    res.redirect('/checklists');
  } catch (error) {
    res.status(422).render('checklists/new', { "checklists": { ...checklist, error } });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id).populate('tasks'); // populate('tasks') faz o mongoose buscar as tasks referentes à checklist
    res.status(200).render('checklists/show', { "checklist": checklist });     // populate é como se o mongoose estivesse usando o aggregate do mongo, não esqeuça o populate
  } catch (error) {
    res.status(500).render('pages/error', { "error": "Erro ao exibir a lista de tarefas" });
  }
});

// Atualiza a lista de tarefas
router.put('/:id', async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = Checklist.findById(req.params.id); // Estamos buscando o checklist fora do try para que ele seja passado pro error caso dê algo errado

  try {
    await Checklist.updateOne({ name });
    res.redirect('/checklists');
  } catch (error) {
    let errors = error.errors; // error é um objeto que vem com o atributo errors
    res.status(422).render('checklists/edit', { "checklist": { ...checklist, errors } });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    for (let i = 0; i < checklist.tasks.length; i++) {  // apagando as tasks no banco de daos antes de apagar a checklkist
      await Task.findByIdAndDelete(checklist.tasks[i]); // se não elas ficam no banco sem referência
    }
    console.log(checklist.tasks);
    checklist.delete();        
    res.status(200).redirect('/checklists');
  } catch (error) {
    res.status(500).render('pages/error', { error });
  }
});

module.exports = router;