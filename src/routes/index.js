const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { 
  res.render('pages/index') // o caminho das views foi setado no app.set('views') em app.js, aqui só precisamos setar a apasta a partir daí
});

module.exports = router;