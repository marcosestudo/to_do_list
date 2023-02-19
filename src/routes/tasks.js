const express = require('express');
// A rota das tasks vêm depois das rotas dos checklists: checklists/:id/tasks...
// Por isso npomearemos o router das tasks como checklistDependentRoute
const checklistDependentRoute = express.Router();
const simpleRouter = express.Router();

const Checklist = require('../models/checklist');
const Task = require('../models/task');

checklistDependentRoute.get('/:id/tasks/new', async (req, res) => {
  try {
    let task = new Task();
    res.status(200).render('tasks/new', { "checklistId": req.params.id, "task": task });
  } catch (error) {
    res.status(422).render('pages/error', { "errors": "Erro ao carregar o formulário" });
  }
});

checklistDependentRoute.post('/:id/tasks', async (req, res) => {
  let { name } = req.body.task;
  let task = new Task({ name, "checklist": req.params.id });

  try {
    await task.save(); // salvando a task no mongo
    let checklist = await Checklist.findById(req.params.id);
    checklist.tasks.push(task); // adicionando a task na checklist
    await checklist.save(); // salvando a checklist com a task nova no mongo
    res.redirect(`/checklists/${req.params.id}`);
  } catch (error) {
    let errors = error.errors;
    res.status(422).render('tasks/new', { "task": { ...task, errors }, checklistId: req.params.id });
  }
});

simpleRouter.delete('/:id', async (req, res) => {
  try {
    let task = await Task.findByIdAndDelete(req.params.id);
    let checklist = await Checklist.findById(task.checklist);
    let taskToRemove = checklist.tasks.indexOf(task._id);
    checklist.tasks.splice(taskToRemove, 1);
    checklist.save();
    res.redirect(`/checklists/${checklist._id}`);
  } catch (error) {
    res.status(422).render('pages/error', { "error": "Erro ao deletar tarefa" });
  }
});

simpleRouter.put('/:id', async (req, res) => {
  let task = await Task.findById(req.params.id);

  try {
    task.set(req.body.task); // Também poderíamos usar task.update() - req.body.task vem do input checkbox em show.ejs
    task.save();
    res.status(200).json({ task }); // retronaremos um json para não precisarmos recarregar a página com um redirect, depois tratamos o json com JS pra atualizar a tela, no React isso é automático
  } catch (error) {
    let errors = error.errors;
    res.status(422).json({ task: { ...errors } });
  }
});

module.exports = {
  "checklistDependent": checklistDependentRoute,
  "simple": simpleRouter
};